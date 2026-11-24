import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { fetchLeaderboard } from "./leaderboard.controllers.js";

const router = Router();

router.get("/packs/:slug/leaderboard", requireAuth, fetchLeaderboard);

export const leaderboardRouter: Router = router;