import User from '../models/user.model.js';

/**
 * @desc    Finds a user matching the email parameter, optionally including select options
 */
export const findUserByEmail = async (email, selectFields = '') => {
  let query = User.findOne({ email });
  if (selectFields) {
    query = query.select(selectFields);
  }
  return await query.exec();
};

/**
 * @desc    Retrieves user record by database primary key
 */
export const findUserById = async (id) => {
  return await User.findById(id).exec();
};

/**
 * @desc    Writes a new user record into the Mongo collection
 */
export const createUser = async (userData) => {
  return await User.create(userData);
};

/**
 * @desc    Updates user details based on ID
 */
export const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).exec();
};

export default {
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
};
