import { verifyAccessToken } from "../../utils/token";

/**
 * Middleware to protect routes
 * Reads access token from Authorization header: Bearer <token>
 * Attaches decoded payload to req.user
 */
export const protect = (req, res, next) => {
  try {

    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Access token missing" });
    }

    // 3️⃣ Verify token
    const payload = verifyAccessToken(token);

    // 4️⃣ Attach user info to request
    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch (err) {

    return res.status(401).json({ success: false, message: "Invalid or expired access token" });

  }
};



/**
 * Role-based authorization middleware
 * Usage: restrictTo("admin") or restrictTo("admin", "moderator")
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access forbidden: insufficient permissions" });
    }
    next();
  };
};
