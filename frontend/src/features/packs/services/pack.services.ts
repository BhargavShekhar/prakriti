// services/pack.services.ts
import { request } from "../../../lib/api";
import type { Pack } from "../types";

export const getPacks = () => request<Pack[]>({ url: "/api/packs" });