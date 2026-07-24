import Task from '../models/task.model.js';

/**
 * @desc    Find all tasks owned by a specific user (optionally filtered by workspace)
 */
const findAllByOwner = async ({ ownerId, workspaceId }) => {
  const query = { owner: ownerId };
  if (workspaceId) {
    query.workspace = workspaceId;
  }
  return await Task.find(query)
    .sort({ createdAt: -1 })
    .exec();
};

/**
 * @desc    Find a specific task by its ID and owner
 */
const findByIdAndOwner = async ({ taskId, ownerId }) => {
  return await Task.findOne({ _id: taskId, owner: ownerId }).exec();
};

/**
 * @desc    Create a new task
 */
const createTask = async ({ taskData }) => {
  return await Task.create(taskData);
};

/**
 * @desc    Update a task by its ID and owner
 */
const updateTask = async ({ taskId, ownerId, updateData }) => {
  return await Task.findOneAndUpdate(
    { _id: taskId, owner: ownerId },
    updateData,
    { returnDocument: 'after', runValidators: true }
  ).exec();
};

/**
 * @desc    Delete a task by its ID and owner
 */
const deleteTask = async ({ taskId, ownerId }) => {
  return await Task.findOneAndDelete({ _id: taskId, owner: ownerId }).exec();
};

/**
 * @desc    Count total tasks owned by a user
 */
const countByOwner = async ({ ownerId }) => {
  return await Task.countDocuments({ owner: ownerId }).exec();
};

export {
  findAllByOwner,
  findByIdAndOwner,
  createTask,
  updateTask,
  deleteTask,
  countByOwner,
};
