import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";

import { getPackQuestions } from "./question.services.js";

import type { Request, Response } from "express";

export async function fetchPackQuestions(req: Request, res: Response) {
    const { slug } = req.params;

    if (typeof slug !== "string") {
        throw ApiError.badRequest("Invalid pack slug");
    }

    const terrainSlug = req.query.terrain as string | undefined;

    if (terrainSlug !== undefined && typeof terrainSlug !== "string") {
        throw ApiError.badRequest("Invalid terrain slug");
    }

    const questions = await getPackQuestions({
        packSlug: slug,
        ...(terrainSlug !== undefined && { terrainSlug })
    })

    if (!questions) {
        throw ApiError.notfound("Pack not found");
    }

    return ApiResponse.ok(
        res,
        "Pack questions fetched successfully",
        questions
    );
}