// types.ts
export interface Pack {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    location: string | null;
    terrains: { terrain: { id: string; name: string; slug: string } }[];
}