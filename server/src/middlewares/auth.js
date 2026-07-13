import * as AuthRepository from '../repositories/auth.repository.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/jwt.js';
import env from '../config/env.js';

/**
 * @desc    Protects routes requiring user authentication
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Retrieve token from Authorization header or Cookies (using env.COOKIE_NAME)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies[env.COOKIE_NAME]) {
    token = req.cookies[env.COOKIE_NAME];
  }

  // Verify token presence
  if (!token) {
    throw new AppError('Not authorized to access this resource', 401);
  }

  let decoded;
  try {
    // 1. Verify JWT signature isolated inside try-catch to differentiate auth errors
    decoded = verifyAccessToken(token);
  } catch (error) {
    throw new AppError('Session token has expired or is invalid', 401);
  }

  // 2. Locate matching database user via AuthRepository using object params (outside try-catch so DB errors trigger 500 status)
  const user = await AuthRepository.findById({ id: decoded.id });
  if (!user) {
    throw new AppError('User session invalid or deleted', 401);
  }

  // 3. Prevent deactivated user accounts from gaining access
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 403);
  }

  // 4. Attach user context and shortcut identifiers to req payload
  req.user = user;
  req.userId = user._id;
  req.auth = {
    id: user._id,
    role: user.role,
  };

  next();
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
