import { getAllPacks, getPackBySlug } from "./pack.services.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";

import type { Request, Response } from "express";

export async function fetchPacks(_req: Request, res: Response) {
    const packs = await getAllPacks();

    return ApiResponse.ok(res, "Packs fetched successfully", packs);
}

export async function fetchPackBySlug(req: Request, res: Response) {
    const rawSlug = req.params.slug;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

    if (!slug) {
        return ApiError.badRequest("Slug is required to fetch pack by slug");
    }

    const pack = await getPackBySlug(slug);

    if (!pack) {
        throw ApiError.notfound("Pack not found");
    }

    return ApiResponse.ok(res, "Packs fetched successfully", pack);
}