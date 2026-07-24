import { findCategory } from './keyword.matcher.js';

/**
 * Core Category Detector for Task Analysis.
 * Analyzes a single dimension: Task Category (WEBSITE, RESUME, STUDY, DEVELOPER, etc.)
 * Strictly follows the principle: Detectors analyze one dimension, Engine decides.
 * 
 * @param {Object} resolvedIntent - Output from Interaction Layer / Intent Engine
 * @param {Object} taskAnalysis - Standard Task Analysis Model
 * @returns {Object} Enriched Task Analysis Object
 */
export const detectCategory = (resolvedIntent, taskAnalysis) => {
  if (!resolvedIntent || !taskAnalysis) {
    return taskAnalysis;
  }

  const goalText = resolvedIntent.goal || '';
  const matchResult = findCategory(goalText);

  // Pure single-dimension analysis: update category
  taskAnalysis.category = matchResult.category;

  // Store detector evidence under metadata.detectors.category
  if (!taskAnalysis.metadata.detectors) {
    taskAnalysis.metadata.detectors = {};
  }

  taskAnalysis.metadata.detectors.category = {
    matchedKeywords: matchResult.matchedKeywords || [],
    confidence: matchResult.confidence || 0.0,
  };

  return taskAnalysis;
};

export default {
  detectCategory,
};
