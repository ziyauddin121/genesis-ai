import env from './env.js';

/**
 * @desc    Global HTTP-Only session cookie configuration rules
 */
export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

export default cookieOptions;
