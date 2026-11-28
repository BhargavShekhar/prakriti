import axios from "axios";
import { request } from "../../../lib/api";
import type { Observation, PhotoType } from "../types";

export const getUploadUrl = (contentType: string, size: number) =>
    request<{ uploadUrl: string; key: string }>({
        method: "POST",
        url: "/api/observations/upload-url",
        data: { contentType, size },
    });

// Plain axios on purpose: S3 must never receive our API cookies
export const uploadToS3 = (url: string, blob: Blob) =>
    axios.put(url, blob, { headers: { "Content-Type": blob.type } });

export interface CreateObservationPayload {
    packSlug: string;
    photoType: PhotoType;
    imageKey: string;
    nameGuess: string;
    spot: string;
    elevationM: number | null;
    waterLevel: string;
    wonder: string;
}

export const createObservation = (payload: CreateObservationPayload) =>
    request<Observation>({ method: "POST", url: "/api/observations", data: payload });

export const getObservations = (pack?: string) =>
    request<Observation[]>({ url: "/api/observations", params: pack ? { pack } : undefined });