/**
 * Task Analyzer Constants
 * Defines domain categories, complexity indicators, execution modes, and classification rules.
 */

// ============================================================================
// 1. Task Categories
// ============================================================================
export const TASK_CATEGORY = Object.freeze({
  WEBSITE: 'WEBSITE',
  RESUME: 'RESUME',
  STUDY: 'STUDY',
  DEVELOPER: 'DEVELOPER',
  BUSINESS: 'BUSINESS',
  IMAGE: 'IMAGE',
  DOCUMENT: 'DOCUMENT',
  AUTOMATION: 'AUTOMATION',
  GENERAL: 'GENERAL',
  UNKNOWN: 'UNKNOWN',
});

// ============================================================================
// 2. Category Priority (Tie-Breaker)
// ============================================================================
export const CATEGORY_PRIORITY = Object.freeze({
  [TASK_CATEGORY.WEBSITE]: 5,
  [TASK_CATEGORY.RESUME]: 5,
  [TASK_CATEGORY.DEVELOPER]: 4,
  [TASK_CATEGORY.STUDY]: 4,
  [TASK_CATEGORY.BUSINESS]: 3,
  [TASK_CATEGORY.AUTOMATION]: 3,
  [TASK_CATEGORY.DOCUMENT]: 2,
  [TASK_CATEGORY.IMAGE]: 2,
  [TASK_CATEGORY.GENERAL]: 1,
  [TASK_CATEGORY.UNKNOWN]: 0,
});

// ============================================================================
// 3. Task Complexity Levels
// ============================================================================
export const TASK_COMPLEXITY = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
});

// ============================================================================
// 4. Execution Modes
// ============================================================================
export const EXECUTION_MODE = Object.freeze({
  SINGLE_STEP: 'SINGLE_STEP',
  MULTI_STEP: 'MULTI_STEP',
  INTERACTIVE: 'INTERACTIVE',
});

// ============================================================================
// 5. Analysis Source Types
// ============================================================================
export const ANALYSIS_SOURCE = Object.freeze({
  RULE: 'rule',
  LLM: 'llm',
  HYBRID: 'hybrid',
});

// ============================================================================
// 6. Category Matching Rules
// ============================================================================
export const CATEGORY_RULES = Object.freeze({
  [TASK_CATEGORY.WEBSITE]: Object.freeze([
    'website',
    'portfolio',
    'landing page',
    'e-commerce',
    'ecommerce',
    'web app',
    'webapp',
    'frontend',
    'dashboard',
    'site',
    'todo list',
    'todo app',
  ]),
  [TASK_CATEGORY.RESUME]: Object.freeze([
    'resume',
    'cv',
    'curriculum vitae',
    'cover letter',
    'bio',
    'portfolio resume',
  ]),
  [TASK_CATEGORY.STUDY]: Object.freeze([
    'quiz',
    'flashcard',
    'flashcards',
    'notes',
    'study',
    'summary',
    'explain',
    'cheat sheet',
    'course',
    'exam',
  ]),
  [TASK_CATEGORY.DEVELOPER]: Object.freeze([
    'api',
    'backend',
    'database',
    'docker',
    'script',
    'auth',
    'authentication',
    'cli',
    'function',
    'endpoint',
    'microservice',
  ]),
  [TASK_CATEGORY.BUSINESS]: Object.freeze([
    'invoice',
    'proposal',
    'report',
    'contract',
    'pitch deck',
    'business plan',
    'financial',
  ]),
  [TASK_CATEGORY.IMAGE]: Object.freeze([
    'image',
    'logo',
    'illustration',
    'graphic',
    'banner',
    'photo',
    'avatar',
  ]),
  [TASK_CATEGORY.DOCUMENT]: Object.freeze([
    'pdf',
    'document',
    'doc',
    'docx',
    'spreadsheet',
    'excel',
    'presentation',
  ]),
  [TASK_CATEGORY.AUTOMATION]: Object.freeze([
    'automation',
    'cron',
    'scraper',
    'bot',
    'webhook',
    'workflow automation',
  ]),
});

// ============================================================================
// 7. Interactive Mode Keywords
// ============================================================================
export const INTERACTIVE_KEYWORDS = Object.freeze([
  'together',
  'collaborate',
  'step by step',
  'guide me',
  'interactive',
]);

// ============================================================================
// 8. Technical Dependency Capability Rules
// ============================================================================
export const DEPENDENCY_RULES = Object.freeze([
  Object.freeze({ capability: 'database', keywords: Object.freeze(['database', 'mongo', 'mongodb', 'postgres', 'mysql', 'sql', 'firebase']) }),
  Object.freeze({ capability: 'auth', keywords: Object.freeze(['auth', 'authentication', 'login', 'signup', 'user management', 'jwt']) }),
  Object.freeze({ capability: 'payment', keywords: Object.freeze(['payment', 'stripe', 'checkout', 'billing', 'paypal']) }),
  Object.freeze({ capability: 'ui_framework', keywords: Object.freeze(['react', 'vue', 'angular', 'next', 'tailwind', 'bootstrap']) }),
  Object.freeze({ capability: 'ai_agent', keywords: Object.freeze(['ai', 'llm', 'agent', 'multi-agent', 'gpt', 'pipeline']) }),
  Object.freeze({ capability: 'pdf_generator', keywords: Object.freeze(['pdf', 'document', 'resume', 'cv', 'contract']) }),
  Object.freeze({ capability: 'cron', keywords: Object.freeze(['cron', 'automation', 'bot', 'scraper', 'scheduled']) }),
]);

// ============================================================================
// 9. Complexity Domain Indicators
// ============================================================================
export const COMPLEXITY_INDICATORS = Object.freeze({
  HIGH: Object.freeze([
    'ai',
    'llm',
    'workflow',
    'planning',
    'automation',
    'agent',
    'multi-agent',
    'pipeline',
    'database',
    'auth',
    'authentication',
    'payment',
    'stripe',
    'multi-page',
    'microservices',
    'fullstack',
    'realtime',
    'socket',
  ]),
  MEDIUM: Object.freeze([
    'form',
    'api',
    'state management',
    'responsive',
    'dashboard',
    'filter',
    'search',
  ]),
  LOW: Object.freeze([
    'static',
    'single page',
    'todo',
    'counter',
    'button',
    'card',
  ]),
});

// ============================================================================
// 10. Complexity Score Weights
// ============================================================================
export const COMPLEXITY_WEIGHTS = Object.freeze({
  BASE: 0.20,
  HIGH_MATCH: 0.35,
  MEDIUM_MATCH: 0.18,
  LOW_MATCH: -0.05,
  DATABASE_CONSTRAINT: 0.25,
  FEATURE_CONSTRAINT: 0.25,
  TECHNICAL_PREFERENCE: 0.15,
});

// ============================================================================
// 11. Match Confidence Formula Constants
// ============================================================================
export const MATCH_CONFIDENCE = Object.freeze({
  BASE: 0.70,
  MULTIPLIER: 0.12,
  MAX: 0.98,
});

// ============================================================================
// 12. Analysis Thresholds & Score Bounds
// ============================================================================
export const ANALYSIS_THRESHOLD = Object.freeze({
  HIGH_COMPLEXITY_SCORE: 0.75,
  MEDIUM_COMPLEXITY_SCORE: 0.40,
  CONFIDENCE_MIN: 0.50,
});

// ============================================================================
// 13. Default Analysis Configuration
// ============================================================================
export const DEFAULT_ANALYSIS_CONFIG = Object.freeze({
  DEFAULT_CATEGORY: TASK_CATEGORY.UNKNOWN,
  DEFAULT_COMPLEXITY: TASK_COMPLEXITY.LOW,
  DEFAULT_EXECUTION_MODE: EXECUTION_MODE.SINGLE_STEP,
  DEFAULT_DEPENDENCY_CONFIDENCE: 0.90,
  DEFAULT_EXECUTION_MODE_CONFIDENCE: 0.90,
});
