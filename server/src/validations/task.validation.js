import { z } from 'zod';

const baseTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(2, { message: 'Title must be at least 2 characters long' })
    .max(150, { message: 'Title cannot exceed 150 characters' }),
  description: z
    .string()
    .trim()
    .max(5000, { message: 'Description cannot exceed 5000 characters' })
    .optional(),
  priority: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(
      z.enum(['low', 'medium', 'high'], {
        invalid_type_error: 'Priority must be low, medium, or high',
      })
    )
    .optional(),
});

// For creating a task: base schema fields + required workspace
export const createTaskSchema = baseTaskSchema
  .extend({
    workspace: z
      .string({ required_error: 'Workspace is required' })
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid workspace ID format' }),
  })
  .strict();

// For updating a task: base schema fields made optional (workspace cannot be updated/migrated)
export const updateTaskSchema = baseTaskSchema.partial().strict();

// Generic ObjectId validation schema
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ID format' });

// Schema for validating task routes parameter (:taskId)
export const taskIdSchema = z
  .object({
    taskId: objectIdSchema,
  })
  .strict();
