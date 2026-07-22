export const AI_PROVIDERS = Object.freeze({
  GEMINI: 'gemini',
  OPENAI: 'openai',
});

export const PROVIDER_MODELS = Object.freeze({
  GEMINI: Object.freeze({
    FLASH: 'gemini-2.5-flash',
    PRO: 'gemini-2.5-pro',
  }),
  OPENAI: Object.freeze({
    GPT_5: 'gpt-5',
    GPT_5_MINI: 'gpt-5-mini',
  }),
});

export const AI_ROLES = Object.freeze({
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant',
});

export const AI_RESPONSE_STATUS = Object.freeze({
  SUCCESS: 'success',
  FAILED: 'failed',
  STREAMING: 'streaming',
});

export const AI_TIMEOUT = Object.freeze({
  REQUEST: 30000,
});

export const AI_DEFAULTS = Object.freeze({
  PROVIDER: AI_PROVIDERS.GEMINI,
  MODEL: PROVIDER_MODELS.GEMINI.FLASH,
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2048,
});
