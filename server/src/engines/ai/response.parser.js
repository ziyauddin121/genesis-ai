class ResponseParser {
  /**
   * Normalize provider raw response into standard AI Engine execution result
   */
  parse(rawResponse, providerInfo = {}) {
    if (!rawResponse) {
      return {
        content: '',
        provider: providerInfo.provider ?? 'unknown',
        model: providerInfo.model ?? 'unknown',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
        finishReason: null,
        metadata: {},
      };
    }

    return {
      content: this.#extractContent(rawResponse),
      provider: providerInfo.provider ?? rawResponse.provider ?? 'unknown',
      model: providerInfo.model ?? rawResponse.model ?? 'unknown',
      usage: this.#extractUsage(rawResponse),
      finishReason: this.#extractFinishReason(rawResponse),
      metadata: rawResponse.metadata ?? {},
    };
  }

  /**
   * Private Helper: Extract text content across Gemini, OpenAI, or direct outputs
   */
  #extractContent(rawResponse) {
    if (typeof rawResponse === 'string') {
      return rawResponse;
    }

    if (rawResponse.content !== undefined && rawResponse.content !== null) {
      return rawResponse.content;
    }

    if (rawResponse.choices?.[0]?.message?.content !== undefined) {
      return rawResponse.choices[0].message.content;
    }

    const geminiParts = rawResponse.candidates?.[0]?.content?.parts;
    if (Array.isArray(geminiParts)) {
      return geminiParts.map((part) => part.text ?? '').join('');
    }

    return '';
  }

  /**
   * Private Helper: Extract token usage metrics across providers
   */
  #extractUsage(rawResponse) {
    const usageObj = rawResponse.usage ?? rawResponse.usageMetadata ?? {};

    return {
      promptTokens:
        usageObj.promptTokens ??
        usageObj.prompt_tokens ??
        usageObj.promptTokenCount ??
        0,
      completionTokens:
        usageObj.completionTokens ??
        usageObj.completion_tokens ??
        usageObj.candidatesTokenCount ??
        0,
      totalTokens:
        usageObj.totalTokens ??
        usageObj.total_tokens ??
        usageObj.totalTokenCount ??
        0,
    };
  }

  /**
   * Private Helper: Extract finish reason (e.g. 'stop', 'length')
   */
  #extractFinishReason(rawResponse) {
    return (
      rawResponse.finishReason ??
      rawResponse.choices?.[0]?.finish_reason ??
      rawResponse.candidates?.[0]?.finishReason ??
      null
    );
  }
}

export default new ResponseParser();
