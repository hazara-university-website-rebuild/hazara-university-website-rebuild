import { logoutService, logoutAllService, register,refreshTokenService,login } from "./auth.service.js";
import { setCookie, clearCookie} from "../../utils/cookie.js";
import { parseExpiresToSeconds } from "../../utils/token.js"

/**
 * Register User Controller
 * Validation is handled by middleware
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Call register service
    const { user, accessToken, refreshToken} = await register(name, email, password);

    // Set HTTP-only cookie for refresh token
    const refreshTtlSeconds = parseExpiresToSeconds(process.env.JWT_REFRESH_EXPIRES);
    setCookie(res, "refreshToken", refreshToken, refreshTtlSeconds);
    
    // Set HTTP-only cookie for refresh token
    const accessTtlSeconds = parseExpiresToSeconds(process.env.JWT_ACCESS_EXPIRES);
    setCookie(res, "accessToken", accessToken, accessTtlSeconds);

    // Return success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    // TODO implement proper error handling using globle error handler
    res.status(400).json({ success: false, message: err.message });
  }
};


/**
 * Login User Controller
 * Validation is handled by middleware
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call login service
    // Expects { user, accessToken, refreshToken, sessionId }
    const { user, accessToken, refreshToken} = await login(email, password);

    // Set HTTP-only cookie for refresh token
    const refreshTtlSeconds = parseExpiresToSeconds(process.env.JWT_REFRESH_EXPIRES);
    setCookie(res, "refreshToken", refreshToken, refreshTtlSeconds);

    const accessTtlSeconds = parseExpiresToSeconds(process.env.JWT_ACCESS_EXPIRES);
    setCookie(res, "accessToken", accessToken, accessTtlSeconds);

    // Return success response with access token and sessionId
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {

    //TODO error handling
    // You can differentiate invalid credentials (401) vs server errors (500)
    const statusCode = err.message === "Invalid credentials" ? 401 : 400;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};



/**
 * Refresh access token controller
 * Reads refresh token from HTTP-only cookie
 */
export const refreshToken = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    //TODO centralized error handling
    if (!refreshTokenCookie) {
      return res.status(401).json({ success: false, message: "" });
    }

    // Call service
<<<<<<< HEAD
    const { accessToken, refreshToken: newRefreshToken} = refreshTokenService(refreshTokenCookie);
=======
    const { accessToken, refreshToken } = await refreshTokenService(refreshTokenCookie);
>>>>>>> origin/main

    // Set new refresh token in HTTP-only cookie
    const refreshTtlSeconds = parseExpiresToSeconds(process.env.JWT_REFRESH_EXPIRES);
    setCookie(res, "refreshToken", refreshToken, refreshTtlSeconds);

    // Set new access token in HTTP-only cookie
    const accessTtlSeconds = parseExpiresToSeconds(process.env.JWT_ACCESS_EXPIRES);
    setCookie(res, "accessToken", accessToken, accessTtlSeconds);

    // Return new access token
    res.json({
      success: true,
      message: "Token refreshed successfully"
    });
  } catch (err) {
    console.log(err)
    //TODO centralized error handling
    res.status(401).json({ success: false, message: err.message });
  }
};



/**
 * Logout from current device/session
 * Expects: refreshToken in cookie
 */
export const logout = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) {
      return res.status(400).json({ success: false, message: "No refresh token found" });
    }
    
    await logoutService(refreshTokenCookie);

    // Clear cookie
    clearCookie(res, "refreshToken");
    clearCookie(res, "accessToken");

    res.json({ success: true, message: "Logged out from current session" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};



/**
 * Logout from all devices (delete all sessions)
 * Expects: userId in request (from decoded token or client)
 */
export const logoutAll = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (!refreshTokenCookie) {
      return res.status(400).json({ success: false, message: "No refresh token found" });
    }

    // Call service to delete all sessions
    await logoutAllService(refreshTokenCookie);

    // Clear cookie
    clearCookie(res, "refreshToken");
    clearCookie(res, "accessToken");

    res.json({ success: true, message: "Logged out from all devices" });

  } catch (err) {
    //TODO centralized error handling
    res.status(400).json({ success: false, message: err.message });

  }
};