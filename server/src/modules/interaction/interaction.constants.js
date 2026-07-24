/**
 * Interaction Engine Constants
 * Standard constants, enums, keywords, and thresholds for the Interaction Layer.
 */

export const INTERACTION_TYPE = Object.freeze({
  VOICE: 'VOICE',
  TEXT: 'TEXT',
});

export const INTENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  AMBIGUOUS: 'AMBIGUOUS',
  CORRECTION_DETECTED: 'CORRECTION_DETECTED',
  REJECTED: 'REJECTED',
});

export const INTERACTION_EVENTS = Object.freeze({
  INTENT_UPDATED: 'INTENT_UPDATED',
  USER_INTERRUPTED: 'USER_INTERRUPTED',
  APPROVED: 'APPROVED',
  MODIFIED: 'MODIFIED',
  REJECTED: 'REJECTED',
});

export const CORRECTION_TYPE_MAP = Object.freeze({
  CANCEL: Object.freeze(['forget that', 'scratch that', 'never mind', 'nevermind', 'cancel that']),
  PAUSE: Object.freeze(['wait', 'hold on']),
  REPLACE: Object.freeze(['actually', 'instead', 'change that to', 'rather']),
  MODIFY: Object.freeze(['i mean', 'meaning', 'correction:', 'mistake', 'correction']),
});

export const CORRECTION_KEYWORDS = Object.freeze([
  'actually',
  'instead',
  'wait',
  'forget that',
  'never mind',
  'nevermind',
  'scratch that',
  'change that to',
  'rather',
  'correction:',
  'mistake',
  'cancel that',
  'hold on',
  'i mean',
  'meaning',
  'correction',
]);

export const CORRECTION_CONFIDENCE = Object.freeze({
  HIGH: 0.98,
  STANDARD: 0.94,
});

export const ENTITY_DOMAIN_MAP = Object.freeze({
  theme: Object.freeze(['dark', 'light', 'dark mode', 'light mode', 'glassmorphic', 'glassmorphism']),
  framework: Object.freeze(['react', 'vue', 'angular', 'next', 'nextjs', 'express', 'node', 'tailwind', 'bootstrap']),
  style: Object.freeze(['modern', 'minimal', 'minimalist', 'clean', 'sleek', 'bold', 'futuristic', 'responsive']),
  color: Object.freeze(['blue', 'red', 'green', 'purple', 'black', 'white', 'pastel', 'cyan', 'emerald']),
  architecture: Object.freeze(['monorepo', 'microservices', 'serverless', 'rest', 'graphql']),
});

// Alias for backward compatibility
export const PREFERENCE_DOMAIN_MAP = ENTITY_DOMAIN_MAP;

export const PREFERENCE_KEYWORDS = Object.freeze([
  'prefer',
  'preference',
  'like',
  'want',
  'always',
  'with',
  'using',
  'style',
  'theme',
  'fav',
  'favorite',
  'ideally',
  'in terms of',
]);

export const CONSTRAINT_TYPES = Object.freeze({
  REQUIREMENT: 'REQUIREMENT',
  RESTRICTION: 'RESTRICTION',
  EXCLUSION: 'EXCLUSION',
  LIMIT: 'LIMIT',
});

export const CONSTRAINT_KEYWORDS = Object.freeze([
  'must',
  'should',
  'must not',
  'don\'t',
  'do not',
  'without',
  'only',
  'limit',
  'max',
  'min',
  'require',
  'required',
  'strictly',
  'strict',
  'no more than',
  'at least',
  'deadline',
]);

export const CONFIDENCE_THRESHOLDS = Object.freeze({
  HIGH: 0.85,
  MEDIUM: 0.60,
  LOW: 0.40,
  MINIMUM_ACCEPTED: 0.50,
});

export const AMBIGUITY_THRESHOLDS = Object.freeze({
  TRIGGER_THRESHOLD: 0.50,
  HIGH_AMBIGUITY: 0.75,
  LOW_AMBIGUITY: 0.25,
});

export const DEFAULT_INTERACTION_CONFIG = Object.freeze({
  DEFAULT_TYPE: INTERACTION_TYPE.TEXT,
  DEFAULT_CONFIDENCE: 1.0,
  MIN_CORRECTION_WORD_COUNT: 1,
});
