import crypto from 'crypto';
import {
  CONSTRAINT_TYPES,
  ENTITY_DOMAIN_MAP,
  CONFIDENCE_THRESHOLDS,
} from '../interaction.constants.js';

const CONSTRAINT_PATTERNS = [
  {
    type: CONSTRAINT_TYPES.EXCLUSION,
    regex: /\b(?:don't use|do not use|without|avoid|exclude|no)\s+([a-z0-9\$\s]+?)(?:[\.,;]|$|\s+and|\s+with)/i,
  },
  {
    type: CONSTRAINT_TYPES.RESTRICTION,
    regex: /\b(?:only|strictly|only in)\s+([a-z0-9\$\s]+?)(?:[\.,;]|$|\s+and|\s+with)/i,
  },
  {
    type: CONSTRAINT_TYPES.REQUIREMENT,
    regex: /\b(?:must use|must have|requires|required|must be)\s+([a-z0-9\$\s]+?)(?:[\.,;]|$|\s+and|\s+with)/i,
  },
  {
    type: CONSTRAINT_TYPES.LIMIT,
    regex: /\b(?:under|below|max|maximum|limit to|no more than)\s+([₹$€£]?\s*\d+)\s*([a-z]*)/i,
  },
];

export const inferDomain = (value = '') => {
  if (!value) return 'general';
  const lower = value.toLowerCase();

  for (const [domain, terms] of Object.entries(ENTITY_DOMAIN_MAP)) {
    if (terms.some((term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(lower))) {
      return domain;
    }
  }

  if (/\b(auth|authentication|login|signup|user)\b/i.test(lower)) return 'feature';
  if (/\b(mongo|mongodb|firebase|postgres|mysql|sql)\b/i.test(lower)) return 'database';
  if (/\b(budget|cost|price|rupees|inr|usd|\$|₹)\b/i.test(lower)) return 'budget';

  return 'general';
};

const cleanPhrase = (phrase = '') => {
  if (!phrase) return null;
  const cleaned = phrase
    .replace(/^[\s\.,\!\?:]+/, '')
    .replace(/[\s\.,\!\?:]+$/, '')
    .replace(/^(?:in|for|with|on|to|from)\s+/i, '')
    .trim();
  return cleaned.length > 0 ? cleaned : null;
};

const parseLimitDetails = (rawVal = '', rawUnit = '') => {
  const numericString = rawVal.replace(/[^0-9]/g, '');
  const numericValue = parseInt(numericString, 10);

  let unit = cleanPhrase(rawUnit);
  let domain = 'general';

  if (rawVal.includes('₹') || rawVal.includes('inr') || rawVal.includes('$') || rawVal.includes('usd')) {
    unit = rawVal.includes('₹') || rawVal.includes('inr') ? 'INR' : 'USD';
    domain = 'budget';
  } else if (unit) {
    if (/pages?/i.test(unit)) domain = 'page_count';
    else if (/api|calls?/i.test(unit)) domain = 'api_limit';
    else domain = unit;
  }

  return {
    value: isNaN(numericValue) ? rawVal : numericValue,
    operator: '<=',
    unit: unit || null,
    domain,
  };
};

/**
 * Core Constraint Detector.
 * Standard pipeline detector: detectConstraints(interaction) -> interaction
 * Pushes detected constraint evidence items into interaction.constraints array.
 * 
 * @param {Object} interaction - Standard Interaction Object
 * @returns {Object} Enriched Interaction Object
 */
export const detectConstraints = (interaction) => {
  if (!interaction || !interaction.normalizedInput) {
    return interaction;
  }

  const text = interaction.normalizedInput;
  const seenConstraints = new Set();

  for (const { type, regex } of CONSTRAINT_PATTERNS) {
    let match;
    const globalRegex = new RegExp(regex.source, 'gi');

    while ((match = globalRegex.exec(text)) !== null) {
      const extractedValue = cleanPhrase(match[1]);

      if (extractedValue) {
        const uniqueKey = `${type}:${extractedValue.toLowerCase()}`;

        if (!seenConstraints.has(uniqueKey)) {
          seenConstraints.add(uniqueKey);

          let constraintObj = {
            id: crypto.randomUUID(),
            type,
            domain: inferDomain(extractedValue),
            value: extractedValue,
            operator: null,
            unit: null,
            rawText: match[0].trim(),
            confidence: CONFIDENCE_THRESHOLDS.HIGH,
            source: 'rule',
          };

          if (type === CONSTRAINT_TYPES.LIMIT) {
            const limitDetails = parseLimitDetails(match[1], match[2]);
            constraintObj.value = limitDetails.value;
            constraintObj.operator = limitDetails.operator;
            constraintObj.unit = limitDetails.unit;
            constraintObj.domain = limitDetails.domain;
          }

          interaction.constraints.push(constraintObj);
        }
      }
    }
  }

  return interaction;
};
