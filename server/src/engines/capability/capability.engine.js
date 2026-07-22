import { CAPABILITY_IDS, EXECUTION_STATUS } from './capability.constants.js';
import AppError from '../../utils/AppError.js';

class CapabilityEngine {
  /**
   * Dispatch task execution to the designated capability handler
   */
  async execute(analysis) {
    const rawCapability = analysis?.capability;
    const capabilityId =
      typeof rawCapability === 'object' ? rawCapability?.id : rawCapability;

    switch (capabilityId) {
      case CAPABILITY_IDS.WEBSITE_BUILDER:
        return this.#executeWebsiteBuilder(analysis);

      case CAPABILITY_IDS.RESUME_BUILDER:
        return this.#executeResumeBuilder(analysis);

      case CAPABILITY_IDS.STUDY_TOOLS:
        return this.#executeStudyTools(analysis);

      case CAPABILITY_IDS.DEVELOPER_TOOLS:
        return this.#executeDeveloperTools(analysis);

      case CAPABILITY_IDS.GENERAL_ASSISTANT:
        return this.#executeGeneralAssistant(analysis);

      default:
        throw new AppError(`Unsupported capability: ${capabilityId}`, 400);
    }
  }

  async #executeWebsiteBuilder(analysis) {
    // Note: analysis payload will be consumed by AI Engine in Sprint 4+
    return {
      status: EXECUTION_STATUS.SUCCESS,
      capability: CAPABILITY_IDS.WEBSITE_BUILDER,
      message: 'Website builder capability dispatched',
      metadata: {},
    };
  }

  async #executeResumeBuilder(analysis) {
    return {
      status: EXECUTION_STATUS.SUCCESS,
      capability: CAPABILITY_IDS.RESUME_BUILDER,
      message: 'Resume builder capability dispatched',
      metadata: {},
    };
  }

  async #executeStudyTools(analysis) {
    return {
      status: EXECUTION_STATUS.SUCCESS,
      capability: CAPABILITY_IDS.STUDY_TOOLS,
      message: 'Study tools capability dispatched',
      metadata: {},
    };
  }

  async #executeDeveloperTools(analysis) {
    return {
      status: EXECUTION_STATUS.SUCCESS,
      capability: CAPABILITY_IDS.DEVELOPER_TOOLS,
      message: 'Developer tools capability dispatched',
      metadata: {},
    };
  }

  async #executeGeneralAssistant(analysis) {
    return {
      status: EXECUTION_STATUS.SUCCESS,
      capability: CAPABILITY_IDS.GENERAL_ASSISTANT,
      message: 'General assistant capability dispatched',
      metadata: {},
    };
  }
}

export default new CapabilityEngine();
