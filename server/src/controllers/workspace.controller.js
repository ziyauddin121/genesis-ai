import * as WorkspaceService from '../services/workspace.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Create a new workspace
 * @route   POST /api/workspaces
 * @access  Private
 */
export const createWorkspace = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const workspace = await WorkspaceService.createWorkspace({
    ownerId,
    workspaceData: req.body,
  });

  return sendSuccess(res, 'Workspace created successfully', { workspace }, 201);
});

/**
 * @desc    Get all active workspaces of the authenticated user
 * @route   GET /api/workspaces
 * @access  Private
 */
export const getWorkspaces = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const workspaces = await WorkspaceService.getWorkspaces({ ownerId });

  return sendSuccess(res, 'Workspaces retrieved successfully', { workspaces }, 200);
});

/**
 * @desc    Get details of a single active workspace
 * @route   GET /api/workspaces/:workspaceId
 * @access  Private
 */
export const getWorkspaceById = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const { workspaceId } = req.params;

  const workspace = await WorkspaceService.getWorkspaceById({ workspaceId, ownerId });

  return sendSuccess(res, 'Workspace retrieved successfully', { workspace }, 200);
});

/**
 * @desc    Update workspace details
 * @route   PATCH /api/workspaces/:workspaceId
 * @access  Private
 */
export const updateWorkspace = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const { workspaceId } = req.params;

  const workspace = await WorkspaceService.updateWorkspace({
    workspaceId,
    ownerId,
    updateData: req.body,
  });

  return sendSuccess(res, 'Workspace updated successfully', { workspace }, 200);
});

/**
 * @desc    Soft archive a workspace
 * @route   DELETE /api/workspaces/:workspaceId
 * @access  Private
 */
export const archiveWorkspace = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const { workspaceId } = req.params;

  const workspace = await WorkspaceService.archiveWorkspace({ workspaceId, ownerId });

  return sendSuccess(res, 'Workspace archived successfully', { workspace }, 200);
});
