import keywordMatcher from './keyword.matcher.js';
import complexityDetector from './complexity.detector.js';
import { TASK_COMPLEXITY } from './analyzer.constants.js';
import capabilityMatcher from '../../engines/capability/capability.matcher.js';

class TaskAnalyzer {
  /**
   * Analyze task input and resolve keywords, complexity, capability, planning, and approval requirements
   */
  async analyze(task) {
    const title = task?.title || '';
    const description = task?.description || '';
    const combinedText = `${title} ${description}`.trim();

    const keywords = keywordMatcher.match(combinedText);
    const { complexity } = complexityDetector.detect(combinedText, keywords);
    const { capability, score: capabilityScore } =
      capabilityMatcher.match(keywords);

    const requiresPlanning =
      complexity === TASK_COMPLEXITY.MEDIUM ||
      complexity === TASK_COMPLEXITY.HIGH;
    const requiresApproval = complexity === TASK_COMPLEXITY.HIGH;

    return {
      keywords,
      complexity,
      capability,
      capabilityScore,
      requiresPlanning,
      requiresApproval,
    };
  }
}

export default new TaskAnalyzer();
