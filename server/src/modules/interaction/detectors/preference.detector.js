import crypto from 'crypto';
import { ENTITY_DOMAIN_MAP, CONFIDENCE_THRESHOLDS } from '../interaction.constants.js';

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
 * 
 * @param {Object} interaction - Standard Interaction Object
 * @returns {Object} Enriched Interaction Object
 */
export const detectPreferences = (interaction) => {
  if (!interaction || !interaction.normalizedInput) {
    return interaction;
  }

  const text = interaction.normalizedInput;
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

  for (const pref of extractedList) {
    interaction.preferences.push(pref);
  }

  return interaction;
};
