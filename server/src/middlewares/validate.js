import AppError from '../utils/AppError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Collect all Zod validation details
      const errors = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      // Create a clean AppError with 422 Unprocessable Entity status code
      const appError = new AppError('Validation failed', 422);
      appError.errors = errors; // Expose detailed fields to global error handler

      return next(appError);
    }

    // Replace req.body with validated and sanitized data
    req.body = result.data;
    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      const appError = new AppError('Validation failed', 422);
      appError.errors = errors;

      return next(appError);
    }

    // Replace req.params with validated and sanitized data
    req.params = result.data;
    next();
  };
};

export default validate;
