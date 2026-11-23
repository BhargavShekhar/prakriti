// modules/attempts/attempt.routes.ts
import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import {
    startAttemptController,
    submitAnswerController,
    finishAttemptController,
} from "./attempt.controllers.js";

export const attemptRouter: Router = Router();

attemptRouter.post("/packs/:slug/attempts", requireAuth, startAttemptController);
attemptRouter.post("/attempts/:attemptId/answers", requireAuth, submitAnswerController);
attemptRouter.post("/attempts/:attemptId/finish", requireAuth, finishAttemptController);