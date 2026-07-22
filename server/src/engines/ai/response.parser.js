class ResponseParser {
  /**
   * Normalize provider raw response into standard AI Engine execution result
   */
  parse(rawResponse, providerInfo = {}) {
    if (!rawResponse) {
      return {
        content: '',
        provider: providerInfo.provider || 'unknown',
        model: providerInfo.model || 'unknown',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    }

    // Standardized extraction if provider already formatted payload
    const content =
      rawResponse.content ||
      rawResponse.choices?.[0]?.message?.content ||
      rawResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
      (typeof rawResponse === 'string' ? rawResponse : '');

    const usage = {
      promptTokens:
        rawResponse.usage?.promptTokens ||
        rawResponse.usageMetadata?.promptTokenCount ||
        0,
      completionTokens:
        rawResponse.usage?.completionTokens ||
        rawResponse.usageMetadata?.candidatesTokenCount ||
        0,
      totalTokens:
        rawResponse.usage?.totalTokens ||
        rawResponse.usageMetadata?.totalTokenCount ||
        0,
    };

    return {
      content,
      provider: providerInfo.provider || rawResponse.provider || 'unknown',
      model: providerInfo.model || rawResponse.model || 'unknown',
      usage,
    };
  }
}

export default new ResponseParser();
