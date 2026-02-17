import express from "express";
import { addNews, getAllNews } from "./news.controller.js";
import { protect, restrictTo } from "../auth/auth.middleware.js";
import { validateBody } from "../../middlewares/validateBody.middleware.js";
import { newsSchema } from "./news.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();
router.get("/", asyncHandler(getAllNews));
router.post("/", protect ,restrictTo("admin"), validateBody(newsSchema), asyncHandler(addNews));

export default router;