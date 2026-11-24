import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import {
    startAttemptController,
    getAttemptController,
    submitAnswerController,
    finishAttemptController,
    getMyAttemptsController,
} from "./attempt.controllers.js";

const router = Router();

router.get("/me/attempts", requireAuth, getMyAttemptsController);
router.post("/packs/:slug/attempts", requireAuth, startAttemptController);
router.get("/attempts/:attemptId", requireAuth, getAttemptController);
router.post("/attempts/:attemptId/answers", requireAuth, submitAnswerController);
router.post("/attempts/:attemptId/finish", requireAuth, finishAttemptController);

export const attemptRouter: Router = router;