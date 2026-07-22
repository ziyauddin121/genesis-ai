class ContextManager {
  /**
   * Gather, sanitize, and format workspace and task context for LLM consumption
   */
  prepare(contextInput) {
    if (!contextInput) {
      return null;
    }

    if (typeof contextInput === 'string') {
      return contextInput.trim();
    }

    if (typeof contextInput === 'object') {
      const sanitized = { ...contextInput };

      // Redact sensitive security attributes
      delete sanitized.token;
      delete sanitized.password;
      delete sanitized.apiKey;
      delete sanitized.secret;
      delete sanitized.auth;

      return JSON.stringify(sanitized, null, 2);
    }

    return String(contextInput);
  }
}

export default new ContextManager();
