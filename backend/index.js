import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import authRoutes from "./modules/auth/auth.routes.js";
import newsRoutes from "./modules/news/news.routes.js";
// 1. Import the Slider Routes
import sliderRoutes from "./modules/slider/slider.routes.js";
import highlightRoutes from "./modules/highlights/highlight.routes.js";
import vcRoutes from "./modules/vcMessage/vc.routes.js";

dotenv.config();
// Connect Database
await connectDB();
// Connect Redis
await connectRedis();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
// news route
app.use("/api/news", newsRoutes);
// Slider route
app.use("/api/slider", sliderRoutes);
// Important highlights route
app.use("/api/highlights", highlightRoutes);
// VC Message Route
app.use("/api/vc-message", vcRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});