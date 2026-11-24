import { request } from "../../../lib/api";
import type { Attempt, AttemptStatus, MyAttempt, SubmitAnswerResult } from "../types";

export const getMyAttempts = () =>
    request<MyAttempt[]>({ url: "/api/me/attempts" });

export const startAttempt = (packSlug: string) =>
    request<{ attemptId: string; status: AttemptStatus }>({
        method: "POST",
        url: `/api/packs/${packSlug}/attempts`,
    });

export const getAttempt = (attemptId: string) =>
    request<Attempt>({ url: `/api/attempts/${attemptId}` });

export const submitAnswer = (attemptId: string, questionId: string, optionId: string) =>
    request<SubmitAnswerResult>({
        method: "POST",
        url: `/api/attempts/${attemptId}/answers`,
        data: { questionId, optionId },
    });

export const finishAttempt = (attemptId: string) =>
    request<{ attemptId: string; score: number; finishedAt: string }>({
        method: "POST",
        url: `/api/attempts/${attemptId}/finish`,
    });