import express from "express";
import { protect, restrictTo } from "../auth/auth.middleware.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { highlightSchema } from "./highlight.validation.js";
import { addHighlight, getHighlights } from "./highlight.controller.js";

const router = express.Router();

router.get("/", getHighlights); // Public
router.post("/", protect, restrictTo("admin"), validateBody(highlightSchema), addHighlight);

export default router;