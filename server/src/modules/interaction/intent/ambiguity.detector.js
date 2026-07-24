import { AMBIGUITY_THRESHOLDS } from '../interaction.constants.js';

/**
 * List of vague words that indicate ambiguity in user requests.
 */
const VAGUE_KEYWORDS = ['something', 'stuff', 'good', 'nice', 'cool', 'whatever', 'anything', 'somehow'];

/**
 * Common underspecified phrases.
 */
const UNDERSPECIFIED_PATTERNS = [
  /^\s*(?:make|build|create)\s+(?:a|an)?\s*(?:website|app|project|tool)?\s*$/i,
  /^\s*(?:do|help|start)\s*$/i,
];

/**
 * Core Ambiguity Detector.
 * Standard pipeline detector: detectAmbiguity(interaction) -> interaction
 * Calculates ambiguity score and reasons to allow Intent Engine to decide whether clarification is needed.
 * // TODO: Enhance with LLM ambiguity analysis in future iterations.
 * 
 * @param {Object} interaction - Standard Interaction Object
 * @returns {Object} Enriched Interaction Object
 */
export const detectAmbiguity = (interaction) => {
  if (!interaction || !interaction.normalizedInput) {
    return interaction;
  }

  const text = interaction.normalizedInput.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const reasons = [];
  let score = 0.0;

  // 1. Check for underspecified / minimal prompt
  if (words.length <= 2 || UNDERSPECIFIED_PATTERNS.some((pattern) => pattern.test(text))) {
    score += 0.50;
    reasons.push('UNDERSPECIFIED_GOAL');
  }

  // 2. Check for vague words
  const foundVagueWords = VAGUE_KEYWORDS.filter((vague) =>
    new RegExp(`\\b${vague}\\b`, 'i').test(text)
  );
  if (foundVagueWords.length > 0) {
    score += 0.35;
    reasons.push('VAGUE_REQUIREMENT');
  }

  // 3. Check for conflicting framework preferences without explicit correction
  const frameworkPrefs = (interaction.preferences || []).filter((p) => p.domain === 'framework');
  if (frameworkPrefs.length > 1 && (interaction.corrections || []).length === 0) {
    score += 0.40;
    reasons.push('COMPETING_PREFERENCES');
  }

  // Cap score between 0.0 and 1.0
  const finalScore = Math.min(1.0, Math.max(0.0, score));
  const needsClarification = finalScore >= AMBIGUITY_THRESHOLDS.TRIGGER_THRESHOLD;

  let suggestedQuestions = [];
  if (reasons.includes('UNDERSPECIFIED_GOAL')) {
    suggestedQuestions.push('What type of website or app would you like to create? (e.g., Portfolio, E-commerce, Todo List)');
  }
  if (reasons.includes('COMPETING_PREFERENCES')) {
    suggestedQuestions.push(`You mentioned multiple frameworks (${frameworkPrefs.map((p) => p.value).join(', ')}). Which one should be the primary framework?`);
  }

  interaction.ambiguity = {
    score: Number(finalScore.toFixed(2)),
    reasons,
    needsClarification,
    suggestedQuestions,
    source: 'rule',
  };

  return interaction;
};
