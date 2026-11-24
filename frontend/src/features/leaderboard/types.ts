export interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
    isYou: boolean;
}

export interface Leaderboard {
    pack: { slug: string; name: string };
    entries: LeaderboardEntry[];
    me: { rank: number; score: number } | null;
    totalFinished: number;
}