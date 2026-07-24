import { DEPENDENCY_RULES, DEFAULT_ANALYSIS_CONFIG } from './analyzer.constants.js';
import { findMatches } from './keyword.matcher.js';

/**
 * Core Dependency Detector for Task Analysis.
 * Analyzes single dimension: Technical Dependencies / Capability Requirements.
 * Strictly follows the principle: Detectors analyze one dimension, Engine decides.
 * 
 * @param {Object} resolvedIntent - Output from Interaction Layer / Intent Engine
 * @param {Object} taskAnalysis - Standard Task Analysis Model
 * @returns {Object} Enriched Task Analysis Object
 */
export const detectDependencies = (resolvedIntent, taskAnalysis) => {
  if (!resolvedIntent || !taskAnalysis) {
    return taskAnalysis;
  }

  const goalText = resolvedIntent.goal || '';
  const preferenceValues = (resolvedIntent.preferences || []).map((p) => String(p.value || '')).join(' ');
  const constraintValues = (resolvedIntent.constraints || []).map((c) => String(c.value || '')).join(' ');

  const detectedSet = new Set(taskAnalysis.dependencies || []);
  const richDependencies = [];

  for (const { capability, keywords } of DEPENDENCY_RULES) {
    const goalMatches = findMatches(goalText, keywords);
    const prefMatches = findMatches(preferenceValues, keywords);
    const constMatches = findMatches(constraintValues, keywords);

    const allMatches = Array.from(new Set([...goalMatches, ...prefMatches, ...constMatches]));

    if (allMatches.length > 0) {
      detectedSet.add(capability);

      let source = 'goal';
      if (prefMatches.length > 0) source = 'preference';
      else if (constMatches.length > 0) source = 'constraint';

      richDependencies.push({
        name: capability,
        matchedKeywords: allMatches,
        source,
      });
    }
  }

  // Update taskAnalysis dependencies array
  taskAnalysis.dependencies = Array.from(detectedSet);

  // Store rich metadata evidence under metadata.detectors.dependency
  if (!taskAnalysis.metadata.detectors) {
    taskAnalysis.metadata.detectors = {};
  }

  taskAnalysis.metadata.detectors.dependency = {
    dependencies: richDependencies,
    confidence: DEFAULT_ANALYSIS_CONFIG.DEFAULT_DEPENDENCY_CONFIDENCE,
  };

  return taskAnalysis;
};

export default {
  detectDependencies,
};
