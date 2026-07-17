import { z } from 'zod';

export const baseWorkspaceSchema = z
  .object({
    name: z
      .string({ required_error: 'Workspace name is required' })
      .trim()
      .transform(value => value.replace(/\s+/g, ' '))
      .refine(value => value.length >= 2, { message: 'Workspace name must be at least 2 characters long' })
      .refine(value => value.length <= 50, { message: 'Workspace name cannot exceed 50 characters' }),
    description: z
      .string()
      .trim()
      .transform(value => value.replace(/\s+/g, ' '))
      .refine(value => value.length <= 200, { message: 'Description cannot exceed 200 characters' })
      .optional(),
    icon: z
      .string()
      .trim()
      .max(20, 'Icon cannot exceed 20 characters')
      .optional(),
    color: z
      .string()
      .trim()
      .max(20, 'Color cannot exceed 20 characters')
      .optional(),
  })
  .strict();

export const createWorkspaceSchema = baseWorkspaceSchema;

export const updateWorkspaceSchema = baseWorkspaceSchema.partial();
