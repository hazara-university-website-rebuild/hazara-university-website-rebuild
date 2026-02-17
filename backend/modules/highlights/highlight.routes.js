import express from "express";
import { protect, restrictTo } from "../auth/auth.middleware.js";
import { validateBody } from "../../middlewares/validateBody.middleware.js";
import { highlightSchema } from "./highlight.validation.js";
import { addHighlight, getHighlights } from "./highlight.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getHighlights));
router.post("/", protect,restrictTo("admin"), validateBody(highlightSchema), asyncHandler(addHighlight));

export default router;