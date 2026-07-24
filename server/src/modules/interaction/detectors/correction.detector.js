import crypto from 'crypto';
import {
  CORRECTION_KEYWORDS,
  CORRECTION_TYPE_MAP,
  CORRECTION_CONFIDENCE,
} from '../interaction.constants.js';

/**
 * Pre-compiled regex patterns for performance optimization.
 */
const COMPILED_CORRECTION_PATTERNS = CORRECTION_KEYWORDS.map((keyword) => ({
  keyword,
  regex: new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
}));

const NO_LEADING_PATTERN = /^\s*no\s*[\.,\.\.\.]+\s*/i;

/**
 * Searches text for the earliest matching correction keyword or pattern in the sentence.
 * @param {string} text 
 * @returns {{ keyword: string, index: number } | null}
 */
export const findCorrectionKeyword = (text = '') => {
  if (!text || typeof text !== 'string') return null;
  const lowerText = text.toLowerCase();

  let earliestMatch = null;

  for (const { keyword, regex } of COMPILED_CORRECTION_PATTERNS) {
    const match = regex.exec(lowerText);
    if (match) {
      if (!earliestMatch || match.index < earliestMatch.index) {
        earliestMatch = { keyword, index: match.index };
      }
    }
  }

  const noMatch = NO_LEADING_PATTERN.exec(lowerText);
  if (noMatch) {
    if (!earliestMatch || noMatch.index < earliestMatch.index) {
      earliestMatch = { keyword: 'no', index: noMatch.index };
    }
  }

  return earliestMatch;
};

/**
 * Classifies a detected keyword into a correction type.
 * // TODO: Replace/enhance with semantic classifier in future iterations.
 * 
 * @param {string} keyword 
 * @param {string} fullText 
 * @returns {string} (REPLACE | PAUSE | CANCEL | MODIFY)
 */
export const classifyCorrection = (keyword, fullText = '') => {
  if (!keyword) return 'REPLACE';
  const lowerKeyword = keyword.toLowerCase();

  for (const [type, keywords] of Object.entries(CORRECTION_TYPE_MAP)) {
    if (keywords.includes(lowerKeyword)) {
      return type;
    }
  }

  if (lowerKeyword === 'no') {
    return 'REPLACE';
  }

  if (fullText.toLowerCase().includes('instead of')) {
    return 'MODIFY';
  }

  return 'REPLACE';
};

const cleanPhrase = (phrase = '') => {
  if (!phrase) return null;
  const cleaned = phrase
    .replace(/^[\s\.,\!\?:]+/, '')
    .replace(/[\s\.,\!\?:]+$/, '')
    .trim();
  return cleaned.length > 0 ? cleaned : null;
};

export const extractOldIntentText = (text, keyword, keywordIndex) => {
  if (keywordIndex <= 0) return null;
  const beforeText = text.substring(0, keywordIndex);
  return cleanPhrase(beforeText);
};

export const extractNewIntentText = (text, keyword, keywordIndex) => {
  const afterIndex = keywordIndex + keyword.length;
  if (afterIndex >= text.length) return null;
  const afterText = text.substring(afterIndex);
  return cleanPhrase(afterText);
};

/**
 * Core Correction Detector.
 * Standard pipeline detector: detectCorrection(interaction) -> interaction
 * Pushes detected correction items into interaction.corrections array without mutating intent state.
 * 
 * @param {Object} interaction - Standard Interaction Object
 * @returns {Object} Enriched Interaction Object
 */
export const detectCorrection = (interaction) => {
  if (!interaction || !interaction.normalizedInput) {
    return interaction;
  }

  const text = interaction.normalizedInput;
  const found = findCorrectionKeyword(text);

  if (!found) {
    return interaction;
  }

  const { keyword, index } = found;
  const type = classifyCorrection(keyword, text);
  const fromText = extractOldIntentText(text, keyword, index);
  const toText = extractNewIntentText(text, keyword, index);
  const isHighConfidence = type === 'CANCEL' || type === 'PAUSE';

  const correctionResult = {
    id: crypto.randomUUID(),
    detected: true,
    type,
    keyword,
    fromText,
    toText,
    confidence: isHighConfidence ? CORRECTION_CONFIDENCE.HIGH : CORRECTION_CONFIDENCE.STANDARD,
    applied: false,
    source: 'rule',
  };

  interaction.corrections.push(correctionResult);

  return interaction;
};
