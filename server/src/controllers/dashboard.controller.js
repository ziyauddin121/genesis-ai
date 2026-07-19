import DashboardService from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get dashboard metrics, user profile, and workspaces
 * @route   GET /api/dashboard
 * @access  Private
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const dashboardData = await DashboardService.getDashboard({ userId });

  return sendSuccess(res, 'Dashboard data retrieved successfully', dashboardData, 200);
});
