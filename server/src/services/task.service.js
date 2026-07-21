import * as TaskRepository from '../repositories/task.repository.js';
import * as WorkspaceRepository from '../repositories/workspace.repository.js';
import AppError from '../utils/AppError.js';

class TaskService {
  /**
   * @desc    Create a new task for an authenticated user
   */
  async createTask({ ownerId, taskData }) {
    // Verify that the workspace exists and belongs to the owner
    const workspace = await WorkspaceRepository.findByIdAndOwner({
      workspaceId: taskData.workspace,
      ownerId,
    });

    if (!workspace) {
      throw new AppError('Workspace not found', 404);
    }

    // Create the task
    const task = await TaskRepository.createTask({
      taskData: {
        ...taskData,
        owner: ownerId,
      },
    });

    return task;
  }

  /**
   * @desc    Get all tasks for an authenticated user (optional workspace filter)
   */
  async getTasks({ ownerId, workspaceId }) {
    // If a workspace filter is requested, verify its existence and ownership first
    if (workspaceId) {
      const workspace = await WorkspaceRepository.findByIdAndOwner({
        workspaceId,
        ownerId,
      });

      if (!workspace) {
        throw new AppError('Workspace not found', 404);
      }
    }

    return await TaskRepository.findAllByOwner({ ownerId, workspaceId });
  }

  /**
   * @desc    Get a single task by ID and owner
   */
  async getTask({ taskId, ownerId }) {
    const task = await TaskRepository.findByIdAndOwner({ taskId, ownerId });
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  /**
   * @desc    Update a task by ID and owner
   */
  async updateTask({ taskId, ownerId, updateData }) {
    const updatedTask = await TaskRepository.updateTask({
      taskId,
      ownerId,
      updateData,
    });

    if (!updatedTask) {
      throw new AppError('Task not found', 404);
    }

    return updatedTask;
  }

  /**
   * @desc    Delete a task by ID and owner
   */
  async deleteTask({ taskId, ownerId }) {
    const deletedTask = await TaskRepository.deleteTask({
      taskId,
      ownerId,
    });

    if (!deletedTask) {
      throw new AppError('Task not found', 404);
    }

    return deletedTask;
  }
}

export default new TaskService();
