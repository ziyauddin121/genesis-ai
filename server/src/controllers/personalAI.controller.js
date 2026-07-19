import PersonalAIService from '../services/personalAI.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Onboard a user's Personal AI profile
 * @route   POST /api/personal-ai/onboard
 * @access  Private
 */
export const onboardProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const personalAI = await PersonalAIService.onboard({
    userId,
    onboardingData: req.body,
  });

  return sendSuccess(res, 'Personal AI onboarded successfully', personalAI, 201);
});

/**
 * @desc    Get Personal AI profile settings
 * @route   GET /api/personal-ai
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const personalAI = await PersonalAIService.getProfile({ userId });

  return sendSuccess(res, 'Personal AI retrieved successfully', personalAI, 200);
});

/**
 * @desc    Update Personal AI profile settings
 * @route   PATCH /api/personal-ai
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const personalAI = await PersonalAIService.updateProfile({
    userId,
    updateData: req.body,
  });

  return sendSuccess(res, 'Personal AI updated successfully', personalAI, 200);
});
