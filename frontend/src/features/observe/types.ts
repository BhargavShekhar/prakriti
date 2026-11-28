export type PhotoType = "WHOLE" | "CLOSE_UP" | "HABITAT";

export interface Observation {
    id: string;
    photoType: PhotoType;
    nameGuess: string | null;
    spot: string | null;
    elevationM: number | null;
    waterLevel: string | null;
    wonder: string | null;
    createdAt: string;
    imageUrl: string;
    pack: { slug: string; name: string };
}

export interface CreateObservationInput {
    packSlug: string;
    photoType: PhotoType;
    photo: File;
    nameGuess: string;
    spot: string;
    elevationM: number | null;
    waterLevel: string;
    wonder: string;
}