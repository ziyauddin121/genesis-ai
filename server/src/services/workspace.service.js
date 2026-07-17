import * as WorkspaceRepository from '../repositories/workspace.repository.js';
import AppError from '../utils/AppError.js';
import mongoose from 'mongoose';

/**
 * @desc    Create a new workspace for an authenticated user
 */
export const createWorkspace = async ({ ownerId, workspaceData }) => {
  const workspace = await WorkspaceRepository.create({
    workspaceData: {
      ...workspaceData,
      owner: ownerId,
    },
  });

  return workspace;
};

/**
 * @desc    Get all active workspaces for an authenticated user
 */
export const getWorkspaces = async ({ ownerId }) => {
  return await WorkspaceRepository.findAllByOwner({ ownerId });
};

/**
 * @desc    Get a single active workspace by ID and owner
 */
export const getWorkspaceById = async ({ workspaceId, ownerId }) => {
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new AppError('Invalid workspace ID format', 400);
  }

  const workspace = await WorkspaceRepository.findByIdAndOwner({ workspaceId, ownerId });
  if (!workspace) {
    throw new AppError('Workspace not found', 404);
  }

  return workspace;
};

/**
 * @desc    Update a workspace by ID and owner
 */
export const updateWorkspace = async ({ workspaceId, ownerId, updateData }) => {
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new AppError('Invalid workspace ID format', 400);
  }

  const updatedWorkspace = await WorkspaceRepository.update({
    workspaceId,
    ownerId,
    updateData,
  });

  if (!updatedWorkspace) {
    throw new AppError('Workspace not found or unauthorized to update', 404);
  }

  return updatedWorkspace;
};

/**
 * @desc    Soft archive a workspace by ID and owner
 */
export const archiveWorkspace = async ({ workspaceId, ownerId }) => {
  if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new AppError('Invalid workspace ID format', 400);
  }

  const archivedWorkspace = await WorkspaceRepository.archive({ workspaceId, ownerId });
  if (!archivedWorkspace) {
    throw new AppError('Workspace not found or unauthorized to archive', 404);
  }

  return archivedWorkspace;
};

