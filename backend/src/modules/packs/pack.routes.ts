import { Router } from "express";
import { fetchPackBySlug, fetchPacks, fetchPackTerrains } from "./pack.controllers.js";

const router = Router();

router.get("/", fetchPacks);
router.get("/:slug", fetchPackBySlug);
router.get("/:slug/terrains", fetchPackTerrains);

export const packRouter: Router = router;