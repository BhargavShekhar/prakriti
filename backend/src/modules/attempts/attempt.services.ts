import { prisma } from "../../common/db/db.js";
import ApiError from "../../common/utils/api-error.js";
import { getPackBySlug } from "../packs/pack.services.js"
import { getPackQuestions } from "../questions/question.services.js";

export async function startAttempt({ packSlug, userId, terrainSlug }: {
    userId: string,
    packSlug: string,
    terrainSlug?: string
}) {
    const pack = await getPackBySlug(packSlug);

    if (!pack) {
        throw ApiError.notfound("Pack not found");
    }

    if (!pack.isPublished) {
        throw ApiError.badRequest("Pack is not publised");
    }

    let terrainId: string | null = null;

    if (terrainSlug) {
        const terrain = await prisma.terrain.findUnique({
            where: { slug: terrainSlug },
            select: { id: true },
        });


        if (!terrain) {
            throw ApiError.notfound("terrain not found");
        }

        // ensure pack belongs to this pack
        const packTerrain = await prisma.packTerrain.findUnique({
            where: {
                packId_terrainId: {
                    packId: pack.id,
                    terrainId: terrain.id,
                },
            },
        });

        if (!packTerrain) {
            throw ApiError.forbidden("Terrain does not belong to this pack");
        }

        terrainId = terrain.id;
    }

    const questions = await getPackQuestions({
        packSlug,
        ...(terrainSlug && { terrainSlug })
    });

    if (!questions) {
        throw ApiError.notfound("No questions found for this quiz");
    }

    const attempt = await prisma.quizAttempt.create({
        data: {
            userId,
            packId: pack.id,
            terrainId
        },
        select: {
            id: true
        }
    });

    return { attemptId: attempt.id, questions };
}

export async function submitAnswer({ attemptId, optionId, questionId, userId }: {
    userId: string,
    attemptId: string,
    questionId: string,
    optionId: string
}) {
    return prisma.$transaction(async (tx) => {
        // verify attempt belong to the user
        const attempt = await tx.quizAttempt.findFirst({
            where: {
                id: attemptId,
                userId,
            },
        });

        if (!attempt) {
            throw ApiError.notfound("Quiz attempt not found");
        }

        // 2. Check attempt status
        if (attempt.finishedAt) {
            throw ApiError.badRequest("Quiz attempt is already completed");
        }

        // 3. Fetch question and its options
        const question = await tx.question.findFirst({
            where: {
                id: questionId,
                isPublished: true,
                packs: {
                    some: {
                        packId: attempt.packId,
                    },
                },
                ...(attempt.terrainId
                    ? { terrainId: attempt.terrainId }
                    : {}),
            },
            select: {
                id: true,
                points: true,
                explanation: true,
                options: {
                    select: {
                        id: true,
                        isCorrect: true,
                    },
                },
            },
        });

        if (!question) {
            throw ApiError.notfound("Question not found in this quiz");
        }

        // 4. Validate selected option
        const selectedOption = question.options.find(
            (option) => option.id === optionId
        );

        if (!selectedOption) {
            throw ApiError.badRequest("Invalid option for this question");
        }

        // 5. Find correct option
        const correctOptions = question.options.filter(
            (option) => option.isCorrect
        );

        if (correctOptions.length !== 1) {
            throw ApiError.badRequest("Question must have exactly one correct option");
        }

        // 6. Prevent duplicate answers
        const existingAnswer = await tx.attemptAnswer.findUnique({
            where: {
                attemptId_questionId: {
                    attemptId,
                    questionId,
                },
            },
        });

        if (existingAnswer) {
            throw ApiError.conflict("Question has already been answered");
        }

        // 7. Calculate result
        const isCorrect = selectedOption.isCorrect;
        const correctOptionId = correctOptions[0]!.id;

        const pointsAwarded = isCorrect
            ? question.points
            : 0;

        // 8. Create answer
        await tx.attemptAnswer.create({
            data: {
                attemptId,
                questionId,
                selectedOptionId: optionId,
                isCorrect,
                pointsAwarded,
            },
        });

        // 9. Update score
        const updatedAttempt = await tx.quizAttempt.update({
            where: {
                id: attemptId,
            },
            data: {
                score: {
                    increment: pointsAwarded,
                },
            },
            select: {
                score: true,
            },
        });

        // 10. Return result
        return {
            isCorrect,
            correctOptionId,
            explanation: question.explanation,
            pointsAwarded,
            score: updatedAttempt.score,
        };
    })
}

export async function finishAttempt(userId: string, attemptId: string) {
    return prisma.$transaction(async (tx) => {
        // 1. Find the attempt and its answers
        const attempt = await tx.quizAttempt.findFirst({
            where: {
                id: attemptId,
                userId,
            },
            include: {
                answers: {
                    orderBy: {
                        answeredAt: "asc",
                    },
                    include: {
                        question: {
                            select: {
                                id: true,
                                text: true,
                                explanation: true,
                                options: {
                                    where: {
                                        isCorrect: true,
                                    },
                                    select: {
                                        id: true,
                                        text: true,
                                    },
                                },
                            },
                        },
                        option: {
                            select: {
                                id: true,
                                text: true,
                            },
                        },
                    },
                },
            },
        });

        if (!attempt) {
            throw ApiError.notfound("Quiz attempt not found");
        }

        // 2. If already finished, don't update anything
        if (!attempt.finishedAt) {
            await tx.quizAttempt.update({
                where: {
                    id: attempt.id,
                },
                data: {
                    finishedAt: new Date(),
                },
            });
        }

        // 3. Return the final result
        return {
            attemptId: attempt.id,
            score: attempt.score,
            finishedAt: attempt.finishedAt ?? new Date(),

            results: attempt.answers.map((answer) => ({
                questionId: answer.question.id,
                question: answer.question.text,
                explanation: answer.question.explanation,

                selectedOptionId: answer.option.id,
                selectedOption: answer.option.text,

                isCorrect: answer.isCorrect,
                pointsAwarded: answer.pointsAwarded,

                correctOptionId: answer.question.options[0]?.id ?? null,
                correctOption: answer.question.options[0]?.text ?? null,
            })),
        };
    });
}