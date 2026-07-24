import PersonalAI from '../models/personalAI.model.js';

/**
 * @desc    Find Personal AI profile by user ID
 * @param   {Object} params
 * @param   {string} params.userId
 * @returns {Promise<Object|null>} Personal AI document
 */
const findByUserId = async ({ userId }) => {
  return await PersonalAI.findOne({ user: userId }).exec();
};

/**
 * @desc    Check if a Personal AI profile exists for a user ID
 * @param   {Object} params
 * @param   {string} params.userId
 * @returns {Promise<Object|null>} Mongoose exists query result (contains _id or null)
 */
const existsByUserId = async ({ userId }) => {
  return await PersonalAI.exists({ user: userId });
};

/**
 * @desc    Create a new Personal AI profile
 * @param   {Object} params
 * @param   {Object} params.personalAIData
 * @returns {Promise<Object>} Personal AI document
 */
const createPersonalAI = async ({ personalAIData }) => {
  return await PersonalAI.create(personalAIData);
};

/**
 * @desc    Update Personal AI profile by user ID
 * @param   {Object} params
 * @param   {string} params.userId
 * @param   {Object} params.updateData
 * @returns {Promise<Object|null>} Updated Personal AI document
 */
const updateByUserId = async ({ userId, updateData }) => {
  return await PersonalAI.findOneAndUpdate(
    { user: userId },
    updateData,
    { returnDocument: 'after', runValidators: true }
  ).exec();
};

/**
 * @desc    Delete Personal AI profile by user ID (for future use)
 * @param   {Object} params
 * @param   {string} params.userId
 * @returns {Promise<Object|null>} Deleted Personal AI document
 */
const deleteByUserId = async ({ userId }) => {
  return await PersonalAI.findOneAndDelete({ user: userId }).exec();
};

export {
  findByUserId,
  existsByUserId,
  createPersonalAI,
  updateByUserId,
  deleteByUserId,
};
