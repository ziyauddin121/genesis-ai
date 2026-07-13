import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * @desc    Signs a new JWT session token for the user ID
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * @desc    Verifies and decodes a signed JWT session token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export {
  generateToken,
  verifyToken,
};
