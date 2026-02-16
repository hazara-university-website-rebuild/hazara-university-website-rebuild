import User from "../../models/User.model.js";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, parseExpiresToSeconds } from "../../utils/token.js";
import { generateSessionId,saveSession,getSession,deleteAllSessions,deleteSession } from "../../utils/session.js";

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
  if (existingUser) throw new Error("Email is already registered");

  // 3️⃣ Create user
  const user = await User.create({ name, email, password});

  // 5️⃣ Generate unique session id
  const sessionId = generateSessionId();

  // 6️⃣ Calculate TTL from refresh token expiry
  const ttl = parseExpiresToSeconds(process.env.JWT_REFRESH_EXPIRES);

  // 4️⃣ Generate tokens
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id,sessionId});

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
  if (!user) throw new Error("Invalid credentials");

  // 2️⃣ Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const sessionId = generateSessionId();
  // 3️⃣ Generate access token
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  // 4️⃣ Generate refresh token
  const refreshToken = generateRefreshToken({ id: user._id, sessionId });

  // 5️⃣ Store refresh token in Redis with TTL
  const ttl = parseExpiresToSeconds(process.env.JWT_REFRESH_EXPIRES);
  await saveSession(user._id.toString(), sessionId, refreshToken, ttl);

  // 6️⃣ Return data
  return { user, accessToken, refreshToken, sessionId };
};




/**
 * Refresh Token Service
 * @param {string} refreshToken
 * @returns {Object} { accessToken, refreshToken, sessionId, userId }
 */
export const refreshTokenService = async (refreshToken) => {
  try {
    // 1️⃣ Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    const { id: userId, sessionId } = payload;

    // 2️⃣ Check Redis for valid session
    const storedToken = await getSession(userId, sessionId);
    if (!storedToken || storedToken !== refreshToken) {
      throw new Error("Invalid or expired session");
    }

    // 3️⃣ Generate new tokens
    const newAccessToken = generateAccessToken({ id: userId }); // add role if needed
    const newRefreshToken = generateRefreshToken({ id: userId, sessionId });

    // 4️⃣ Store new refresh token in Redis (rotate token)
    const ttl = parseExpiresToSeconds(process.env.JWT_REFRESH_EXPIRES);
    await saveSession(userId, sessionId, newRefreshToken, ttl);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      sessionId,
      userId,
    };
  } catch (err) {
    //TODO centralized error handling
    throw new Error("Refresh token invalid or expired");
  }
};





/**
 * Logout from current session
 * @param {string} refreshToken
 */
export const logoutService = async (refreshToken) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const { id: userId, sessionId } = payload;
    await deleteSession(userId, sessionId);
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
};

/**
 * Logout from all sessions
 * @param {string} refreshToken
 */
export const logoutAllService = async (refreshToken) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const { id: userId, sessionId } = payload;
    await deleteAllSessions(userId);
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
};
