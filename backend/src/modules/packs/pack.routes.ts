import { Router } from "express";
import { fetchPackBySlug, fetchPacks } from "./pack.controllers.js";

const router = Router();

router.get("/", fetchPacks);
router.get("/:slug", fetchPackBySlug);

export const packRouter: Router = router;