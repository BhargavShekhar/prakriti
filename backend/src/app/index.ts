import express from "express";

import type { Express } from "express";

export function createExpressApp(): Express {
    const app = express();

    app.use(express.json());

    app.get("health", (_req, res) => res.status(200).json({
        healthy: true
    }))

    return app;
}