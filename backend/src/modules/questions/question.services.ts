import { prisma } from "../../common/db/db.js";

interface GetPackQuestionsOptions {
    packSlug: string;
    terrainSlug?: string;
}

export async function getPackQuestions({ packSlug, terrainSlug }: GetPackQuestionsOptions) {
    const pack = await prisma.pack.findFirst({
        where: {
            slug: packSlug,
            isPublished: true,
        },
        select: {
            id: true,
            questions: {
                where: {
                    question: {
                        isPublished: true,
                        ...(terrainSlug && {
                            terrain: {
                                is: {
                                    slug: terrainSlug,
                                },
                            },
                        }),
                    },
                },
                orderBy: {
                    sortOrder: "asc",
                },
                select: {
                    sortOrder: true,
                    question: {
                        select: {
                            id: true,
                            text: true,
                            type: true,
                            points: true,
                            terrain: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                },
                            },
                            options: {
                                orderBy: {
                                    sortOrder: "asc",
                                },
                                select: {
                                    id: true,
                                    text: true,
                                    sortOrder: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!pack) {
        return null;
    }

    const packQuestions = pack.questions.map(({ question, sortOrder }) => ({
        ...question,
        sortOrder,
    }));

    return packQuestions;
}