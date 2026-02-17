import User from "../../models/User.model.js";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, parseExpiresToSeconds } from "../../utils/token.js";
import { generateSessionId,saveSession,getSession,deleteAllSessions,deleteSession } from "../../utils/session.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError
} from "../../errors/Http.error.js";


/**
 * Register a new user and create session
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {object} { user, accessToken, refreshToken, sessionId }
 */
export const register = async (name, email, password) => {
  
  // 1️⃣ Check if user already exists
  const existingUser = await User.findOne({ email });

  // TODO proper error handling
    if (existingUser)
    throw new ConflictError("Email already registered");

  const user = await User.create({ name, email, password});


  const sessionId = generateSessionId();
  // 3️⃣ Generate access token
  const accessToken = generateAccessToken( user._id, user.role );
  // 4️⃣ Generate refresh token
  const refreshToken = generateRefreshToken(user._id,user.role, sessionId );

  const ttl = parseExpiresToSeconds(process.env.JWT_REFRESH_EXPIRES);

  // 7️⃣ Store refresh token in Redis
  await saveSession(user._id.toString(), sessionId, refreshToken, ttl);

  
  return { user, accessToken, refreshToken, sessionId };
};


/**
 * Login a user
 * @param {string} email
 * @param {string} password
 * @returns {Object} { user, accessToken, refreshToken, sessionId }
 */
export const login = async (email, password) => {
  // 1️⃣ Find user by email
  const user = await User.findOne({ email }).select("+password"); // make sure password is selected
  if (!user)
    throw new UnauthorizedError("Invalid credentials");

  // 2️⃣ Compare password
  const isMatch = await user.comparePassword(password);
  if (!user)
    throw new UnauthorizedError("Invalid credentials");

  const sessionId = generateSessionId();
  // 3️⃣ Generate access token
  const accessToken = generateAccessToken( user._id, user.role );
  // 4️⃣ Generate refresh token
  const refreshToken = generateRefreshToken( user._id,user.role, sessionId);

  // 5️⃣ Store refresh token in Redis with TTL
  const ttl = parseExpiresToSeconds(process.env.JWT_REFRESH_EXPIRES);
  await saveSession(user._id.toString(), sessionId, refreshToken, ttl);

  // 6️⃣ Return data
  return { user, accessToken, refreshToken};
};




/**
 * Refresh Token Service
 * @param {string} refreshTokenCookie
 * @returns {Object} { accessToken, refreshToken, sessionId, userId }
 */
export const refreshTokenService = async (refreshTokenCookie) => {
if (!refreshTokenCookie)
    throw new UnauthorizedError(
      "Refresh token missing"
    );

  // 1️⃣ Verify refresh token
  const { userId, role, sessionId } = verifyRefreshToken(refreshTokenCookie);

  // 2️⃣ Check Redis for valid session
  const storedToken = await getSession(userId, sessionId);


  if (!storedToken)
    throw new UnauthorizedError(
      "Session expired"
    );

  if (storedToken !== refreshTokenCookie)
    throw new UnauthorizedError(
      "Invalid session"
    );

  // 3️⃣ Generate new tokens
  const newAccessToken = generateAccessToken(userId,role); // add role if needed
  const newRefreshToken = generateRefreshToken(userId,role, sessionId );

  // 4️⃣ Store new refresh token in Redis (rotate token)
  const ttl = parseExpiresToSeconds(process.env.JWT_REFRESH_EXPIRES);
  await saveSession(userId, sessionId, newRefreshToken, ttl);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};





/**
 * Logout from current session
 * @param {string} refreshTokenCookie
 */
export const logoutService = async (refreshTokenCookie) => {
  if (!refreshTokenCookie)
      throw new UnauthorizedError(
        "Refresh token missing"
      );
  const payload = verifyRefreshToken(refreshTokenCookie);
  const {userId,role, sessionId} = payload;
  await deleteSession(userId, sessionId);
};

/**
 * Logout from all sessions
 * @param {string} refreshTokenCookie
 */
export const logoutAllService = async (refreshTokenCookie) => {
  if (!refreshTokenCookie)
    throw new UnauthorizedError(
      "Refresh token missing"
    );
  const {userId} = verifyRefreshToken(refreshTokenCookie);
  await deleteAllSessions(userId);
};
