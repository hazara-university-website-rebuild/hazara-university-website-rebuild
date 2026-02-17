import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import authRoutes from "./modules/auth/auth.routes.js";
import {errorMiddleware} from "./middlewares/error.middleware.js"
import newsRoutes from "./modules/news/news.routes.js";
import sliderRoutes from "./modules/slider/slider.routes.js";
import highlightRoutes from "./modules/highlights/highlight.routes.js";
import vcRoutes from "./modules/vcMessage/vc.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    app.use(express.json());
    app.use(cookieParser());
    app.use("/api/v1/auth/", authRoutes);
    app.use("/api/v1/news", newsRoutes);
    app.use("/api/v1/slider", sliderRoutes);
    app.use("/api/v1/highlights", highlightRoutes);
    app.use("/api/v1/vc-message", vcRoutes);
    app.get("/", (req, res) => {
      res.send("API Running");
    });
    app.use(errorMiddleware);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer()

