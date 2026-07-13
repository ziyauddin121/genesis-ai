import User from '../models/user.model.js';

/**
 * @desc    Finds a user by email, optionally selecting hidden properties (e.g. +password)
 */
export const findByEmail = async (email, selectFields = '') => {
  let query = User.findOne({ email });
  if (selectFields) {
    query = query.select(selectFields);
  }
  return await query.exec();
};

/**
 * @desc    Loads a user document by MongoDB _id
 */
export const findById = async (id) => {
  return await User.findById(id).exec();
};

/**
 * @desc    Creates and saves a new user record in MongoDB
 */
export const create = async (userData) => {
  return await User.create(userData);
};

/**
 * @desc    Updates a user document matching the _id
 */
export const update = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).exec();
};

export default {
  findByEmail,
  findById,
  create,
  update,
};
