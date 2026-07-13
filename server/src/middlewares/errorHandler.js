import env from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error stack locally
  console.error(`[Error Middleware] ${err.message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || [],
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
