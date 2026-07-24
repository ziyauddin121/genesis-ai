import {
  AI_PROVIDERS,
  AI_ENDPOINTS,
  AI_TIMEOUT,
} from '../ai.constants.js';
import AppError from '../../../utils/AppError.js';

class OpenAIProvider {
  /**
   * Execute prompt messages against OpenAI API (Requires Node.js 18+)
   * Acts as a pure HTTP client returning raw provider data
   */
  async generate({ messages, config = {} }) {
    const { model, temperature, maxTokens } = config;
    const apiKey = process.env.OPENAI_API_KEY;

    const isMockKey =
      !apiKey ||
      apiKey === 'mock-api-key' ||
      apiKey.startsWith('mock') ||
      apiKey.includes('your_');

    if (isMockKey) {
      if (process.env.NODE_ENV === 'development' || !apiKey) {
        return {
          content: `[Genesis AI OpenAI Provider Engine Mock]\nGenerated output for model: ${model}`,
          provider: AI_PROVIDERS.OPENAI,
          model,
          usage: {
            prompt_tokens: 100,
            completion_tokens: 75,
            total_tokens: 175,
          },
        };
      }
      throw new AppError('OPENAI_API_KEY is missing in environment', 500);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT.REQUEST);

    try {
      const response = await fetch(AI_ENDPOINTS.OPENAI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new AppError('Failed to parse OpenAI API JSON response', 502);
      }

      if (!response.ok) {
        throw new AppError(
          data.error?.message || 'OpenAI API request failed',
          502
        );
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new AppError('OpenAI API request timed out', 504);
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`OpenAI Provider failure: ${error.message}`, 502);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export default new OpenAIProvider();
