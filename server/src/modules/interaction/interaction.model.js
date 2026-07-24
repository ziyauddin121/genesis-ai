import crypto from 'crypto';
import {
  INTERACTION_TYPE,
  INTENT_STATUS,
  DEFAULT_INTERACTION_CONFIG,
} from './interaction.constants.js';

/**
 * Normalizes user input string (trimming whitespace, collapsing multiple spaces).
 * @param {string} input 
 * @returns {string}
 */
export const normalizeInput = (input = '') => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/\s+/g, ' ');
};

/**
 * Factory function to create a standardized Interaction Object.
 * This plain JavaScript object travels through the entire Interaction Engine pipeline.
 * 
 * Data Structure Conventions:
 * - intent: { current: string|null, history: string[], confidence: number }
 * - corrections: Array of structured objects: [{ type: string, from: string|null, to: string|null, rawText: string }]
 * - preferences: Array of structured objects: [{ category: string, value: any, rawText: string }]
 * - constraints: Array of structured objects: [{ type: string, value: any, rawText: string }]
 * - ambiguity: { score: number, reason: string|null }
 * 
 * @param {Object} options
 * @param {string} [options.type] - Interaction type (TEXT, VOICE)
 * @param {string} options.input - Raw input string from the user
 * @param {Object} [options.metadata] - Optional metadata (language, source device, session info)
 * @returns {Object} Standard Interaction Object
 */
export const createInteraction = ({
  type = DEFAULT_INTERACTION_CONFIG.DEFAULT_TYPE,
  input = '',
  metadata = {},
} = {}) => {
  const rawInput = typeof input === 'string' ? input : String(input || '');
  const sanitizedInput = normalizeInput(rawInput);

  return {
    id: crypto.randomUUID(),
    type: Object.values(INTERACTION_TYPE).includes(type)
      ? type
      : DEFAULT_INTERACTION_CONFIG.DEFAULT_TYPE,
    input: rawInput,
    normalizedInput: sanitizedInput,
    intent: {
      current: null,
      history: [],
      confidence: 0,
    },
    status: INTENT_STATUS.PENDING,
    confidence: 0,
    corrections: [],
    preferences: [],
    constraints: [],
    ambiguity: {
      score: 0,
      reason: null,
    },
    metadata: {
      language: 'en',
      timestamp: Date.now(),
      ...metadata,
    },
  };
};
