const SENSITIVE_FIELDS = new Set([
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
]);

class ContextSanitizer {
  /**
   * Recursively sanitize input data by stripping sensitive security keys and guarding against circular loops
   */
  sanitize(data, visited = new WeakSet()) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // Guard against circular references
    if (visited.has(data)) {
      return '[Circular Reference]';
    }
    visited.add(data);

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitize(item, visited));
    }

    const sanitizedObj = {};
    for (const [key, value] of Object.entries(data)) {
      if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
        continue;
      }
      sanitizedObj[key] = this.sanitize(value, visited);
    }

    return sanitizedObj;
  }
}

export default new ContextSanitizer();
