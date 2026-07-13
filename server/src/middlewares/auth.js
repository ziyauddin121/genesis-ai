import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import AuthRepository from '../repositories/auth.repository.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Protects routes requiring user authentication
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Retrieve token from Authorization header or Cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Verify token presence
  if (!token) {
    throw new AppError('Not authorized to access this resource', 401);
  }

  try {
    // Verify JWT signature
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Locate matching database user via AuthRepository
    const user = await AuthRepository.findUserById(decoded.id);
    if (!user) {
      throw new AppError('User session invalid or deleted', 401);
    }

    // Attach user payload to request context
    req.user = user;
    next();
  } catch (error) {
    throw new AppError('Session token has expired or is invalid', 401);
  }
});

/**
 * @desc    Restricts route access to specific roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `User role [${req.user.role}] is not authorized to access this resource`,
          403
        )
      );
    }
    next();
  };
};
