import contextSanitizer from './context/context.sanitizer.js';
import contextSummarizer from './context/context.summarizer.js';
import contextFormatter from './context/context.formatter.js';

class ContextManager {
  /**
   * Main Entrypoint: Orchestrate context sanitization, summarization, and formatting
   */
  prepare(contextInput) {
    if (!contextInput) return null;

    try {
      const sanitized = contextSanitizer.sanitize(contextInput);
      const summarized = contextSummarizer.summarize(sanitized);
      return contextFormatter.format(summarized);
    } catch (error) {
      throw error;
    }
  }
}

export default new ContextManager();
