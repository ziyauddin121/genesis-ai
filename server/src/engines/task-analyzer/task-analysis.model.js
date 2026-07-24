import crypto from 'crypto';
import {
  TASK_CATEGORY,
  TASK_COMPLEXITY,
  EXECUTION_MODE,
  ANALYSIS_SOURCE,
  DEFAULT_ANALYSIS_CONFIG,
} from './analyzer.constants.js';

/**
 * Factory function to create a standardized Task Analysis Object.
 * Represents the structured contract passed from Task Analyzer to Workflow Engine.
 * Follows the "Models before processors" principle.
 * 
 * @param {Object} options
 * @param {string} [options.category] - Category enum (WEBSITE, RESUME, STUDY, DEVELOPER, etc.)
 * @param {string} [options.complexity] - Complexity enum (LOW, MEDIUM, HIGH)
 * @param {string} [options.executionMode] - Execution mode enum (SINGLE_STEP, MULTI_STEP, INTERACTIVE)
 * @param {Array<string>} [options.dependencies] - List of required sub-tasks or capabilities
 * @param {number} [options.confidence] - Analysis confidence score (0.0 to 1.0)
 * @param {Object} [options.metadata] - Optional metadata
 * @returns {Object} Standard Task Analysis Object
 */
export const createTaskAnalysis = ({
  category = DEFAULT_ANALYSIS_CONFIG.DEFAULT_CATEGORY,
  complexity = DEFAULT_ANALYSIS_CONFIG.DEFAULT_COMPLEXITY,
  executionMode = DEFAULT_ANALYSIS_CONFIG.DEFAULT_EXECUTION_MODE,
  dependencies = [],
  confidence = 1.0,
  metadata = {},
} = {}) => {
  return {
    id: crypto.randomUUID(),
    category: Object.values(TASK_CATEGORY).includes(category)
      ? category
      : DEFAULT_ANALYSIS_CONFIG.DEFAULT_CATEGORY,
    complexity: Object.values(TASK_COMPLEXITY).includes(complexity)
      ? complexity
      : DEFAULT_ANALYSIS_CONFIG.DEFAULT_COMPLEXITY,
    executionMode: Object.values(EXECUTION_MODE).includes(executionMode)
      ? executionMode
      : DEFAULT_ANALYSIS_CONFIG.DEFAULT_EXECUTION_MODE,
    dependencies: Array.isArray(dependencies) ? [...dependencies] : [],
    confidence: typeof confidence === 'number' ? Math.min(1.0, Math.max(0.0, confidence)) : 1.0,
    metadata: {
      analyzedAt: new Date().toISOString(),
      source: ANALYSIS_SOURCE.RULE,
      ...metadata,
    },
  };
};

export default {
  createTaskAnalysis,
};
