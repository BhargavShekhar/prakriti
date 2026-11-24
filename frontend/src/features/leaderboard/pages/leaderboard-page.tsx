import { Link, useSearchParams } from "react-router";
import { RiTrophyLine } from "@remixicon/react";

import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Button, buttonVariants } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

import { usePacks } from "../../packs/hooks/use-packs";
import { useLeaderboard } from "../hooks/use-leaderboard";

export function LeaderboardPage() {
    const packs = usePacks();
    const [params, setParams] = useSearchParams();

    const slug = params.get("pack") ?? packs.data?.[0]?.slug;
    const board = useLeaderboard(slug);

    const data = board.data;
    const meInTop = data?.entries.some((e) => e.isYou) ?? false;

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="flex items-center gap-2 text-xl font-semibold">
                    <RiTrophyLine className="size-5 text-primary" />
                    Leaderboard
                </h1>
                <Link to="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Back
                </Link>
            </div>

            <div className="flex flex-wrap gap-2">
                {packs.data?.map((p) => (
                    <Button
                        key={p.id}
                        size="sm"
                        variant={p.slug === slug ? "default" : "outline"}
                        onClick={() => setParams({ pack: p.slug }, { replace: true })}
                    >
                        {p.name}
                    </Button>
                ))}
            </div>

            <Card>
                <CardContent className="flex flex-col gap-2 pt-6">
                    {(packs.isPending || board.isPending) && !board.isError && (
                        <>
                            <Skeleton className="h-10" />
                            <Skeleton className="h-10" />
                            <Skeleton className="h-10" />
                        </>
                    )}

                    {board.isError && (
                        <Alert variant="destructive">
                            <AlertDescription>{board.error.message}</AlertDescription>
                        </Alert>
                    )}

                    {data && data.entries.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            Nobody has finished this quiz yet. Be the first!
                        </p>
                    )}

                    {data?.entries.map((e) => (
                        <div
                            key={e.rank}
                            className={`flex items-center gap-3 rounded-lg border p-3 ${
                                e.isYou ? "border-primary bg-primary/10" : ""
                            }`}
                        >
                            <span
                                className={`flex size-7 items-center justify-center rounded-full text-sm font-medium ${
                                    e.rank <= 3
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                }`}
                            >
                                {e.rank}
                            </span>
                            <span className="flex-1 text-sm font-medium">
                                {e.name}
                                {e.isYou && <span className="ml-2 text-xs text-primary">(you)</span>}
                            </span>
                            <span className="text-sm font-semibold">{e.score}</span>
                        </div>
                    ))}

                    {data && data.me && !meInTop && (
                        <>
                            <p className="text-center text-muted-foreground">⋯</p>
                            <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/10 p-3">
                                <span className="flex size-7 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                                    {data.me.rank}
                                </span>
                                <span className="flex-1 text-sm font-medium">
                                    You <span className="text-xs text-primary">(you)</span>
                                </span>
                                <span className="text-sm font-semibold">{data.me.score}</span>
                            </div>
                        </>
                    )}

                    {data && !data.me && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            Finish this quiz to appear on the leaderboard.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}