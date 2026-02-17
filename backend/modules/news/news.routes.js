import express from "express";
import { addNews, getAllNews } from "./news.controller.js";
import { protect, restrictTo } from "../auth/auth.middleware.js";
import { validateBody } from "../../middlewares/validateBody.middleware.js";
import { newsSchema } from "./news.validation.js";

const router = express.Router();

router.get("/", getAllNews);
router.post("/", protect, restrictTo("admin"), validateBody(newsSchema), addNews);

export default router;