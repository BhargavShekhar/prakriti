import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";

import { usePacks } from "../../packs/hooks/use-packs";
import { useMyAttempts } from "../hooks/use-my-attempts";
import { PackQuizCard } from "./pack-quiz-card";

const gridClass = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

export function QuizSection() {
    const packs = usePacks();
    const attempts = useMyAttempts();

    // Wait for BOTH queries, so a kid with a started quiz never sees a wrong "Start quiz"
    if (packs.isPending || attempts.isPending) {
        return (
            <div className={gridClass}>
                <Skeleton className="h-56 rounded-xl" />
                <Skeleton className="h-56 rounded-xl" />
            </div>
        );
    }

    if (packs.isError || attempts.isError) {
        return (
            <Alert variant="destructive">
                <AlertDescription className="flex items-center justify-between gap-4">
                    Could not load your quizzes.
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            packs.refetch();
                            attempts.refetch();
                        }}
                    >
                        Try again
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    if (packs.data.length === 0) {
        return <p className="text-sm text-muted-foreground">No quizzes available yet.</p>;
    }

    const attemptByPack = new Map(attempts.data.map((a) => [a.packSlug, a]));

    return (
        <section aria-labelledby="quizzes-heading" className="flex flex-col gap-4">
            <h2 id="quizzes-heading" className="text-xl font-semibold">
                Quizzes
            </h2>
            <div className={gridClass}>
                {packs.data.map((pack) => (
                    <PackQuizCard
                        key={pack.id}
                        pack={pack}
                        attempt={attemptByPack.get(pack.slug)}
                    />
                ))}
            </div>
        </section>
    );
}