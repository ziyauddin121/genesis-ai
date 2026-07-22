const SENSITIVE_FIELDS = Object.freeze(
  new Set([
    'token',
    'password',
    'apikey',
    'secret',
    'auth',
    'authorization',
    'jwt',
    'accesstoken',
    'refreshtoken',
    'cookie',
    'credentials',
    'privatekey',
  ])
);

class ContextManager {
  /**
   * Main Entrypoint: Prepare, sanitize, summarize, and format workspace context
   */
  prepare(contextInput) {
    if (!contextInput) return null;

    try {
      const sanitized = this.#sanitize(contextInput);
      const summarized = this.#summarize(sanitized);
      return this.#format(summarized);
    } catch (error) {
      console.error('Context preparation error:', error);
      return null;
    }
  }

  /**
   * Private Helper: Recursively sanitize objects and arrays to strip sensitive keys
   */
  #sanitize(data, visited = new WeakSet()) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Guard against circular references
    if (visited.has(data)) {
      return '[Circular Reference]';
    }
    visited.add(data);

    if (Array.isArray(data)) {
      return data.map((item) => this.#sanitize(item, visited));
    }

    const sanitizedObj = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
        continue;
      }
      sanitizedObj[key] = this.#sanitize(value, visited);
    }

    return sanitizedObj;
  }

  /**
   * Private Helper: Summarize large arrays and context data for token efficiency
   */
  #summarize(data) {
    if (typeof data === 'string') {
      return { text: data };
    }

    if (typeof data !== 'object') {
      return { info: String(data) };
    }

    const summary = {};

    if (data.workspaceName || data.workspace) {
      summary.workspace = data.workspaceName || data.workspace;
    }

    if (Array.isArray(data.tasks)) {
      summary.totalTasks = data.tasks.length;
      summary.recentTask = data.tasks[data.tasks.length - 1]?.title || null;
    }

    if (Array.isArray(data.files)) {
      summary.totalFiles = data.files.length;
      summary.activeFiles = data.files.slice(0, 5);
    }

    // Include scalar primitives
    for (const [key, val] of Object.entries(data)) {
      if (['workspaceName', 'workspace', 'tasks', 'files'].includes(key)) {
        continue;
      }
      if (
        typeof val === 'string' ||
        typeof val === 'number' ||
        typeof val === 'boolean'
      ) {
        summary[key] = val;
      }
    }

    return Object.keys(summary).length > 0 ? summary : data;
  }

  /**
   * Private Helper: Format summarized context into clean Markdown text
   */
  #format(summary) {
    if (!summary) return null;

    if (summary.text) {
      return summary.text;
    }

    if (typeof summary !== 'object') {
      return String(summary);
    }

    const lines = [];
    for (const [key, val] of Object.entries(summary)) {
      if (val === null || val === undefined) continue;

      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());

      if (Array.isArray(val)) {
        lines.push(`- ${formattedKey}: ${val.join(', ')}`);
      } else if (typeof val === 'object') {
        lines.push(`- ${formattedKey}:\n${JSON.stringify(val, null, 2)}`);
      } else {
        lines.push(`- ${formattedKey}: ${val}`);
      }
    }

    return lines.length > 0 ? lines.join('\n') : JSON.stringify(summary, null, 2);
  }
}

export default new ContextManager();
