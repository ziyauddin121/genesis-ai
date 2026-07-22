import { AI_ROLES, PROMPT_VERSION } from './ai.constants.js';
import { BASE_PROMPT } from './prompts/base.prompt.js';
import { WEBSITE_PROMPT } from './prompts/website.prompt.js';
import { RESUME_PROMPT } from './prompts/resume.prompt.js';
import { DEVELOPER_PROMPT } from './prompts/developer.prompt.js';
import { STUDY_PROMPT } from './prompts/study.prompt.js';
import { GENERAL_PROMPT } from './prompts/general.prompt.js';
import contextManager from './context.manager.js';
import AppError from '../../utils/AppError.js';

const PROMPT_MAP = Object.freeze({
  'website-builder': WEBSITE_PROMPT,
  'resume-builder': RESUME_PROMPT,
  'developer-tools': DEVELOPER_PROMPT,
  'study-tools': STUDY_PROMPT,
  'general-assistant': GENERAL_PROMPT,
});

class PromptBuilder {
  /**
   * Compose structured prompts and message array for LLM consumption
   */
  build(request = {}) {
    const { task, capability, analysis, context } = request;

    // 1. Task Validation
    if (!task) {
      throw new AppError('Task object is required for prompt generation', 400);
    }

    const taskTitle = typeof task === 'string' ? task : task.title;
    const taskDescription =
      typeof task === 'object' ? task.description || '' : '';

    if (!taskTitle || taskTitle.trim() === '') {
      throw new AppError('Task title is required for prompt generation', 400);
    }

    // 2. Resolve Capability Prompt
    const capabilityId =
      typeof capability === 'object' ? capability?.id : capability;

    const capabilityPrompt =
      PROMPT_MAP[capabilityId] || PROMPT_MAP['general-assistant'];

    // 3. Compose Two-Layer System Prompt
    const systemPrompt = [BASE_PROMPT, capabilityPrompt].join('\n\n');

    // 4. Build User Prompt
    const userPromptParts = [`### Task Title:\n${taskTitle}`];

    if (taskDescription) {
      userPromptParts.push(`### User Requirements:\n${taskDescription}`);
    }

    if (analysis) {
      const analysisLines = ['### Task Analysis:'];
      if (analysis.complexity) {
        analysisLines.push(`- Complexity: ${analysis.complexity}`);
      }
      if (typeof analysis.requiresPlanning === 'boolean') {
        analysisLines.push(
          `- Planning Required: ${analysis.requiresPlanning ? 'Yes' : 'No'}`
        );
      }
      if (typeof analysis.requiresApproval === 'boolean') {
        analysisLines.push(
          `- Approval Required: ${analysis.requiresApproval ? 'Yes' : 'No'}`
        );
      }
      if (analysisLines.length > 1) {
        userPromptParts.push(analysisLines.join('\n'));
      }
    }

    const sanitizedContext = contextManager.prepare(context);
    if (sanitizedContext) {
      userPromptParts.push(`### Workspace Context:\n${sanitizedContext}`);
    }

    const userPrompt = userPromptParts.join('\n\n');

    // 5. Build Standard Messages Payload
    const messages = [
      {
        role: AI_ROLES.SYSTEM,
        content: systemPrompt,
      },
      {
        role: AI_ROLES.USER,
        content: userPrompt,
      },
    ];

    return {
      messages,
      metadata: {
        capability: capabilityId || 'general-assistant',
        complexity: analysis?.complexity || 'unknown',
        promptVersion: PROMPT_VERSION,
      },
    };
  }
}

export default new PromptBuilder();
