import { prisma } from "../../common/db/db.js";
import ApiError from "../../common/utils/api-error.js";

const TOP_N = 20;

// "Asha Kumari Singh" -> "Asha S."
function displayName(name: string): string {
    const [first = "Student", ...rest] = name.trim().split(/\s+/);
    const last = rest[rest.length - 1];
    return last ? `${first} ${last[0]!.toUpperCase()}.` : first;
}

export async function getLeaderboard(userId: string, packSlug: string) {
    const pack = await prisma.pack.findFirst({
        where: { slug: packSlug, isPublished: true },
        select: { id: true, slug: true, name: true },
    });

    if (!pack) {
        throw ApiError.notfound("Pack not found");
    }

    const [top, totalFinished, mine] = await Promise.all([
        prisma.quizAttempt.findMany({
            where: { packId: pack.id, finishedAt: { not: null } },
            orderBy: [{ score: "desc" }, { finishedAt: "asc" }],
            take: TOP_N,
            select: { userId: true, score: true, user: { select: { name: true } } },
        }),
        prisma.quizAttempt.count({
            where: { packId: pack.id, finishedAt: { not: null } },
        }),
        prisma.quizAttempt.findUnique({
            where: { userId_packId: { userId, packId: pack.id } },
            select: { score: true, finishedAt: true },
        }),
    ]);

    // Rank = 1 + number of finished attempts that beat mine
    let me: { rank: number; score: number } | null = null;

    if (mine?.finishedAt) {
        const ahead = await prisma.quizAttempt.count({
            where: {
                packId: pack.id,
                finishedAt: { not: null },
                OR: [
                    { score: { gt: mine.score } },
                    { score: mine.score, finishedAt: { lt: mine.finishedAt } },
                ],
            },
        });
        me = { rank: ahead + 1, score: mine.score };
    }

    return {
        pack: { slug: pack.slug, name: pack.name },
        entries: top.map((a, i) => ({
            rank: i + 1,
            name: displayName(a.user.name),
            score: a.score,
            isYou: a.userId === userId,
        })),
        me,
        totalFinished,
    };
}