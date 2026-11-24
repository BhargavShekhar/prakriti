import type { ComponentType } from "react";
import { useNavigate } from "react-router";
import {
    RiBookOpenLine,
    RiCameraLine,
    RiLeafLine,
    RiLogoutBoxRLine,
    RiMapPinLine,
    RiTrophyLine,
} from "@remixicon/react";

import { authClient } from "../../../lib/auth-client";
import { useSignout } from "../../auth/hooks/use-signout";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { QuizSection } from "../../quiz/components/quiz-section";

interface UpcomingItem {
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
}

// Becomes real links as each feature gets built
const upcoming: UpcomingItem[] = [
    { label: "Observe", description: "Photograph plants and animals", icon: RiCameraLine },
    { label: "Journal", description: "Your observations over time", icon: RiBookOpenLine },
    { label: "Map", description: "See where your class explored", icon: RiMapPinLine },
    { label: "Leaderboard", description: "Top scores in your pack", icon: RiTrophyLine },
];

export function Dashboard() {
    const navigate = useNavigate();
    const { data: session } = authClient.useSession();
    const signout = useSignout();

    const firstName = session?.user.name?.split(" ")[0] ?? "there";

    function handleSignout() {
        signout.mutate(undefined, {
            onSuccess: () => navigate("/sign-in", { replace: true }),
        });
    }

    return (
        <div className="min-h-svh bg-background">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <RiLeafLine className="size-4" />
                        </span>
                        <span className="font-semibold">Prakriti</span>
                    </div>

                    <Button variant="outline" size="sm" disabled={signout.isPending} onClick={handleSignout}>
                        <RiLogoutBoxRLine />
                        {signout.isPending ? "Signing out…" : "Sign out"}
                    </Button>
                </div>
            </header>

            <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6">
                {signout.error && (
                    <p className="text-sm text-destructive">{signout.error.message}</p>
                )}

                <section className="rounded-xl bg-primary p-6 text-primary-foreground">
                    <p className="text-sm opacity-80">Welcome back,</p>
                    <h1 className="text-2xl font-semibold">{firstName}</h1>
                    <p className="mt-1 text-sm opacity-90">What will you notice today?</p>
                </section>

                <QuizSection />

                <section aria-labelledby="explore-heading" className="flex flex-col gap-4">
                    <h2 id="explore-heading" className="text-xl font-semibold">
                        Explore
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {upcoming.map(({ label, description, icon: Icon }) => (
                            <div
                                key={label}
                                className="flex flex-col gap-3 rounded-xl border border-dashed p-4 opacity-70"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Icon className="size-5" />
                                    </span>
                                    <Badge variant="secondary">Soon</Badge>
                                </div>
                                <div>
                                    <p className="font-medium">{label}</p>
                                    <p className="text-sm text-muted-foreground">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}