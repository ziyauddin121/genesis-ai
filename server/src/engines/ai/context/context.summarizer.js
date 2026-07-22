class ContextSummarizer {
  /**
   * Summarize context payload for token efficiency and clean prompt consumption
   */
  summarize(data) {
    if (typeof data === 'string') {
      return { text: data };
    }

    if (typeof data !== 'object' || data === null) {
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
}

export default new ContextSummarizer();
