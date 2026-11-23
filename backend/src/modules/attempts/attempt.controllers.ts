import { startAttempt, submitAnswer, finishAttempt } from "./attempt.services.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";

import type { Request, Response } from "express";

export async function startAttemptController(req: Request, res: Response) {
    const { slug } = req.params;
    const terrainSlug = req.query.terrain;

    if (typeof slug !== "string") {
        throw ApiError.badRequest("Invalid pack slug");
    }
    if (terrainSlug !== undefined && typeof terrainSlug !== "string") {
        throw ApiError.badRequest("Invalid terrain slug");
    }

    const result = await startAttempt({
        userId: res.locals.user.id,
        packSlug: slug,
        ...(terrainSlug !== undefined && { terrainSlug }),
    });

    return ApiResponse.created(res, "Quiz attempt started successfully", result);
}

export async function submitAnswerController(req: Request, res: Response) {
    const { attemptId } = req.params;
    const { questionId, optionId } = req.body ?? {};

    if (
        typeof attemptId !== "string" ||
        typeof questionId !== "string" ||
        typeof optionId !== "string"
    ) {
        throw ApiError.badRequest("attemptId, questionId and optionId are required");
    }

    const result = await submitAnswer({
        userId: res.locals.user.id,
        attemptId,
        questionId,
        optionId,
    });

    return ApiResponse.ok(res, "Answer submitted successfully", result);
}

export async function finishAttemptController(req: Request, res: Response) {
    const { attemptId } = req.params;

    if (typeof attemptId !== "string") {
        throw ApiError.badRequest("Invalid attempt id");
    }

    const result = await finishAttempt(res.locals.user.id, attemptId);

    return ApiResponse.ok(res, "Quiz attempt completed successfully", result);
}