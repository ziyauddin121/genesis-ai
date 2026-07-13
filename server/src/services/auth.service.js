import AuthRepository from '../repositories/auth.repository.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

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
export const registerUser = async ({ fullName, email, password, role }) => {
  // 1. Check if email is already in use
  const existingUser = await AuthRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  // 2. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Save new record
  const newUser = await AuthRepository.create({
    fullName,
    email,
    password: hashedPassword,
    role,
  });

  // 4. Return sanitized user data
  return sanitizeUser(newUser);
};

/**
 * @desc    Handles credentials checking, state validation, timestamps, and session token generation
 */
export const loginUser = async ({ email, password }) => {
  // 1. Retrieve user by email (explicitly selecting the password hash)
  const user = await AuthRepository.findByEmail(email, '+password');
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

  // 4. Update last login timestamp through the repository
  const updatedUser = await AuthRepository.update(user._id, {
    lastLogin: new Date(),
  });

  // 5. Generate session token
  const token = generateToken(updatedUser._id);

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
