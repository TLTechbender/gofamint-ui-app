
import { z } from 'zod';

export const suspendAuthorSchema = z.object({
  authorId: z
    .string("Author Must have a valid ID")
  
    .describe('ID of the author to suspend'),

  reason: z
    .string()
    .min(10, 'Suspension reason must be at least 10 characters')
    .max(500, 'Suspension reason must not exceed 500 characters')
    .trim()
    .describe('Reason for suspending the author'),

  duration: z
    .enum(['TEMPORARY', 'INDEFINITE'])
    .default('INDEFINITE')
    .describe('Whether suspension has a time limit'),

  suspendUntil: z
    .string()
    .datetime('Invalid date format. Use ISO 8601 format')
    .transform((val) => new Date(val))
    .optional()
    .describe('When the suspension should automatically lift (for TEMPORARY)'),
});

export type SuspendAuthorInput = z.infer<typeof suspendAuthorSchema>;