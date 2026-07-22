import { AI_PROVIDERS, AI_RESPONSE_STATUS } from '../ai.constants.js';

class OpenAIProvider {
  /**
   * Execute prompt messages against OpenAI API
   */
  async generate({ messages, config = {} }) {
    const { model, temperature, maxTokens } = config;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Mock execution fallback if API key is absent in dev environment
      return {
        status: AI_RESPONSE_STATUS.SUCCESS,
        content: `[Genesis AI OpenAI Provider Engine]\nGenerated output for model: ${model}`,
        provider: AI_PROVIDERS.OPENAI,
        model,
        usage: {
          promptTokens: 100,
          completionTokens: 75,
          totalTokens: 175,
        },
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API request failed');
    }

    const content = data.choices?.[0]?.message?.content || '';

    return {
      status: AI_RESPONSE_STATUS.SUCCESS,
      content,
      provider: AI_PROVIDERS.OPENAI,
      model,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }
}

export default new OpenAIProvider();
