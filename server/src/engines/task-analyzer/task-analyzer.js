import { TASK_CATEGORY } from './analyzer.constants.js';
import { createTaskAnalysis } from './task-analysis.model.js';
import { detectCategory } from './category.detector.js';
import { detectComplexity } from './complexity.detector.js';
import { detectDependencies } from './dependency.detector.js';
import { detectExecutionMode } from './execution-mode.detector.js';

/**
 * List of registered Task Analyzer Detectors.
 */
const DETECTORS = Object.freeze([
  detectCategory,
  detectComplexity,
  detectDependencies,
  detectExecutionMode,
]);

/**
 * Deep freezes an object recursively to guarantee total downstream contract immutability.
 * @param {Object} obj 
 * @returns {Object} Deeply frozen object
 */
const deepFreeze = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      Object.prototype.hasOwnProperty.call(obj, prop) &&
      obj[prop] !== null &&
      (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
};

/**
 * Calculates overall task analysis confidence score from individual detector confidence values.
 * // TODO: Upgrade to weighted average (Category 35%, Complexity 30%, Dependency 20%, Execution 15%) in future iterations.
 * @param {Object} detectorsMetadata 
 * @returns {number}
 */
const calculateOverallConfidence = (detectorsMetadata = {}) => {
  const scores = Object.values(detectorsMetadata)
    .map((d) => d.confidence)
    .filter((c) => typeof c === 'number');

  if (scores.length === 0) return 1.0;
  const avg = scores.reduce((sum, val) => sum + val, 0) / scores.length;
  return Number(avg.toFixed(2));
};

/**
 * Core Task Analyzer Engine Orchestrator.
 * Accepts a Resolved Intent object from the Interaction Layer, runs registered detectors,
 * resolves cross-dimensional fallback decisions, calculates overall confidence, deep freezes the contract model,
 * and produces final immutable TaskAnalysis for Workflow Engine.
 * 
 * Pipeline Flow:
 * analyze(resolvedIntent) ➔ createTaskAnalysis ➔ detectCategory ➔ detectComplexity 
 *                         ➔ detectDependencies ➔ detectExecutionMode 
 *                         ➔ calculateOverallConfidence ➔ deepFreeze ➔ Return
 * 
 * @param {Object} resolvedIntent - Resolved Intent object from Interaction Layer
 * @returns {Object} Immutable Task Analysis Object for Workflow Engine
 */
export const analyze = (resolvedIntent) => {
  const startTime = performance.now();

  // 1. Instantiate clean TaskAnalysis model
  const taskAnalysis = createTaskAnalysis();

  // Handle empty intent or missing goal
  if (!resolvedIntent || !resolvedIntent.goal) {
    taskAnalysis.category = TASK_CATEGORY.UNKNOWN;
    taskAnalysis.confidence = 0.0;
    taskAnalysis.metadata.analysisTimeMs = Number((performance.now() - startTime).toFixed(2));
    taskAnalysis.metadata.version = '1.0.0';
    return deepFreeze(taskAnalysis);
  }

  // 2. Execute registered single-dimension detectors
  for (const detector of DETECTORS) {
    detector(resolvedIntent, taskAnalysis);
  }

  // 3. Orchestration & Final Decision Layer
  // Fallback: If Category is UNKNOWN but framework/theme preferences are present, infer WEBSITE category
  if (taskAnalysis.category === TASK_CATEGORY.UNKNOWN) {
    const hasUIPreference = (resolvedIntent.preferences || []).some(
      (p) => p.domain === 'framework' || p.domain === 'theme'
    );
    if (hasUIPreference) {
      taskAnalysis.category = TASK_CATEGORY.WEBSITE;
    } else {
      taskAnalysis.category = TASK_CATEGORY.GENERAL;
    }
  }

  // 4. Calculate overall confidence, version, & processing time using performance.now()
  taskAnalysis.confidence = calculateOverallConfidence(taskAnalysis.metadata.detectors);
  taskAnalysis.metadata.analysisTimeMs = Number((performance.now() - startTime).toFixed(2));
  taskAnalysis.metadata.version = '1.0.0';

  // 5. Deep freeze contract model for total downstream immutability
  return deepFreeze(taskAnalysis);
};

export default {
  analyze,
};
