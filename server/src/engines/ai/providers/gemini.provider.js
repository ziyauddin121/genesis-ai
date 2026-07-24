import {
  AI_PROVIDERS,
  AI_ENDPOINTS,
  AI_TIMEOUT,
} from '../ai.constants.js';
import AppError from '../../../utils/AppError.js';

class GeminiProvider {
  /**
   * Execute prompt messages against Google Gemini API (Requires Node.js 18+)
   * Acts as a pure HTTP client returning raw provider data
   */
  async generate({ messages, config = {} }) {
    const { model, temperature, maxTokens } = config;
    const apiKey = process.env.GEMINI_API_KEY;

    const isMockKey =
      !apiKey ||
      apiKey === 'mock-api-key' ||
      apiKey.startsWith('mock') ||
      apiKey.includes('your_');

    if (isMockKey) {
      if (process.env.NODE_ENV === 'development' || !apiKey) {
        return {
          content: `[Genesis AI Gemini Provider Engine Mock]\nGenerated output for model: ${model}`,
          provider: AI_PROVIDERS.GEMINI,
          model,
          usageMetadata: {
            promptTokenCount: 120,
            candidatesTokenCount: 80,
            totalTokenCount: 200,
          },
        };
      }
      throw new AppError('GEMINI_API_KEY is missing in environment', 500);
    }

    const systemMessage =
      messages.find((m) => m.role === 'system')?.content || '';
    const userMessage =
      messages.find((m) => m.role === 'user')?.content || '';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT.REQUEST);

    try {
      const endpoint = `${AI_ENDPOINTS.GEMINI}/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemMessage }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userMessage }],
            },
          ],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
          },
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new AppError('Failed to parse Gemini API JSON response', 502);
      }

      if (!response.ok) {
        throw new AppError(
          data.error?.message || 'Gemini API request failed',
          502
        );
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new AppError('Gemini API request timed out', 504);
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`Gemini Provider failure: ${error.message}`, 502);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export default new GeminiProvider();
