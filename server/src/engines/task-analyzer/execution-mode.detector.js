import {
  EXECUTION_MODE,
  TASK_COMPLEXITY,
  INTERACTIVE_KEYWORDS,
  DEFAULT_ANALYSIS_CONFIG,
} from './analyzer.constants.js';
import { findMatches } from './keyword.matcher.js';

/**
 * Core Execution Mode Detector for Task Analysis.
 * Analyzes single dimension: Execution Mode (SINGLE_STEP, MULTI_STEP, INTERACTIVE)
 * Strictly follows the principle: Detectors analyze one dimension, Engine decides.
 * 
 * // TODO: Move keyword matching to execution.matcher.js helper in future iterations.
 * 
 * @param {Object} resolvedIntent - Output from Interaction Layer / Intent Engine
 * @param {Object} taskAnalysis - Standard Task Analysis Model
 * @returns {Object} Enriched Task Analysis Object
 */
export const detectExecutionMode = (resolvedIntent, taskAnalysis) => {
  if (!resolvedIntent || !taskAnalysis) {
    return taskAnalysis;
  }

  const goalText = resolvedIntent.goal || '';
  const interactiveMatches = findMatches(goalText, INTERACTIVE_KEYWORDS);
  const interactiveSignals = [...interactiveMatches];

  if (resolvedIntent.requiresClarification) {
    interactiveSignals.push('clarification_required');
  }

  let mode = EXECUTION_MODE.SINGLE_STEP;
  const reasons = [];

  // 1. Check for interactive mode signals
  if (interactiveSignals.length > 0) {
    mode = EXECUTION_MODE.INTERACTIVE;
    reasons.push('INTERACTIVE_SIGNAL');
  }
  // 2. Check for multi-step execution mode indicators
  else if (
    taskAnalysis.complexity === TASK_COMPLEXITY.HIGH ||
    (taskAnalysis.dependencies && taskAnalysis.dependencies.length >= 2)
  ) {
    mode = EXECUTION_MODE.MULTI_STEP;
    if (taskAnalysis.complexity === TASK_COMPLEXITY.HIGH) reasons.push('HIGH_COMPLEXITY');
    if (taskAnalysis.dependencies && taskAnalysis.dependencies.length >= 2) reasons.push('MULTIPLE_DEPENDENCIES');
  } else {
    reasons.push('SINGLE_STEP_DEFAULT');
  }

  // Enrich taskAnalysis executionMode field
  taskAnalysis.executionMode = mode;

  // Store detector evidence under metadata.detectors.executionMode
  if (!taskAnalysis.metadata.detectors) {
    taskAnalysis.metadata.detectors = {};
  }

  taskAnalysis.metadata.detectors.executionMode = {
    executionMode: mode,
    interactiveSignals,
    reasons,
    confidence: DEFAULT_ANALYSIS_CONFIG.DEFAULT_EXECUTION_MODE_CONFIDENCE,
  };

  return taskAnalysis;
};

export default {
  detectExecutionMode,
};
