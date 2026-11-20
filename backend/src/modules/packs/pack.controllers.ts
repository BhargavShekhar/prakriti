import type { Request, Response, NextFunction } from "express";
import { getAllPacks } from "./pack.services.js";

export async function fetchPacks(req: Request, res: Response, next: NextFunction) {
    const packs = await getAllPacks();
    
    
}