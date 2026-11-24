import { Link } from "react-router";
import { RiLoader4Line } from "@remixicon/react";

// import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "../../../components/ui/badge";
import { Button, buttonVariants } from "../../../components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import { Alert, AlertDescription } from "../../../components/ui/alert";

import { useStartAttempt } from "../hooks/use-start-attempt";
import type { Pack } from "../../packs/types";
import type { MyAttempt } from "../types";

interface PackQuizCardProps {
    pack: Pack;
    attempt: MyAttempt | undefined;
}

export function PackQuizCard({ pack, attempt }: PackQuizCardProps) {
    const start = useStartAttempt();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{pack.name}</CardTitle>
                {pack.location && <CardDescription>{pack.location}</CardDescription>}

                {attempt && (
                    <CardAction>
                        {attempt.status === "IN_PROGRESS" ? (
                            <Badge variant="secondary">In progress</Badge>
                        ) : (
                            <Badge>Score: {attempt.score}</Badge>
                        )}
                    </CardAction>
                )}
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
                {pack.description && (
                    <p className="text-sm text-muted-foreground">{pack.description}</p>
                )}

                {pack.terrains.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                        {pack.terrains.map(({ terrain }) => (
                            <li key={terrain.id}>
                                <Badge variant="outline">{terrain.name}</Badge>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>

            <CardFooter className="flex-col items-stretch gap-2">
                {attempt ? (
                    // We already have the id, so no API call is needed
                    <Link
                        to={`/quiz/${attempt.attemptId}`}
                        className={buttonVariants({
                            variant: attempt.status === "IN_PROGRESS" ? "default" : "outline",
                            className: "w-full",
                        })}
                    >
                        {attempt.status === "IN_PROGRESS" ? "Resume quiz" : "View result"}
                    </Link>
                ) : (
                    <Button
                        className="w-full"
                        disabled={start.isPending}
                        onClick={() => start.mutate(pack.slug)}
                    >
                        {start.isPending ? (
                            <>
                                <RiLoader4Line className="animate-spin" />
                                Starting…
                            </>
                        ) : (
                            "Start quiz"
                        )}
                    </Button>
                )}

                {start.isError && (
                    <Alert variant="destructive">
                        <AlertDescription>{start.error.message}</AlertDescription>
                    </Alert>
                )}
            </CardFooter>
        </Card>
    );
}