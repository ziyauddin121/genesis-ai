import {
  CATEGORY_RULES,
  TASK_CATEGORY,
  CATEGORY_PRIORITY,
  MATCH_CONFIDENCE,
} from './analyzer.constants.js';

/**
 * Pre-compiled regex patterns for category rules at module load time.
 */
const COMPILED_CATEGORY_PATTERNS = Object.entries(CATEGORY_RULES).map(([category, terms]) => ({
  category,
  priority: CATEGORY_PRIORITY[category] || 0,
  patterns: terms.map((term) => ({
    term,
    regex: new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
  })),
}));

/**
 * Normalizes text for matching (lowercase, trim, collapse whitespace).
 * @param {string} text 
 * @returns {string}
 */
export const normalize = (text = '') => {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
};

/**
 * Finds all matching keywords in text using pre-compiled regex patterns.
 * Reusable helper across Task Analyzer, Capability Engine, and Prompt Builder.
 * 
 * @param {string} text - Raw or normalized input text
 * @param {Array<string>} keywords - Target keywords array
 * @returns {Array<string>} List of unique matched keywords
 */
export const findMatches = (text = '', keywords = []) => {
  if (!text || typeof text !== 'string' || !Array.isArray(keywords) || keywords.length === 0) {
    return [];
  }

  const normalizedText = normalize(text);
  const matchedSet = new Set();

  for (const keyword of keywords) {
    if (!keyword || typeof keyword !== 'string') continue;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');

    if (regex.test(normalizedText)) {
      matchedSet.add(keyword);
    }
  }

  return Array.from(matchedSet);
};

/**
 * Evaluates text against pre-compiled CATEGORY_PATTERNS to find matching category.
 * Uses match counts and CATEGORY_PRIORITY for deterministic tie-breaking.
 * 
 * @param {string} text 
 * @returns {{ category: string, matchedKeywords: Array<string>, confidence: number }}
 */
export const findCategory = (text = '') => {
  const normalizedText = normalize(text);
  if (!normalizedText) {
    return {
      category: TASK_CATEGORY.UNKNOWN,
      matchedKeywords: [],
      confidence: 0.0,
    };
  }

  let bestCategory = TASK_CATEGORY.UNKNOWN;
  let bestMatches = [];
  let maxCount = 0;
  let highestPriority = -1;

  for (const { category, priority, patterns } of COMPILED_CATEGORY_PATTERNS) {
    const matchedTerms = [];

    for (const { term, regex } of patterns) {
      if (regex.test(normalizedText)) {
        matchedTerms.push(term);
      }
    }

    const count = matchedTerms.length;

    // Check if better match count, or equal count with higher category priority tie-breaker
    if (count > maxCount || (count === maxCount && count > 0 && priority > highestPriority)) {
      maxCount = count;
      bestMatches = matchedTerms;
      bestCategory = category;
      highestPriority = priority;
    }
  }

  if (maxCount === 0) {
    return {
      category: TASK_CATEGORY.UNKNOWN,
      matchedKeywords: [],
      confidence: 0.0,
    };
  }

  // Calculate confidence score using MATCH_CONFIDENCE constants
  const confidence = Math.min(
    MATCH_CONFIDENCE.MAX,
    Number((MATCH_CONFIDENCE.BASE + maxCount * MATCH_CONFIDENCE.MULTIPLIER).toFixed(2))
  );

  return {
    category: bestCategory,
    matchedKeywords: bestMatches,
    confidence,
  };
};

export default {
  normalize,
  findMatches,
  findCategory,
};
