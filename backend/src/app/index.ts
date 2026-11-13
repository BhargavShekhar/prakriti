import express from "express";
import { toNodeHandler } from "better-auth/node";

import { auth } from "../db/auth.js";

import type { Express } from "express";

export function createExpressApp(): Express {
    const app = express();

    app.all("/api/auth/*", toNodeHandler(auth));

    app.use(express.json());

    app.get("health", (_req, res) => res.status(200).json({
        healthy: true
    }))

    return app;
}