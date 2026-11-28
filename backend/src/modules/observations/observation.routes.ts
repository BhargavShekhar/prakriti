import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import {
    createObservationController,
    createUploadUrlController,
    listObservationsController,
} from "./observation.controllers.js";

const router = Router();

router.post("/upload-url", requireAuth, createUploadUrlController);
router.post("/", requireAuth, createObservationController);
router.get("/", requireAuth, listObservationsController);

export const observationRouter: Router = router;