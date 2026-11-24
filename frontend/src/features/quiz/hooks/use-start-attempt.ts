import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { querykey } from "../../../lib/query-key";
import { startAttempt } from "../services/quiz.services";

export function useStartAttempt() {
    const qc = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (packSlug: string) => startAttempt(packSlug),
        onSuccess: ({ attemptId }) => {
            qc.invalidateQueries({ queryKey: querykey.attempts.mine() });
            navigate(`/quiz/${attemptId}`);
        },
    });
}