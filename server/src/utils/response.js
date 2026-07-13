/**
 * @desc    Formats success responses consistently
 */
export const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * @desc    Formats error responses consistently
 */
export const sendError = (res, message, errors = [], statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default {
  sendSuccess,
  sendError,
};
