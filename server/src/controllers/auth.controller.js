import AuthService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import env from '../config/env.js';

/**
 * @desc    Register a new user account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  // Delegate business logic validation/hashing/creation to Service layer
  const result = await AuthService.registerUser(req.body);

  // Set HTTP-Only Cookie for session persistence
  res.cookie('token', result.token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  return sendSuccess(res, 'User registered successfully', result, 201);
};

/**
 * @desc    Login credentials, update timestamps, and sign session keys
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  // Delegate business validation and credential checking to Service layer
  const result = await AuthService.loginUser(req.body);

  // Set HTTP-Only Cookie
  res.cookie('token', result.token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  return sendSuccess(res, 'User logged in successfully', result, 200);
};
