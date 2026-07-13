import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * @desc    Signs a new JWT session token for the user ID
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

export default {
  generateToken,
};
