import express from "express";
import cors from "cors";
import { auth } from "../db/auth.js";
import { toNodeHandler } from "better-auth/node";
import helmet from "helmet";

import type { Express } from "express";
import { env } from "../env.js";

export function createExpressApp(): Express {
    const app = express();

    app.use(helmet());

    app.use(
        cors({
            origin: env.FRONTEND_URL,
            credentials: true
        })
    );

    app.all("/api/auth/{*splat}", toNodeHandler(auth));

    app.use(express.json());

    app.get("/health", (_req, res) => res.status(200).json({
        healthy: true
    }))

    return app;
}