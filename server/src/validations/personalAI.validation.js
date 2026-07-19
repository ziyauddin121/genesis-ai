import { z } from 'zod';

export const onboardPersonalAISchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'AI Name must be at least 2 characters long')
      .max(50, 'AI Name cannot exceed 50 characters')
      .optional(),
    personality: z
      .object({
        tone: z
          .enum(['professional', 'friendly', 'casual', 'creative'], {
            invalid_type_error: 'Tone must be professional, friendly, casual, or creative',
          })
          .optional(),
        responseStyle: z
          .enum(['concise', 'balanced', 'detailed'], {
            invalid_type_error: 'Response style must be concise, balanced, or detailed',
          })
          .optional(),
      })
      .strict()
      .optional(),
    language: z
      .enum(['english', 'hindi', 'hinglish'], {
        invalid_type_error: 'Language must be english, hindi, or hinglish',
      })
      .optional(),
    customInstructions: z
      .string()
      .trim()
      .max(1000, 'Custom instructions cannot exceed 1000 characters')
      .optional(),
  })
  .strict();

export const updatePersonalAISchema = onboardPersonalAISchema.partial();
