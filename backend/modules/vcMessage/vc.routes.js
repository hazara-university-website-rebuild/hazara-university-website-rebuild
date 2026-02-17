import express from "express";
import { protect, restrictTo } from "../auth/auth.middleware.js";
import { validateBody } from "../../middlewares/validateBody.middleware.js";
import { vcSchema } from "./vc.validation.js";
import { updateVC, getVC } from "./vc.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();
router.get("/", asyncHandler(getVC))
router.post("/", protect,restrictTo("admin"), validateBody(vcSchema), asyncHandler(updateVC))

export default router;