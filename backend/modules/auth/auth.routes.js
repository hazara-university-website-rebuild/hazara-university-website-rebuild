import express from "express";
import { registerUser, loginUser, refreshToken, logout, logoutAll } from "./auth.controller.js";
import { validateBody } from "../../middlewares/validateBody.middleware.js";
import { registerSchema,loginSchema } from "./auth.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

// Register
router.post("/register", validateBody(registerSchema), asyncHandler(registerUser) );

// Login
router.post("/login",validateBody(loginSchema), asyncHandler(loginUser) );

// logout
router.get("/logout", asyncHandler(logout) );

// logout All
router.get("/logout-all", asyncHandler(logoutAll) );

// serves access token
router.get("/refresh-token", asyncHandler(refreshToken) )


export default router;
