import "dotenv/config";

import z from "zod";

const envSchema = z.object({
    NODE_ENV:z.enum(["development", "deployment"]),
    PORT: z.coerce.number(),
    DATABASE_URL: z.url(),
})

function validateEnv() {
    const { success, data, error } = envSchema.safeParse(process.env);

    if (!success) {
        console.error(error);
        throw new Error("Invalid Env Variables");
    }

    return data;
}

export const env = validateEnv();