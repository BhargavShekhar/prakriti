import { prisma } from "../../common/db/db.js";
import ApiError from "../../common/utils/api-error.js";;

type AttemptStatus = "IN_PROGRESS" | "FINISHED";

const statusOf = (a: { finishedAt: Date | null }): AttemptStatus =>
    a.finishedAt ? "FINISHED" : "IN_PROGRESS";

function isUniqueViolation(err: unknown): boolean {
    return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";
}

export async function startAttempt({ packSlug, userId, terrainSlug }: {
    userId: string,
    packSlug: string,
    terrainSlug?: string
}) {
    const pack = await prisma.pack.findFirst({
        where: { slug: packSlug, isPublished: true },
        select: { id: true },
    });

    if (!pack) {
        throw ApiError.notfound("Pack not found");
    }

    const findExisting = () => (
        prisma.quizAttempt.findUnique({
            where: { userId_packId: { userId, packId: pack.id } },
            select: { id: true, finishedAt: true },
        })
    )

    // Get-or-create: a student has exactly one attempt per pack
    const existing = await findExisting();
    if (existing) {
        return { attemptId: existing.id, status: statusOf(existing) };
    }

    const questionCount = await prisma.packQuestion.count({
        where: { packId: pack.id, question: { isPublished: true } },
    });

    if (questionCount === 0) {
        throw ApiError.badRequest("This quiz has no questions yet");
    }

    try {
        const created = await prisma.quizAttempt.create({
            data: { userId, packId: pack.id },
            select: { id: true, finishedAt: true },
        });
        return { attemptId: created.id, status: statusOf(created) };
    } catch (err) {
        // Two simultaneous starts: the unique index rejected one, so return the winner
        if (isUniqueViolation(err)) {
            const winner = await findExisting();
            if (winner) {
                return { attemptId: winner.id, status: statusOf(winner) };
            }
        }
        throw err;
    }
}

/* ----------------------------------- get ---------------------------------- */

export async function getAttempt(userId: string, attemptId: string) {
    const attempt = await prisma.quizAttempt.findFirst({
        where: { id: attemptId, userId },
        select: {
            id: true,
            packId: true,
            score: true,
            startedAt: true,
            finishedAt: true,
            pack: { select: { slug: true, name: true } },
            answers: {
                select: {
                    questionId: true,
                    selectedOptionId: true,
                    isCorrect: true,
                    pointsAwarded: true,
                },
            },
        },
    });

    if (!attempt) {
        throw ApiError.notfound("Quiz attempt not found");
    }

    const rows = await prisma.packQuestion.findMany({
        where: { packId: attempt.packId, question: { isPublished: true } },
        orderBy: { sortOrder: "asc" },
        select: {
            sortOrder: true,
            question: {
                select: {
                    id: true,
                    text: true,
                    points: true,
                    explanation: true,
                    terrain: { select: { id: true, name: true, slug: true } },
                    options: {
                        orderBy: { sortOrder: "asc" },
                        select: { id: true, text: true, isCorrect: true },
                    },
                },
            },
        },
    });

    const answerByQuestion = new Map(attempt.answers.map((a) => [a.questionId, a]));
    const finished = attempt.finishedAt !== null;

    const questions = rows.map(({ question: q, sortOrder }) => {
        const answered = answerByQuestion.get(q.id);

        // Correctness and explanation are revealed only for answered questions,
        // or for everything once the attempt is finished.
        const reveal = finished || answered !== undefined;
        const correct = q.options.find((o) => o.isCorrect);

        return {
            id: q.id,
            text: q.text,
            points: q.points,
            sortOrder,
            terrain: q.terrain,
            // isCorrect is stripped here, so it can never leak through `options`
            options: q.options.map((o) => ({ id: o.id, text: o.text })),
            answer: reveal
                ? {
                      selectedOptionId: answered?.selectedOptionId ?? null,
                      isCorrect: answered?.isCorrect ?? false,
                      pointsAwarded: answered?.pointsAwarded ?? 0,
                      correctOptionId: correct?.id ?? null,
                      explanation: q.explanation,
                  }
                : null,
        };
    });

    return {
        id: attempt.id,
        status: statusOf(attempt),
        score: attempt.score,
        maxScore: questions.reduce((sum, q) => sum + q.points, 0),
        totalQuestions: questions.length,
        answeredCount: attempt.answers.length,
        startedAt: attempt.startedAt,
        finishedAt: attempt.finishedAt,
        pack: attempt.pack,
        questions,
    };
}

/* --------------------------------- answer --------------------------------- */

export async function submitAnswer({ attemptId, optionId, questionId, userId }: {
    userId: string;
    attemptId: string;
    questionId: string;
    optionId: string;
}) {
    try {
        return await prisma.$transaction(async (tx) => {
            const attempt = await tx.quizAttempt.findFirst({
                where: { id: attemptId, userId },
            });

            if (!attempt) {
                throw ApiError.notfound("Quiz attempt not found");
            }

            if (attempt.finishedAt) {
                throw ApiError.badRequest("Quiz attempt is already completed");
            }

            const question = await tx.question.findFirst({
                where: {
                    id: questionId,
                    isPublished: true,
                    packs: { some: { packId: attempt.packId } },
                },
                select: {
                    id: true,
                    points: true,
                    explanation: true,
                    options: { select: { id: true, isCorrect: true } },
                },
            });

            if (!question) {
                throw ApiError.notfound("Question not found in this quiz");
            }

            const selectedOption = question.options.find((o) => o.id === optionId);

            if (!selectedOption) {
                throw ApiError.badRequest("Invalid option for this question");
            }

            const correctOptions = question.options.filter((o) => o.isCorrect);

            if (correctOptions.length !== 1) {
                throw ApiError.badRequest("Question must have exactly one correct option");
            }

            const existingAnswer = await tx.attemptAnswer.findUnique({
                where: { attemptId_questionId: { attemptId, questionId } },
            });

            if (existingAnswer) {
                throw ApiError.conflict("Question has already been answered");
            }

            const isCorrect = selectedOption.isCorrect;
            const pointsAwarded = isCorrect ? question.points : 0;

            await tx.attemptAnswer.create({
                data: {
                    attemptId,
                    questionId,
                    selectedOptionId: optionId,
                    isCorrect,
                    pointsAwarded,
                },
            });

            const updated = await tx.quizAttempt.update({
                where: { id: attemptId },
                data: { score: { increment: pointsAwarded } },
                select: { score: true },
            });

            return {
                isCorrect,
                correctOptionId: correctOptions[0]!.id,
                explanation: question.explanation,
                pointsAwarded,
                score: updated.score,
            };
        });
    } catch (err) {
        // Double-tap race: the DB unique (attemptId, questionId) caught what findUnique missed
        if (isUniqueViolation(err)) {
            throw ApiError.conflict("Question has already been answered");
        }
        throw err;
    }
}

/* --------------------------------- finish --------------------------------- */

export async function finishAttempt(userId: string, attemptId: string) {
    const attempt = await prisma.quizAttempt.findFirst({
        where: { id: attemptId, userId },
        select: { id: true, score: true, finishedAt: true },
    });

    if (!attempt) {
        throw ApiError.notfound("Quiz attempt not found");
    }

    // Idempotent: finishing twice returns the stored result
    if (attempt.finishedAt) {
        return { attemptId: attempt.id, score: attempt.score, finishedAt: attempt.finishedAt };
    }

    const finished = await prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: { finishedAt: new Date() },
        select: { score: true, finishedAt: true },
    });

    return { attemptId: attempt.id, score: finished.score, finishedAt: finished.finishedAt };
}

/* ------------------------------ my attempts ------------------------------- */

export async function getMyAttempts(userId: string) {
    const attempts = await prisma.quizAttempt.findMany({
        where: { userId },
        select: {
            id: true,
            score: true,
            finishedAt: true,
            pack: { select: { slug: true } },
        },
    });

    return attempts.map((a) => ({
        attemptId: a.id,
        packSlug: a.pack.slug,
        status: statusOf(a),
        score: a.score,
    }));
}