import promptBuilder from './prompt.builder.js';
import providerRouter from './provider.router.js';
import responseParser from './response.parser.js';
import geminiProvider from './providers/gemini.provider.js';
import openaiProvider from './providers/openai.provider.js';
import { AI_PROVIDERS } from './ai.constants.js';
import AppError from '../../utils/AppError.js';

class AIEngine {
  #providers = {
    [AI_PROVIDERS.GEMINI]: geminiProvider,
    [AI_PROVIDERS.OPENAI]: openaiProvider,
  };

  /**
   * Main AI Engine Generation Interface
   * Unified entry point for all LLM executions across Genesis AI
   */
  async generate(request = {}) {
    const startedAt = Date.now();

    // 1. Build structured prompt and messages payload
    const { messages, metadata } = promptBuilder.build(request);

    if (!messages || messages.length === 0) {
      throw new AppError('Prompt messages payload is required', 400);
    }

    // 2. Resolve provider and model configuration
    const config = providerRouter.route(request);

    // 3. Select provider engine
    const providerInstance = this.#providers[config.provider];
    if (!providerInstance) {
      throw new AppError(`Unsupported AI provider: ${config.provider}`, 400);
    }

    // 4. Dispatch request to provider with error wrapping
    // TODO: Support response streaming & provider retry/rate-limiting policy (V2)
    let rawResponse;
    try {
      rawResponse = await providerInstance.generate({
        messages,
        config,
      });
    } catch (error) {
      throw new AppError(
        `AI provider request failed: ${error.message}`,
        502
      );
    }

    // 5. Parse and normalize output
    const parsedResult = responseParser.parse(rawResponse, config);

    return {
      ...parsedResult,
      metadata: {
        ...metadata,
        provider: config.provider,
        model: config.model,
        latencyMs: Date.now() - startedAt,
        ...request.metadata,
      },
    };
  }
}

export default new AIEngine();
