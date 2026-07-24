import { INTENT_STATUS } from './interaction.constants.js';
import { createInteraction } from './interaction.model.js';
import { detectCorrection } from './detectors/correction.detector.js';
import { detectPreferences } from './detectors/preference.detector.js';
import { detectConstraints } from './detectors/constraint.detector.js';
import { detectAmbiguity } from './detectors/ambiguity.detector.js';
import { resolve } from './intent/intent.engine.js';

/**
 * Registered Evidence Detector Pipeline.
 * Pluggable list of detector functions that enrich the interaction object.
 */
const DETECTORS = Object.freeze([
  detectCorrection,
  detectPreferences,
  detectConstraints,
  detectAmbiguity,
]);

/**
 * Core Interaction Engine Pipeline Orchestrator.
 * Accepts raw user input/options, instantiates a standard Interaction model,
 * executes registered detectors via plugin loop, and resolves final intent immutably.
 * 
 * @param {Object|string} inputOptions - Raw string or options object { input, type, metadata }
 * @returns {{ interaction: Object, resolvedIntent: Object, metadata: Object }}
 */
export const processInteraction = (inputOptions) => {
  const startTime = Date.now();
  const options = typeof inputOptions === 'string' ? { input: inputOptions } : inputOptions;

  // 1. Initialize standard interaction model
  const interaction = createInteraction(options);

  // 2. Pluggable Evidence Collection Pipeline
  for (const detector of DETECTORS) {
    detector(interaction);
  }

  // 3. Immutable Intent Resolution Engine
  const resolvedIntent = resolve(interaction);

  // 4. Safely update top-level interaction status
  interaction.status = resolvedIntent.requiresClarification
    ? INTENT_STATUS.AMBIGUOUS
    : INTENT_STATUS.RESOLVED;

  return {
    interaction,
    resolvedIntent,
    metadata: {
      processingTimeMs: Date.now() - startTime,
      version: '1.0.0',
    },
  };
};

export default {
  processInteraction,
};
