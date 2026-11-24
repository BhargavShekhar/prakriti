import type { Request, Response } from "express";
import {
    startAttempt,
    getAttempt,
    submitAnswer,
    finishAttempt,
    getMyAttempts,
} from "./attempt.services.js";

import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";

function str(value: unknown, name: string): string {
    if (typeof value !== "string" || value.length === 0) {
        throw ApiError.badRequest(`Invalid ${name}`);
    }
    return value;
}

const userIdOf = (res: Response): string => res.locals.user.id;

export async function startAttemptController(req: Request, res: Response) {
    const packSlug = str(req.params.slug, "pack slug");

    const result = await startAttempt({ userId: userIdOf(res), packSlug });

    return ApiResponse.ok(res, "Quiz attempt ready", result);
}

export async function getAttemptController(req: Request, res: Response) {
    const attemptId = str(req.params.attemptId, "attempt id");

    const result = await getAttempt(userIdOf(res), attemptId);

    return ApiResponse.ok(res, "Quiz attempt fetched successfully", result);
}

export async function submitAnswerController(req: Request, res: Response) {
    const attemptId = str(req.params.attemptId, "attempt id");
    const questionId = str(req.body?.questionId, "question id");
    const optionId = str(req.body?.optionId, "option id");

    const result = await submitAnswer({
        userId: userIdOf(res),
        attemptId,
        questionId,
        optionId,
    });

    return ApiResponse.ok(res, "Answer submitted successfully", result);
}

export async function finishAttemptController(req: Request, res: Response) {
    const attemptId = str(req.params.attemptId, "attempt id");

    const result = await finishAttempt(userIdOf(res), attemptId);

    return ApiResponse.ok(res, "Quiz attempt completed successfully", result);
}

export async function getMyAttemptsController(_req: Request, res: Response) {
    const result = await getMyAttempts(userIdOf(res));

    return ApiResponse.ok(res, "Attempts fetched successfully", result);
}