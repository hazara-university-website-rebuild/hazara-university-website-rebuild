import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import authRoutes from "./modules/auth/auth.routes.js";
import {errorMiddleware} from "./middlewares/error.middleware.js"

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

