import { prisma } from "../../common/db/db.js";

export async function getAllPacks() {
    return prisma.pack.findMany({
        where: {
            isPublished: true,
        },
        include: {
            terrains: {
                include: {
                    terrain: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getPackBySlug(slug: string) {
    return prisma.pack.findFirst({
        where: {
            slug,
            isPublished: true,
        },
        include: {
            terrains: {
                include: {
                    terrain: true,
                },
            },
        },
    });
}