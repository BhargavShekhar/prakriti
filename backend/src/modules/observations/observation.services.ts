import { randomUUID } from "node:crypto";
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { prisma } from "../../common/db/db.js";
import { s3, BUCKET } from "../../common/s3/s3.js";
import ApiError from "../../common/utils/api-error.js";

export const PHOTO_TYPES = ["WHOLE", "CLOSE_UP", "HABITAT"] as const;
export type PhotoTypeValue = (typeof PHOTO_TYPES)[number];

const ALLOWED_TYPES = new Map([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
]);
const MAX_BYTES = 5 * 1024 * 1024;
const UPLOAD_URL_TTL = 300; // seconds
const VIEW_URL_TTL = 3600; // seconds

function isUniqueViolation(err: unknown): boolean {
    return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";
}

const viewUrl = (key: string) =>
    getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), {
        expiresIn: VIEW_URL_TTL,
    });

// The raw S3 key never leaves the server; clients get a short-lived URL instead
async function withImageUrl<T extends { imageKey: string }>(row: T) {
    const { imageKey, ...rest } = row;
    return { ...rest, imageUrl: await viewUrl(imageKey) };
}

const observationSelect = {
    id: true,
    photoType: true,
    imageKey: true,
    nameGuess: true,
    spot: true,
    elevationM: true,
    waterLevel: true,
    wonder: true,
    createdAt: true,
    pack: { select: { slug: true, name: true } },
} as const;

/* ------------------------------ upload url ------------------------------- */

export async function createUploadUrl(userId: string, contentType: string, size: number) {
    const ext = ALLOWED_TYPES.get(contentType);

    if (!ext) {
        throw ApiError.badRequest("Only JPEG, PNG or WebP images are allowed");
    }

    if (!Number.isInteger(size) || size <= 0 || size > MAX_BYTES) {
        throw ApiError.badRequest("Image must be smaller than 5 MB");
    }

    // The key is namespaced by user id and generated here, never by the client
    const key = `observations/${userId}/${randomUUID()}.${ext}`;

    const uploadUrl = await getSignedUrl(
        s3,
        new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType }),
        { expiresIn: UPLOAD_URL_TTL }
    );

    return { uploadUrl, key };
}

/* -------------------------------- create --------------------------------- */

interface CreateObservationInput {
    userId: string;
    packSlug: string;
    photoType: PhotoTypeValue;
    imageKey: string;
    nameGuess: string | null;
    spot: string | null;
    elevationM: number | null;
    waterLevel: string | null;
    wonder: string | null;
}

export async function createObservation(input: CreateObservationInput) {
    const pack = await prisma.pack.findFirst({
        where: { slug: input.packSlug, isPublished: true },
        select: { id: true },
    });

    if (!pack) {
        throw ApiError.notfound("Pack not found");
    }

    // A student can only attach images from their own folder
    if (!input.imageKey.startsWith(`observations/${input.userId}/`)) {
        throw ApiError.forbidden("Invalid image");
    }

    // Confirm the file really arrived in S3 and matches what we approved.
    // (Without s3:ListBucket a missing key shows up as 403, so any failure means "not found".)
    let head;
    try {
        head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: input.imageKey }));
    } catch {
        throw ApiError.badRequest("Image upload not found, please try again");
    }

    if (
        !head.ContentType ||
        !ALLOWED_TYPES.has(head.ContentType) ||
        (head.ContentLength ?? 0) > MAX_BYTES
    ) {
        throw ApiError.badRequest("Uploaded image is not valid");
    }

    try {
        const row = await prisma.observation.create({
            data: {
                userId: input.userId,
                packId: pack.id,
                photoType: input.photoType,
                imageKey: input.imageKey,
                nameGuess: input.nameGuess,
                spot: input.spot,
                elevationM: input.elevationM,
                waterLevel: input.waterLevel,
                wonder: input.wonder,
            },
            select: observationSelect,
        });

        return withImageUrl(row);
    } catch (err) {
        if (isUniqueViolation(err)) {
            throw ApiError.conflict("This image was already used for an observation");
        }
        throw err;
    }
}

/* --------------------------------- list ---------------------------------- */

export async function listMyObservations(userId: string, packSlug: string | null) {
    const rows = await prisma.observation.findMany({
        where: { userId, ...(packSlug && { pack: { slug: packSlug } }) },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: observationSelect,
    });

    return Promise.all(rows.map(withImageUrl));
}