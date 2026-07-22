const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'up',
  'about',
  'into',
  'over',
  'after',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'should',
  'can',
  'could',
  'i',
  'you',
  'he',
  'she',
  'it',
  'we',
  'they',
  'this',
  'that',
  'these',
  'those',
  'my',
  'your',
  'his',
  'her',
  'its',
  'our',
  'their',
  'using',
  'please',
  'need',
  'want',
  'make',
]);

class KeywordMatcher {
  /**
   * Extract key technical terms and action keywords from task description
   * Returns array of unique matched keywords
   */
  match(taskDescription = '') {
    if (!taskDescription || typeof taskDescription !== 'string') {
      return [];
    }

    // Normalize text and split into words
    const cleanedText = taskDescription
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ');

    const tokens = cleanedText.split(/\s+/).filter(Boolean);

    const keywords = tokens.filter(
      (word) => word.length > 1 && !STOP_WORDS.has(word)
    );

    return [...new Set(keywords)];
  }
}

export default new KeywordMatcher();
