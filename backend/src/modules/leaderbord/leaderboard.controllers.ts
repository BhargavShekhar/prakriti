import type { Request, Response } from "express";
import { getLeaderboard } from "./leaderboard.services.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";

export async function fetchLeaderboard(req: Request, res: Response) {
    const { slug } = req.params;

    if (typeof slug !== "string" || slug.length === 0) {
        throw ApiError.badRequest("Invalid pack slug");
    }

    const result = await getLeaderboard(res.locals.user.id, slug);

    return ApiResponse.ok(res, "Leaderboard fetched successfully", result);
}