import { useQuery } from "@tanstack/react-query";
import { querykey } from "../../../lib/query-key";
import { getLeaderboard } from "../services/leaderboard.services";

export function useLeaderboard(slug: string | undefined) {
    return useQuery({
        queryKey: querykey.leaderboard.pack(slug ?? ""),
        queryFn: () => getLeaderboard(slug!),
        enabled: !!slug,
    });
}