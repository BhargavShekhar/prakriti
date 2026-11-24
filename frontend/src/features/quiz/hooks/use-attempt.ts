import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { querykey } from "../../../lib/query-key";
import * as quiz from "../services/quiz.services";
import type { Attempt } from "../types";

export function useAttempt(attemptId: string) {
    return useQuery({
        queryKey: querykey.attempts.detail(attemptId),
        queryFn: () => quiz.getAttempt(attemptId),
    });
}

export function useSubmitAnswer(attemptId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (v: { questionId: string; optionId: string }) =>
            quiz.submitAnswer(attemptId, v.questionId, v.optionId),

        // Patch the cached attempt directly, so no refetch is needed
        onSuccess: (result, v) => {
            qc.setQueryData<Attempt>(querykey.attempts.detail(attemptId), (old) =>
                old && {
                    ...old,
                    score: result.score,
                    answeredCount: old.answeredCount + 1,
                    questions: old.questions.map((q) =>
                        q.id === v.questionId
                            ? {
                                ...q,
                                answer: {
                                    selectedOptionId: v.optionId,
                                    isCorrect: result.isCorrect,
                                    pointsAwarded: result.pointsAwarded,
                                    correctOptionId: result.correctOptionId,
                                    explanation: result.explanation,
                                },
                            }
                            : q
                    ),
                }
            );
        },
        
        onError: () => {
            qc.invalidateQueries({ queryKey: querykey.attempts.detail(attemptId) });
        },
    });
}

export function useFinishAttempt(attemptId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: () => quiz.finishAttempt(attemptId),
        // Refetch: the full result (all correct options) only comes once finished
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: querykey.attempts.detail(attemptId) });
            qc.invalidateQueries({ queryKey: querykey.attempts.mine() });
            qc.invalidateQueries({ queryKey: querykey.leaderboard.all });
        },
    });
}