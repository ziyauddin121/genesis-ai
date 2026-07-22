import capabilityRegistry from './capability.registry.js';
import { CAPABILITY_IDS, CAPABILITY_STATUS } from './capability.constants.js';

class CapabilityMatcher {
  /**
   * Match extracted keywords against active registered capabilities and compute relevance scores.
   * Returns the complete capability object and relevance score.
   */
  match(keywords = []) {
    const fallbackCapability =
      capabilityRegistry.find(
        (item) => item.id === CAPABILITY_IDS.GENERAL_ASSISTANT
      ) || capabilityRegistry[0];

    if (!Array.isArray(keywords) || keywords.length === 0) {
      return {
        capability: fallbackCapability,
        score: 0,
      };
    }

    const keywordSet = new Set(keywords.map((k) => k.toLowerCase()));
    let bestCapability = null;
    let highestScore = 0;
    let highestPriority = -1;

    for (const item of capabilityRegistry) {
      if (item.status !== CAPABILITY_STATUS.ACTIVE) {
        continue;
      }

      let score = 0;
      for (const kw of item.keywords) {
        if (keywordSet.has(kw.toLowerCase())) {
          score += 1;
        }
      }

      const itemPriority = item.priority || 0;

      if (
        score > highestScore ||
        (score === highestScore && score > 0 && itemPriority > highestPriority)
      ) {
        highestScore = score;
        highestPriority = itemPriority;
        bestCapability = item;
      }
    }

    return {
      capability: bestCapability || fallbackCapability,
      score: highestScore,
    };
  }
}

export default new CapabilityMatcher();
