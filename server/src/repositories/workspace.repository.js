import Workspace from '../models/workspace.model.js';

/**
 * @desc    Find all non-archived workspaces owned by a specific user
 */
const findAllByOwner = async ({ ownerId }) => {
  return await Workspace.find({ owner: ownerId, isArchived: false })
    .sort({ createdAt: -1 })
    .exec();
};

/**
 * @desc    Find a specific non-archived workspace by ID and owner
 */
const findByIdAndOwner = async ({ workspaceId, ownerId }) => {
  return await Workspace.findOne({ _id: workspaceId, owner: ownerId, isArchived: false }).exec();
};

/**
 * @desc    Create a new workspace
 */
const create = async ({ workspaceData }) => {
  return await Workspace.create(workspaceData);
};

/**
 * @desc    Update a workspace by ID and owner
 */
const update = async ({ workspaceId, ownerId, updateData }) => {
  return await Workspace.findOneAndUpdate(
    { _id: workspaceId, owner: ownerId, isArchived: false },
    updateData,
    { new: true, runValidators: true }
  ).exec();
};

/**
 * @desc    Soft-archive a workspace by setting isArchived: true
 */
const archive = async ({ workspaceId, ownerId }) => {
  return await Workspace.findOneAndUpdate(
    { _id: workspaceId, owner: ownerId, isArchived: false },
    { isArchived: true },
    { new: true }
  ).exec();
};

export {
  findAllByOwner,
  findByIdAndOwner,
  create,
  update,
  archive,
};
