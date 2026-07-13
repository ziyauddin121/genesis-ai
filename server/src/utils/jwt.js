import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * @desc    Signs a new JWT access token for the user ID
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * @desc    Verifies and decodes a signed JWT access token
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export {
  generateAccessToken,
  verifyAccessToken,
};
