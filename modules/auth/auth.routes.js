import express from "express";
import { registerUser, loginUser, refreshToken, logout, logoutAll } from "./auth.controller.js";
import { validateBody } from "../../backend/middlewares/validateBody.js";
import { registerSchema,loginSchema } from "./auth.validation.js";

const router = express.Router();

// Register
router.post("/register", validateBody(registerSchema), registerUser );

// Login
router.post("/login",validateBody(loginSchema), loginUser );

// logout
router.get("/logout", logout );

// logout All
router.get("/logout-all", logoutAll );

// serves access token
router.get("/refresh-token", refreshToken )


export default router;
