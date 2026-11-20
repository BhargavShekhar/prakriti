import express from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";

import { auth } from "../common/db/auth.js";
import { env } from "../env.js";
import { globalErrorHandler } from "./global-error-handler.js";
import { packRouter } from "../modules/packs/pack.routes.js";
import ApiError from "../common/utils/api-error.js";

import type { Express } from "express";

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
    }));

    app.use("/api/packs", packRouter);

    app.use((_req, _res, next) => {
        next(ApiError.notfound("Route not found"));
    })

    app.use(globalErrorHandler)

    return app;
}