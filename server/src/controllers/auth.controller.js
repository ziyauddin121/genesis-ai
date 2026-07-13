import AuthService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import { cookieOptions } from '../config/cookie.js';
import env from '../config/env.js';

/**
 * @desc    Register a new user account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  // Delegate business logic validation/hashing/creation to Service layer
  const { user, token } = await AuthService.registerUser(req.body);

  // Set HTTP-Only Cookie for session persistence using shared config and dynamic key
  res.cookie(env.COOKIE_NAME, token, cookieOptions);

  // Return only sanitized user details in body, excluding the token
  return sendSuccess(res, 'User registered successfully', { user }, 201);
};

/**
 * @desc    Login credentials, update timestamps, and sign session keys
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  // Delegate business validation and credential checking to Service layer
  const { user, token } = await AuthService.loginUser(req.body);

  // Set HTTP-Only Cookie using shared config and dynamic key
  res.cookie(env.COOKIE_NAME, token, cookieOptions);

  // Return only sanitized user details in body, excluding the token
  return sendSuccess(res, 'User logged in successfully', { user }, 200);
};
