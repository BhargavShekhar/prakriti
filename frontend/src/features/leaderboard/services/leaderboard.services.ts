import { request } from "../../../lib/api";
import type { Leaderboard } from "../types";

export const getLeaderboard = (packSlug: string) =>
    request<Leaderboard>({ url: `/api/packs/${packSlug}/leaderboard` });