import type { Request, Response } from "express";
import {
    PHOTO_TYPES,
    createObservation,
    createUploadUrl,
    listMyObservations,
} from "./observation.services.js";
import type { PhotoTypeValue } from "./observation.services.js";

import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";

const userIdOf = (res: Response): string => res.locals.user.id;

function reqStr(value: unknown, name: string): string {
    if (typeof value !== "string" || value.length === 0) {
        throw ApiError.badRequest(`Invalid ${name}`);
    }
    return value;
}

function optStr(value: unknown, name: string, max: number): string | null {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string") throw ApiError.badRequest(`Invalid ${name}`);
    const trimmed = value.trim();
    if (trimmed.length > max) throw ApiError.badRequest(`${name} is too long`);
    return trimmed || null;
}

function optInt(value: unknown, name: string, min: number, max: number): number | null {
    if (value === undefined || value === null || value === "") return null;
    const n = Number(value);
    if (!Number.isInteger(n) || n < min || n > max) throw ApiError.badRequest(`Invalid ${name}`);
    return n;
}

export async function createUploadUrlController(req: Request, res: Response) {
    const contentType = reqStr(req.body?.contentType, "content type");
    const size = Number(req.body?.size);

    const result = await createUploadUrl(userIdOf(res), contentType, size);

    return ApiResponse.ok(res, "Upload URL created", result);
}

export async function createObservationController(req: Request, res: Response) {
    const body = req.body ?? {};

    const photoType = body.photoType;
    if (!(PHOTO_TYPES as readonly string[]).includes(photoType)) {
        throw ApiError.badRequest("Invalid photo type");
    }

    const result = await createObservation({
        userId: userIdOf(res),
        packSlug: reqStr(body.packSlug, "pack"),
        photoType: photoType as PhotoTypeValue,
        imageKey: reqStr(body.imageKey, "image"),
        nameGuess: optStr(body.nameGuess, "name", 100),
        spot: optStr(body.spot, "spot", 60),
        elevationM: optInt(body.elevationM, "elevation", 0, 9000),
        waterLevel: optStr(body.waterLevel, "water level", 60),
        wonder: optStr(body.wonder, "wonder", 500),
    });

    return ApiResponse.created(res, "Observation saved", result);
}

export async function listObservationsController(req: Request, res: Response) {
    const pack = req.query.pack;

    if (pack !== undefined && typeof pack !== "string") {
        throw ApiError.badRequest("Invalid pack");
    }

    const result = await listMyObservations(userIdOf(res), pack ?? null);

    return ApiResponse.ok(res, "Observations fetched successfully", result);
}