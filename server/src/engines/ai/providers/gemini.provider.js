import { AI_PROVIDERS, AI_RESPONSE_STATUS } from '../ai.constants.js';

class GeminiProvider {
  /**
   * Execute prompt messages against Google Gemini API
   */
  async generate({ messages, model, temperature, maxTokens }) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock execution fallback if API key is absent in dev environment
      return {
        status: AI_RESPONSE_STATUS.SUCCESS,
        content: `[Genesis AI Gemini Provider Engine]\nGenerated output for model: ${model}`,
        provider: AI_PROVIDERS.GEMINI,
        model,
        usage: {
          promptTokens: 120,
          completionTokens: 80,
          totalTokens: 200,
        },
      };
    }

    const systemMessage =
      messages.find((m) => m.role === 'system')?.content || '';
    const userMessage =
      messages.find((m) => m.role === 'user')?.content || '';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API request failed');
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      status: AI_RESPONSE_STATUS.SUCCESS,
      content,
      provider: AI_PROVIDERS.GEMINI,
      model,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      },
    };
  }
}

export default new GeminiProvider();
