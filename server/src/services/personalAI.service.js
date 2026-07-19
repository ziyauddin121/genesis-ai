import * as PersonalAIRepository from '../repositories/personalAI.repository.js';
import AppError from '../utils/AppError.js';

/**
 * @desc    Helper to sanitize Personal AI profile fields and avoid accidental leaks
 */
const sanitizeProfile = (profile) => ({
  id: profile._id,
  name: profile.name,
  avatar: profile.avatar,
  personality: {
    tone: profile.personality?.tone,
    responseStyle: profile.personality?.responseStyle,
  },
  language: profile.language,
  customInstructions: profile.customInstructions,
  preferredProvider: profile.preferredProvider,
  preferredModel: profile.preferredModel,
  settings: {
    planningEnabled: profile.settings?.planningEnabled,
    confirmationsEnabled: profile.settings?.confirmationsEnabled,
  },
  isOnboarded: profile.isOnboarded,
  status: profile.status,
  lastUsedAt: profile.lastUsedAt,
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});

class PersonalAIService {
  /**
   * @desc    Onboard a user's Personal AI profile
   * @param   {Object} params
   * @param   {string} params.userId
   * @param   {Object} params.onboardingData
   * @returns {Promise<Object>} Sanitized Personal AI profile details
   */
  async onboard({ userId, onboardingData }) {
    // 1. Check if profile already exists for user
    const exists = await PersonalAIRepository.existsByUserId({ userId });
    if (exists) {
      throw new AppError('Personal AI profile already onboarded', 409); // 409 Conflict
    }

    // 2. Create profile with onboarding data, user association, and lastUsedAt timestamp
    const newProfile = await PersonalAIRepository.createPersonalAI({
      personalAIData: {
        ...onboardingData,
        user: userId,
        isOnboarded: true, // Mark as onboarded
        lastUsedAt: new Date(), // Track initial onboarding activity
      },
    });

    // 3. Return sanitized profile
    return sanitizeProfile(newProfile);
  }

  /**
   * @desc    Get Personal AI profile settings
   * @param   {Object} params
   * @param   {string} params.userId
   * @returns {Promise<Object>} Sanitized Personal AI profile details
   */
  async getProfile({ userId }) {
    const profile = await PersonalAIRepository.findByUserId({ userId });
    if (!profile) {
      throw new AppError('Personal AI profile not found', 404);
    }
    return sanitizeProfile(profile);
  }

  /**
   * @desc    Update Personal AI profile settings
   * @param   {Object} params
   * @param   {string} params.userId
   * @param   {Object} params.updateData
   * @returns {Promise<Object>} Sanitized updated Personal AI profile details
   */
  async updateProfile({ userId, updateData }) {
    // 1. Fetch current profile first to check existence (and allow future value comparisons)
    const profile = await PersonalAIRepository.findByUserId({ userId });
    if (!profile) {
      throw new AppError('Personal AI profile not found', 404);
    }

    // 2. Perform the update
    const updatedProfile = await PersonalAIRepository.updateByUserId({
      userId,
      updateData,
    });

    // 3. Return sanitized updated profile
    return sanitizeProfile(updatedProfile);
  }
}

export default new PersonalAIService();
