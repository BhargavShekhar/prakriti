import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";

import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Button, buttonVariants } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

import { usePacks } from "../../packs/hooks/use-packs";
import { useCreateObservation } from "../hooks/use-create-observation";
import type { PhotoType } from "../types";

const PHOTO_TYPES: { value: PhotoType; label: string }[] = [
    { value: "WHOLE", label: "Whole" },
    { value: "CLOSE_UP", label: "Close-up" },
    { value: "HABITAT", label: "Habitat" },
];

const SPOTS: Record<string, string[]> = {
    varanasi: ["ghat steps", "river edge", "garden"],
    mountain: ["forest", "stream", "meadow"],
};

const labelClass = "text-sm font-medium";
const textareaClass =
    "min-h-20 w-full rounded-lg border bg-transparent p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ObservePage() {
    const packs = usePacks();
    const create = useCreateObservation();

    const [pack, setPack] = useState<string | null>(null);
    const [photoType, setPhotoType] = useState<PhotoType>("WHOLE");
    const [photo, setPhoto] = useState<File | null>(null);
    const [nameGuess, setNameGuess] = useState("");
    const [spot, setSpot] = useState("");
    const [elevation, setElevation] = useState("");
    const [waterLevel, setWaterLevel] = useState("");
    const [wonder, setWonder] = useState("");

    const slug = pack ?? packs.data?.[0]?.slug;

    const preview = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);
    useEffect(() => () => {
        if (preview) URL.revokeObjectURL(preview);
    }, [preview]);

    function resetForm() {
        create.reset();
        setPhotoType("WHOLE");
        setPhoto(null);
        setNameGuess("");
        setSpot("");
        setElevation("");
        setWaterLevel("");
        setWonder("");
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!photo || !slug) return;

        create.mutate({
            packSlug: slug,
            photoType,
            photo,
            nameGuess,
            spot,
            elevationM: elevation ? Number(elevation) : null,
            waterLevel,
            wonder,
        });
    }

    if (create.isSuccess) {
        return (
            <div className="mx-auto flex max-w-lg flex-col gap-4 p-4">
                <Card>
                    <CardHeader className="items-center text-center">
                        <CardTitle>Observation saved</CardTitle>
                        <p className="text-sm text-muted-foreground">Nice noticing!</p>
                    </CardHeader>
                    <CardContent className="flex justify-center gap-2">
                        <Button onClick={resetForm}>Add another</Button>
                        <Link to="/" className={buttonVariants({ variant: "outline" })}>
                            Back to dashboard
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg flex-col gap-5 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">New observation</h1>
                <Link to="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Cancel
                </Link>
            </div>

            <div className="flex flex-col gap-2">
                <span className={labelClass}>Pack</span>
                <div className="flex flex-wrap gap-2">
                    {packs.data?.map((p) => (
                        <Button
                            key={p.id}
                            type="button"
                            size="sm"
                            variant={p.slug === slug ? "default" : "outline"}
                            onClick={() => {
                                setPack(p.slug);
                                setSpot("");
                            }}
                        >
                            {p.name}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <span className={labelClass}>Photo type</span>
                <div className="grid grid-cols-3 gap-2">
                    {PHOTO_TYPES.map((t) => (
                        <Button
                            key={t.value}
                            type="button"
                            variant={photoType === t.value ? "default" : "outline"}
                            onClick={() => setPhotoType(t.value)}
                        >
                            {t.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="photo" className={labelClass}>
                    Photo
                </label>
                <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                />
                {preview && (
                    <img src={preview} alt="Selected observation" className="max-h-64 rounded-lg border object-contain" />
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="name" className={labelClass}>
                    What do I think it is?
                </label>
                <Input
                    id="name"
                    value={nameGuess}
                    maxLength={100}
                    onChange={(e) => setNameGuess(e.target.value)}
                />
            </div>

            {slug && SPOTS[slug] && (
                <div className="flex flex-col gap-2">
                    <span className={labelClass}>Where?</span>
                    <div className="flex flex-wrap gap-2">
                        {SPOTS[slug].map((s) => (
                            <Button
                                key={s}
                                type="button"
                                size="sm"
                                className="capitalize"
                                variant={spot === s ? "default" : "outline"}
                                onClick={() => setSpot(spot === s ? "" : s)}
                            >
                                {s}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {slug === "mountain" && (
                <div className="flex flex-col gap-2">
                    <label htmlFor="elevation" className={labelClass}>
                        Elevation (metres)
                    </label>
                    <Input
                        id="elevation"
                        type="number"
                        min={0}
                        max={9000}
                        value={elevation}
                        onChange={(e) => setElevation(e.target.value)}
                    />
                </div>
            )}

            {slug === "varanasi" && (
                <div className="flex flex-col gap-2">
                    <label htmlFor="water" className={labelClass}>
                        Water level (Ganga only)
                    </label>
                    <Input
                        id="water"
                        value={waterLevel}
                        maxLength={60}
                        onChange={(e) => setWaterLevel(e.target.value)}
                    />
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label htmlFor="wonder" className={labelClass}>
                    I wonder…
                </label>
                <textarea
                    id="wonder"
                    className={textareaClass}
                    value={wonder}
                    maxLength={500}
                    onChange={(e) => setWonder(e.target.value)}
                />
            </div>

            {create.isError && (
                <Alert variant="destructive">
                    <AlertDescription>{create.error.message}</AlertDescription>
                </Alert>
            )}

            <Button type="submit" disabled={!photo || !slug || create.isPending}>
                {create.isPending ? "Saving…" : "Save observation"}
            </Button>
        </form>
    );
}