import User from '../models/user.model.js';

/**
 * @desc    Finds a user matching the email parameter, optionally including select options
 */
const findByEmail = async ({ email, select = '' }) => {
  let query = User.findOne({ email });
  if (select) {
    query = query.select(select);
  }
  return await query.exec();
};

/**
 * @desc    Retrieves user record by database primary key
 */
const findById = async ({ id }) => {
  return await User.findById(id).exec();
};

/**
 * @desc    Writes a new user record into the Mongo collection
 */
const create = async (userData) => {
  return await User.create(userData);
};

/**
 * @desc    Updates user details based on ID
 */
const update = async ({ id, updateData }) => {
  return await User.findByIdAndUpdate(id, updateData, {
    returnDocument: 'after',
    runValidators: true,
  }).exec();
};

export {
  findByEmail,
  findById,
  create,
  update,
};
