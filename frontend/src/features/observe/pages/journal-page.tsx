import { Link } from "react-router";
import { format } from "date-fns";

import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Badge } from "../../../components/ui/badge";
import { buttonVariants } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

import { useObservations } from "../hooks/use-observations";

const PHOTO_LABEL = { WHOLE: "Whole", CLOSE_UP: "Close-up", HABITAT: "Habitat" } as const;

export function JournalPage() {
    const { data, isPending, isError, error } = useObservations();

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">My journal</h1>
                <div className="flex gap-2">
                    <Link to="/observe" className={buttonVariants({ size: "sm" })}>
                        New
                    </Link>
                    <Link to="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
                        Back
                    </Link>
                </div>
            </div>

            {isPending && (
                <>
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-64 rounded-xl" />
                </>
            )}

            {isError && (
                <Alert variant="destructive">
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}

            {data && data.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No observations yet. Tap New to add your first one.
                </p>
            )}

            {data?.map((o) => (
                <Card key={o.id} className="overflow-hidden pt-0">
                    <img
                        src={o.imageUrl}
                        alt={o.nameGuess ?? "Observation"}
                        className="aspect-video w-full object-cover"
                    />
                    <CardContent className="flex flex-col gap-2 pt-4">
                        <div className="flex items-start justify-between gap-3">
                            <h2 className="font-semibold">{o.nameGuess ?? "Mystery"}</h2>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(o.createdAt), "d MMM yyyy")}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{o.pack.name}</Badge>
                            <Badge variant="outline">{PHOTO_LABEL[o.photoType]}</Badge>
                            {o.spot && (
                                <Badge variant="outline" className="capitalize">
                                    {o.spot}
                                </Badge>
                            )}
                            {o.elevationM !== null && <Badge variant="outline">{o.elevationM} m</Badge>}
                            {o.waterLevel && <Badge variant="outline">Water: {o.waterLevel}</Badge>}
                        </div>

                        {o.wonder && (
                            <p className="text-sm text-muted-foreground">I wonder… {o.wonder}</p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}