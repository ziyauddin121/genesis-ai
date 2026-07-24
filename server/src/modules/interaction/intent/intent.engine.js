import {
  AMBIGUITY_THRESHOLDS,
  CONFIDENCE_THRESHOLDS,
} from '../interaction.constants.js';

/**
 * Resolves active goal from correction evidence without mutating the interaction object.
 * 
 * @param {Object} interaction 
 * @returns {{ goal: string|null, confidence: number }}
 */
const resolveGoalFromCorrections = (interaction) => {
  const corrections = interaction.corrections || [];
  if (corrections.length === 0) {
    return {
      goal: interaction.normalizedInput || null,
      confidence: CONFIDENCE_THRESHOLDS.HIGH,
    };
  }

  const lastCorrection = corrections[corrections.length - 1];

  if (lastCorrection.toText) {
    return {
      goal: lastCorrection.toText,
      confidence: lastCorrection.confidence || CONFIDENCE_THRESHOLDS.HIGH,
    };
  }

  if (lastCorrection.type === 'CANCEL' || lastCorrection.type === 'PAUSE') {
    return {
      goal: null,
      confidence: lastCorrection.confidence || CONFIDENCE_THRESHOLDS.HIGH,
    };
  }

  return {
    goal: interaction.normalizedInput || null,
    confidence: CONFIDENCE_THRESHOLDS.HIGH,
  };
};

/**
 * Merges and deduplicates extracted preference evidence items.
 * 
 * @param {Object} interaction 
 * @returns {Array<Object>} Normalized preferences
 */
const mergePreferences = (interaction) => {
  const rawPreferences = interaction.preferences || [];
  const mergedMap = new Map();

  for (const pref of rawPreferences) {
    const key = `${pref.domain}:${String(pref.value).toLowerCase()}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        domain: pref.domain,
        value: pref.value,
        confidence: pref.confidence || CONFIDENCE_THRESHOLDS.HIGH,
        source: pref.source || 'rule',
      });
    }
  }

  return Array.from(mergedMap.values());
};

/**
 * Merges constraints evidence and resolves potential conflicts.
 * 
 * @param {Object} interaction 
 * @returns {Array<Object>} Normalized constraints
 */
const mergeConstraints = (interaction) => {
  const rawConstraints = interaction.constraints || [];
  const mergedMap = new Map();

  for (const constraint of rawConstraints) {
    const key = `${constraint.type}:${constraint.domain}:${String(constraint.value).toLowerCase()}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        type: constraint.type,
        domain: constraint.domain,
        value: constraint.value,
        operator: constraint.operator || null,
        unit: constraint.unit || null,
        confidence: constraint.confidence || CONFIDENCE_THRESHOLDS.HIGH,
        source: constraint.source || 'rule',
      });
    }
  }

  return Array.from(mergedMap.values());
};

/**
 * Evaluates ambiguity evidence provided by the Ambiguity Detector.
 * 
 * @param {Object} interaction 
 * @returns {{ requiresClarification: boolean, clarificationReason: string|null, suggestedQuestions: Array<string> }}
 */
const evaluateAmbiguity = (interaction) => {
  const ambiguity = interaction.ambiguity || {};
  const score = ambiguity.score || 0;
  const reasons = ambiguity.reasons || [];
  const needsClarification = ambiguity.needsClarification || score >= AMBIGUITY_THRESHOLDS.TRIGGER_THRESHOLD;

  return {
    requiresClarification: needsClarification,
    clarificationReason: reasons.length > 0 ? reasons.join(', ') : null,
    suggestedQuestions: ambiguity.suggestedQuestions || [],
  };
};

/**
 * Calculates overall weighted confidence score for the resolved intent.
 * 
 * @param {Object} interaction 
 * @param {string|null} goal 
 * @param {number} goalConfidence 
 * @param {Object} ambiguityEval 
 * @returns {number}
 */
const calculateConfidence = (interaction, goal, goalConfidence, ambiguityEval) => {
  if (!goal) return 0.0;
  if (ambiguityEval.requiresClarification) {
    return Math.max(0.20, Number((1.0 - (interaction.ambiguity?.score || 0.5)).toFixed(2)));
  }
  return goalConfidence;
};

/**
 * Determines overall resolution status string.
 * 
 * @param {string|null} goal 
 * @param {Object} interaction 
 * @param {Object} ambiguityEval 
 * @returns {string} (READY | AMBIGUOUS | CANCELLED | PAUSED)
 */
const determineResolutionStatus = (goal, interaction, ambiguityEval) => {
  const lastCorrection = (interaction.corrections || []).slice(-1)[0];
  if (lastCorrection) {
    if (lastCorrection.type === 'CANCEL') return 'CANCELLED';
    if (lastCorrection.type === 'PAUSE') return 'PAUSED';
  }
  if (ambiguityEval.requiresClarification) return 'AMBIGUOUS';
  if (!goal) return 'NEEDS_CLARIFICATION';
  return 'READY';
};

/**
 * Assembles the final immutable Resolved Intent object.
 * 
 * @param {string|null} goal 
 * @param {Array<Object>} preferences 
 * @param {Array<Object>} constraints 
 * @param {number} confidence 
 * @param {Object} ambiguityEval 
 * @param {string} resolutionStatus 
 * @param {Object} interaction 
 * @returns {Object} Final Immutable Resolved Intent Object
 */
const buildResolvedIntent = (goal, preferences, constraints, confidence, ambiguityEval, resolutionStatus, interaction) => {
  return Object.freeze({
    resolutionStatus,
    goal,
    preferences,
    constraints,
    confidence,
    requiresClarification: ambiguityEval.requiresClarification,
    clarificationReason: ambiguityEval.clarificationReason,
    suggestedQuestions: ambiguityEval.suggestedQuestions,
    metadata: Object.freeze({
      correctionsCount: (interaction?.corrections || []).length,
      preferencesCount: preferences.length,
      constraintsCount: constraints.length,
      timestamp: Date.now(),
    }),
  });
};

/**
 * Core Intent Engine Resolution API.
 * Consumes an Interaction Object immutably, executes internal resolution pipeline,
 * and produces a clean, structured Resolved Intent object for Task Analyzer.
 * 
 * Strict Rule: Intent Engine DOES NOT mutate the upstream interaction object.
 * 
 * @param {Object} interaction - Standard Interaction Object with evidence
 * @returns {Object} Final Resolved Intent Object
 */
export const resolve = (interaction) => {
  if (!interaction) {
    return buildResolvedIntent(null, [], [], 0.0, {
      requiresClarification: true,
      clarificationReason: 'EMPTY_INTERACTION',
      suggestedQuestions: ['What would you like to build?'],
    }, 'NEEDS_CLARIFICATION', null);
  }

  const { goal, confidence: goalConfidence } = resolveGoalFromCorrections(interaction);
  const preferences = mergePreferences(interaction);
  const constraints = mergeConstraints(interaction);
  const ambiguityEval = evaluateAmbiguity(interaction);
  const confidence = calculateConfidence(interaction, goal, goalConfidence, ambiguityEval);
  const resolutionStatus = determineResolutionStatus(goal, interaction, ambiguityEval);

  return buildResolvedIntent(goal, preferences, constraints, confidence, ambiguityEval, resolutionStatus, interaction);
};

export default {
  resolve,
};
