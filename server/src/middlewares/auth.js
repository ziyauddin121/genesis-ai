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

  try {
    // Verify JWT signature via verifyAccessToken helper
    const decoded = verifyAccessToken(token);

    // Locate matching database user via AuthRepository using object params
    const user = await AuthRepository.findById({ id: decoded.id });
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
