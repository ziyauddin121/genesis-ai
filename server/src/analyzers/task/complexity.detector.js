import {
  TASK_COMPLEXITY,
  ANALYZER_DEFAULTS,
  COMPLEXITY_KEYWORDS,
} from './analyzer.constants.js';

class ComplexityDetector {
  /**
   * Determine task complexity based on word count, keyword density, and feature triggers
   */
  detect(taskDescription = '', keywords = []) {
    const wordCount = taskDescription.trim()
      ? taskDescription.trim().split(/\s+/).length
      : 0;

    const lowerText = taskDescription.toLowerCase();

    const hasHighKeyword = COMPLEXITY_KEYWORDS.HIGH.some((kw) =>
      lowerText.includes(kw)
    );
    const hasMediumKeyword = COMPLEXITY_KEYWORDS.MEDIUM.some((kw) =>
      lowerText.includes(kw)
    );

    if (
      wordCount >= ANALYZER_DEFAULTS.MIN_HIGH_COMPLEXITY_WORDS ||
      hasHighKeyword ||
      keywords.length >= 6
    ) {
      return { complexity: TASK_COMPLEXITY.HIGH };
    }

    if (
      wordCount >= ANALYZER_DEFAULTS.MIN_MEDIUM_COMPLEXITY_WORDS ||
      hasMediumKeyword ||
      keywords.length >= 3
    ) {
      return { complexity: TASK_COMPLEXITY.MEDIUM };
    }

    return { complexity: TASK_COMPLEXITY.LOW };
  }
}

export default new ComplexityDetector();
