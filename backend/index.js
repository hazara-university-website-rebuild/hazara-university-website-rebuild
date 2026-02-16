import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import authRoutes from "./modules/auth/auth.routes.js";
dotenv.config();
// Connect Database
await connectDB();
// Connect Redis
await connectRedis();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth/", authRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});