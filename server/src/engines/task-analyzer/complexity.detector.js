import {
  TASK_COMPLEXITY,
  COMPLEXITY_INDICATORS,
  COMPLEXITY_WEIGHTS,
  ANALYSIS_THRESHOLD,
} from './analyzer.constants.js';
import { findMatches } from './keyword.matcher.js';

/**
 * Core Complexity Detector for Task Analysis.
 * Analyzes single dimension: Task Complexity (LOW, MEDIUM, HIGH)
 * Strictly follows the principle: Detectors analyze one dimension, Engine decides.
 * 
 * @param {Object} resolvedIntent - Output from Interaction Layer / Intent Engine
 * @param {Object} taskAnalysis - Standard Task Analysis Model
 * @returns {Object} Enriched Task Analysis Object
 */
export const detectComplexity = (resolvedIntent, taskAnalysis) => {
  if (!resolvedIntent || !taskAnalysis) {
    return taskAnalysis;
  }

  const goalText = resolvedIntent.goal || '';

  // 1. Find indicator keyword matches across complexity tiers
  const highMatches = findMatches(goalText, COMPLEXITY_INDICATORS.HIGH);
  const mediumMatches = findMatches(goalText, COMPLEXITY_INDICATORS.MEDIUM);
  const lowMatches = findMatches(goalText, COMPLEXITY_INDICATORS.LOW);

  // 2. Filter strictly for technical & architectural preferences (excluding purely cosmetic theme/color preferences)
  const technicalPreferences = (resolvedIntent.preferences || []).filter(
    (p) => p.domain === 'framework' || p.domain === 'architecture'
  );

  // 3. Domain-specific constraint inspection
  const hasDatabaseConstraint = (resolvedIntent.constraints || []).some((c) => c.domain === 'database');
  const hasFeatureConstraint = (resolvedIntent.constraints || []).some((c) => c.domain === 'feature');

  // 4. Compute weighted complexity score using COMPLEXITY_WEIGHTS constants
  let score = COMPLEXITY_WEIGHTS.BASE;

  score += highMatches.length * COMPLEXITY_WEIGHTS.HIGH_MATCH;
  score += mediumMatches.length * COMPLEXITY_WEIGHTS.MEDIUM_MATCH;
  score += lowMatches.length * COMPLEXITY_WEIGHTS.LOW_MATCH;

  if (hasDatabaseConstraint) score += COMPLEXITY_WEIGHTS.DATABASE_CONSTRAINT;
  if (hasFeatureConstraint) score += COMPLEXITY_WEIGHTS.FEATURE_CONSTRAINT;
  if (technicalPreferences.length >= 2) score += COMPLEXITY_WEIGHTS.TECHNICAL_PREFERENCE;

  const finalScore = Math.min(1.0, Math.max(0.0, score));

  // 5. Map score to complexity enum
  let complexity = TASK_COMPLEXITY.LOW;
  if (finalScore >= ANALYSIS_THRESHOLD.HIGH_COMPLEXITY_SCORE) {
    complexity = TASK_COMPLEXITY.HIGH;
  } else if (finalScore >= ANALYSIS_THRESHOLD.MEDIUM_COMPLEXITY_SCORE) {
    complexity = TASK_COMPLEXITY.MEDIUM;
  }

  // 6. Enrich taskAnalysis model
  taskAnalysis.complexity = complexity;

  if (!taskAnalysis.metadata.detectors) {
    taskAnalysis.metadata.detectors = {};
  }

  // Derive confidence score dynamically from final score
  const dynamicConfidence = Math.max(0.60, Number(finalScore.toFixed(2)));

  taskAnalysis.metadata.detectors.complexity = {
    score: Number(finalScore.toFixed(2)),
    highMatches,
    mediumMatches,
    lowMatches,
    confidence: dynamicConfidence,
  };

  return taskAnalysis;
};

export default {
  detectComplexity,
};
