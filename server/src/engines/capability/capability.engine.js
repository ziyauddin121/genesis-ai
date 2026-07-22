import { CAPABILITY_IDS, EXECUTION_STATUS } from './capability.constants.js';
import AppError from '../../utils/AppError.js';
import aiEngine from '../ai/ai.engine.js';

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
    const aiResult = await aiEngine.generate({
      task: analysis.task || 'Build Website',
      capability: CAPABILITY_IDS.WEBSITE_BUILDER,
      analysis,
    });

    return {
      status: EXECUTION_STATUS.SUCCESS,
      capability: CAPABILITY_IDS.WEBSITE_BUILDER,
      message: 'Website builder capability executed successfully',
      result: aiResult,
    };
  }

  async #executeResumeBuilder(analysis) {
    const aiResult = await aiEngine.generate({
      task: analysis.task || 'Build Resume',
      capability: CAPABILITY_IDS.RESUME_BUILDER,
      analysis,
    });

    return {
      status: EXECUTION_STATUS.SUCCESS,
      capability: CAPABILITY_IDS.RESUME_BUILDER,
      message: 'Resume builder capability executed successfully',
      result: aiResult,
    };
  }

  async #executeStudyTools(analysis) {
    const aiResult = await aiEngine.generate({
      task: analysis.task || 'Study Assistant Task',
      capability: CAPABILITY_IDS.STUDY_TOOLS,
      analysis,
    });

    return {
      status: EXECUTION_STATUS.SUCCESS,
      capability: CAPABILITY_IDS.STUDY_TOOLS,
      message: 'Study tools capability executed successfully',
      result: aiResult,
    };
  }

  async #executeDeveloperTools(analysis) {
    const aiResult = await aiEngine.generate({
      task: analysis.task || 'Developer Tools Task',
      capability: CAPABILITY_IDS.DEVELOPER_TOOLS,
      analysis,
    });

    return {
      status: EXECUTION_STATUS.SUCCESS,
      capability: CAPABILITY_IDS.DEVELOPER_TOOLS,
      message: 'Developer tools capability executed successfully',
      result: aiResult,
    };
  }

  async #executeGeneralAssistant(analysis) {
    const aiResult = await aiEngine.generate({
      task: analysis.task || 'General AI Task',
      capability: CAPABILITY_IDS.GENERAL_ASSISTANT,
      analysis,
    });

    return {
      status: EXECUTION_STATUS.SUCCESS,
      capability: CAPABILITY_IDS.GENERAL_ASSISTANT,
      message: 'General assistant capability executed successfully',
      result: aiResult,
    };
  }
}

export default new CapabilityEngine();
