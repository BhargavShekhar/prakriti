import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "../../env.js";
import { PrismaClient } from "../../generated/prisma/client.js";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
};

function createPrismaClient() {
    const adapter = new PrismaPg({
        connectionString: env.DATABASE_URL
    });

    const prisma = new PrismaClient({ adapter });

    return prisma;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV === "development") {
    globalForPrisma.prisma = prisma;
}