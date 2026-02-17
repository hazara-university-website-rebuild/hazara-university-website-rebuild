import express from "express";
import { addSlide, fetchSlides } from "./slider.controller.js";
import { protect, restrictTo } from "../auth/auth.middleware.js";
import { validateBody } from "../../middlewares/validateBody.middleware.js";
import { sliderSchema } from "./slider.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(fetchSlides)); // Public

router.post("/", protect, restrictTo("admin"), validateBody(sliderSchema), asyncHandler(addSlide)); // Admin only

export default router;