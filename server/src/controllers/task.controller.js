import TaskService from '../services/task.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
export const createTask = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const task = await TaskService.createTask({
    ownerId,
    taskData: req.body,
  });

  return sendSuccess(res, 'Task created successfully', task, 201);
});

/**
 * @desc    Get all tasks of the authenticated user (optionally filtered by workspace)
 * @route   GET /api/tasks
 * @access  Private
 */
export const getTasks = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const { workspaceId } = req.query;

  const tasks = await TaskService.getTasks({ ownerId, workspaceId });

  return sendSuccess(res, 'Tasks retrieved successfully', tasks, 200);
});

/**
 * @desc    Get details of a single task
 * @route   GET /api/tasks/:taskId
 * @access  Private
 */
export const getTaskById = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const { taskId } = req.params;

  const task = await TaskService.getTask({ taskId, ownerId });

  return sendSuccess(res, 'Task retrieved successfully', task, 200);
});

/**
 * @desc    Update task details
 * @route   PATCH /api/tasks/:taskId
 * @access  Private
 */
export const updateTask = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const { taskId } = req.params;

  const task = await TaskService.updateTask({
    taskId,
    ownerId,
    updateData: req.body,
  });

  return sendSuccess(res, 'Task updated successfully', task, 200);
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:taskId
 * @access  Private
 */
export const deleteTask = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const { taskId } = req.params;

  await TaskService.deleteTask({ taskId, ownerId });

  return sendSuccess(res, 'Task deleted successfully', null, 200);
});
