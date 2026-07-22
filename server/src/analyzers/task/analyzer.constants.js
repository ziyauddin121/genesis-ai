export const TASK_COMPLEXITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

export const ANALYZER_DEFAULTS = Object.freeze({
  MIN_HIGH_COMPLEXITY_WORDS: 20,
  MIN_MEDIUM_COMPLEXITY_WORDS: 8,
});

export const COMPLEXITY_KEYWORDS = Object.freeze({
  HIGH: [
    'authentication',
    'auth',
    'payment',
    'payments',
    'stripe',
    'admin',
    'dashboard',
    'database',
    'backend',
    'ai',
    'ecommerce',
    'e-commerce',
  ],
  MEDIUM: [
    'api',
    'state',
    'routing',
    'form',
    'filter',
    'search',
    'modal',
  ],
});
