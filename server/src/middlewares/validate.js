import AppError from '../utils/AppError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Collect all Zod validation details
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      const errorMessages = errors.map((e) => e.message).join(', ');
      
      const appError = new AppError(`Validation failed: ${errorMessages}`, 400);
      appError.errors = errors; // Expose detailed fields to global error handler
      
      return next(appError);
    }

    // Replace req.body with validated and sanitized data
    req.body = result.data;
    next();
  };
};

export default validate;
