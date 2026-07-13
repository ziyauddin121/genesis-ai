import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import { sendSuccess } from '../utils/response.js';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * @desc    Helper to generate JWT signed token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

/**
 * @desc    Register a new user account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  const { fullName, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  // Create new user (pre-save hook hashes password)
  const user = await User.create({
    fullName,
    email,
    password,
    role,
  });

  // Convert to object and strip password field for safe JSON response
  const userResponse = user.toObject();
  delete userResponse.password;

  return sendSuccess(res, 'User registered successfully', userResponse, 201);
};

/**
 * @desc    Login credentials and sign JWT session
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Retrieve user, explicitly adding password field since select is false
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Validate password match
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if account is suspended/active
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 403);
  }

  // Update last login timestamp
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT token
  const token = generateToken(user._id);

  // Set HTTP-Only Cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Prepare profile response
  const userResponse = user.toObject();
  delete userResponse.password;

  return sendSuccess(res, 'User logged in successfully', {
    user: userResponse,
    token,
  }, 200);
};
