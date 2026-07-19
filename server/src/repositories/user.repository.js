import User from '../models/user.model.js';

/**
 * @desc    Retrieves user record by database primary key
 * @param   {Object} params
 * @param   {string} params.userId
 * @returns {Promise<Object|null>} User document
 */
const findById = async ({ userId }) => {
  return await User.findById(userId).exec();
};

export {
  findById,
};
