import * as UserRepository from '../repositories/user.repository.js';
import * as WorkspaceRepository from '../repositories/workspace.repository.js';
import AppError from '../utils/AppError.js';

class DashboardService {
  /**
   * @desc    Get dashboard metrics, user info, and workspaces
   * @param   {Object} params
   * @param   {string} params.userId
   * @returns {Promise<Object>} Dashboard details
   */
  async getDashboard({ userId }) {
    // 1. Fetch user by ID (consistent userId parameter naming) 
    const user = await UserRepository.findById({ userId });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // 2. Fetch all active workspaces for the user
    const workspaces = await WorkspaceRepository.findAllByOwner({ ownerId: userId }) || [];

    // 3. Map/sanitize workspaces to only expose necessary dashboard fields
    const sanitizedWorkspaces = workspaces.map(workspace => ({
      _id: workspace._id,
      name: workspace.name,
      icon: workspace.icon,
      color: workspace.color,
    }));

    // 4. Return sanitized response with stats
    return {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
      workspaces: sanitizedWorkspaces,
      stats: {
        totalWorkspaces: workspaces?.length || 0,
      },
    };
  }
}

export default new DashboardService();
