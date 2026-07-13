import AuthRepository from '../repositories/auth.repository.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

/**
 * @desc    Handles user registration business logic (checking duplicates, password hashing)
 */
export const registerUser = async ({ fullName, email, password, role }) => {
  // 1. Check if email is already in use
  const existingUser = await AuthRepository.findUserByEmail(email);
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  // 2. Hash password (business logic belongs here in Service layer)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Save new record through data access repository
  const newUser = await AuthRepository.createUser({
    fullName,
    email,
    password: hashedPassword,
    role,
  });

  // 4. Strip password field for safe JSON responses
  const userResponse = newUser.toObject();
  delete userResponse.password;

  return userResponse;
};

/**
 * @desc    Handles credentials checking, state validation, timestamps, and session token generation
 */
export const loginUser = async ({ email, password }) => {
  // 1. Retrieve user by email (explicitly selecting the password hash)
  const user = await AuthRepository.findUserByEmail(email, '+password');
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
  const updatedUser = await AuthRepository.updateUser(user._id, {
    lastLogin: new Date(),
  });

  // 5. Generate session token
  const token = generateToken(updatedUser._id);

  // 6. Strip password field for response
  const userResponse = updatedUser.toObject();
  delete userResponse.password;

  return {
    user: userResponse,
    token,
  };
};

export default {
  registerUser,
  loginUser,
};
