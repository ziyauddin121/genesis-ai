import * as AuthRepository from '../repositories/auth.repository.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../utils/jwt.js';

/**
 * @desc    Helper to sanitize user response fields and avoid accidental leaks
 */
const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  isVerified: user.isVerified,
});

/**
 * @desc    Handles user registration business logic (checking duplicates, password hashing)
 */
export const registerUser = async ({ fullName, email, password }) => {
  // 1. Check if email is already in use using concise findByEmail with object parameter
  const existingUser = await AuthRepository.findByEmail({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409); // 409 Conflict as requested
  }

  // 2. Hash password (business logic belongs here in Service layer)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Save new record (role is always set to "user" inside server logic)
  const newUser = await AuthRepository.create({
    fullName,
    email,
    password: hashedPassword,
    role: 'user', // Hardcode role to "user" for client registration safety
  });

  // 4. Generate access token
  const token = generateAccessToken(newUser._id);

  // 5. Return sanitized user data and session token
  return {
    user: sanitizeUser(newUser),
    token,
  };
};

/**
 * @desc    Handles credentials checking, state validation, timestamps, and session token generation
 */
export const loginUser = async ({ email, password }) => {
  // 1. Retrieve user by email using concise findByEmail with object parameter
  const user = await AuthRepository.findByEmail({ email, selectFields: '+password' });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // 2. Validate password match
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // 3. Check if account is suspended
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 403);
  }

  // 4. Update last login timestamp using concise update with object parameter
  const updatedUser = await AuthRepository.update({
    id: user._id,
    updateData: { lastLogin: new Date() },
  });

  // 5. Generate session access token
  const token = generateAccessToken(updatedUser._id);

  // 6. Return token and sanitized user details
  return {
    user: sanitizeUser(updatedUser),
    token,
  };
};

export default {
  registerUser,
  loginUser,
};
