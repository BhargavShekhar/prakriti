import { Router } from "express";

import { fetchPackQuestions } from "./questios.controllers.js";

const router = Router();

router.get("/:slug/questions", fetchPackQuestions);

export const questionRouter: Router = router;