import "dotenv/config";

import z from "zod";

const envSchema = z.object({
    NODE_ENV:z.enum(["development", "production"]),
    PORT: z.coerce.number(),
    DATABASE_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
    FRONTEND_URL: z.url()
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