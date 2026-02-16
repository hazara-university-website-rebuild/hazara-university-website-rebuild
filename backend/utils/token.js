import jwt from "jsonwebtoken";

/**
 * Generate JWT Access Token
 * @param {Object} payload - data to encode
 */
export const generateAccessToken = (userId,role) => {
  return jwt.sign({
    userId,
    role
  }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
};


/**
 * Generate JWT Refresh Token
 * @param {Object} payload - data to encode
 */
export const generateRefreshToken = (userId, role, sessionId) => {
  return jwt.sign({
    userId,
    role,
    sessionId
  }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  });
};


/**
 * Verify access token
 * @param {string} token
 */
export const verifyAccessToken = (token) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  return jwt.verify(token, secret);
};


/**
 * Verify refresh token
 * @param {string} token
 */
export const verifyRefreshToken = (token) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  return jwt.verify(token, secret);
};


/**
 * helper for TTL fields Convert String to seconds
 * @param {string} expires
 */

export const parseExpiresToSeconds = (expires) => {
  const num = parseInt(expires);
  if (expires.includes("d")) return num * 24 * 60 * 60;
  if (expires.includes("h")) return num * 60 * 60;
  if (expires.includes("m")) return num * 60;
  if (expires.includes("s")) return num;
  return num; // default seconds
};
