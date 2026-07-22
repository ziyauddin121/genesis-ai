import {
  AI_PROVIDERS,
  PROVIDER_MODELS,
  AI_DEFAULTS,
} from './ai.constants.js';
import { TASK_COMPLEXITY } from '../../analyzers/task/analyzer.constants.js';

const PROVIDER_CONFIG = Object.freeze({
  [AI_PROVIDERS.GEMINI]: Object.freeze({
    high: PROVIDER_MODELS.GEMINI.PRO,
    default: PROVIDER_MODELS.GEMINI.FLASH,
  }),
  [AI_PROVIDERS.OPENAI]: Object.freeze({
    high: PROVIDER_MODELS.OPENAI.GPT_5,
    default: PROVIDER_MODELS.OPENAI.GPT_5_MINI,
  }),
});

class ProviderRouter {
  /**
   * Determine the optimal AI provider and model based on task capability and complexity
   */
  route(request = {}) {
    // Note: Reserved for future capability-based routing rules
    const _capability = request.capability;
    const complexity = request.analysis?.complexity || request.complexity;
    const preferredProvider = request.preferredProvider;

    // TODO: Route provider dynamically based on:
    // - Cost optimization
    // - Latency targets
    // - User account tier & preferences
    // - Specific capability requirements

    // 1. Check if an explicit preferred provider is specified and supported
    if (
      preferredProvider &&
      Object.values(AI_PROVIDERS).includes(preferredProvider)
    ) {
      return this.#resolveConfig(preferredProvider, complexity);
    }

    // 2. Default routing strategy
    const selectedProvider = AI_DEFAULTS.PROVIDER;
    return this.#resolveConfig(selectedProvider, complexity);
  }

  /**
   * Private Helper: Resolve provider model and runtime execution settings
   */
  #resolveConfig(provider, complexity) {
    const config =
      PROVIDER_CONFIG[provider] || PROVIDER_CONFIG[AI_PROVIDERS.GEMINI];
    const model =
      complexity === TASK_COMPLEXITY.HIGH ? config.high : config.default;

    return {
      provider,
      model,
      temperature: AI_DEFAULTS.TEMPERATURE,
      maxTokens: AI_DEFAULTS.MAX_TOKENS,
    };
  }
}

export default new ProviderRouter();
