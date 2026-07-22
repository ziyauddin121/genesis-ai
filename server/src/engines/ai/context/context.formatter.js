class ContextFormatter {
  /**
   * Format summarized context object into clean, human-readable Markdown text
   */
  format(summary) {
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

export default new ContextFormatter();
