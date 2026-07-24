import crypto from 'crypto';
import { ENTITY_DOMAIN_MAP, CONFIDENCE_THRESHOLDS } from '../interaction.constants.js';

/**
 * Pre-compiled regex patterns for domain entities using word boundaries.
 */
const COMPILED_DOMAIN_PATTERNS = Object.entries(ENTITY_DOMAIN_MAP).flatMap(([domain, terms]) =>
  terms.map((term) => ({
    domain,
    value: term,
    regex: new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
  }))
);

/**
 * Core Preference Detector.
 * Standard pipeline detector: detectPreferences(interaction) -> interaction
 * Identifies domain entities (theme, framework, style, color, architecture) using word boundary token matching.
 * Attaches source: 'rule' to enable seamless hybrid rule + LLM analytics in future iterations.
 * // TODO: Replace/enhance with LLM semantic entity classifier in future iterations.
 * 
 * @param {Object} interaction - Standard Interaction Object
 * @returns {Object} Enriched Interaction Object
 */
export const detectPreferences = (interaction) => {
  if (!interaction || !interaction.normalizedInput) {
    return interaction;
  }

  const text = interaction.normalizedInput;

  // Track unique preferences using domain + normalized value
  const seenPreferences = new Set();
  const extractedList = [];

  for (const { domain, value, regex } of COMPILED_DOMAIN_PATTERNS) {
    if (regex.test(text)) {
      const uniqueKey = `${domain}:${value.toLowerCase()}`;

      if (!seenPreferences.has(uniqueKey)) {
        seenPreferences.add(uniqueKey);

        extractedList.push({
          id: crypto.randomUUID(),
          domain,
          value,
          rawText: value,
          confidence: CONFIDENCE_THRESHOLDS.HIGH,
          source: 'rule',
        });
      }
    }
  }

  // Pure evidence enrichment: append unique preferences to interaction.preferences array
  for (const pref of extractedList) {
    interaction.preferences.push(pref);
  }

  return interaction;
};
