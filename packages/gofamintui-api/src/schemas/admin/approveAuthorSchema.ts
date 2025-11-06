
import { z } from 'zod';

export const approveAuthorSchema = z.object({
  authorId: z
 
    .string('Author ID must be a valid UUID')
    .describe('ID of the author to approve'),

  notes: z
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .trim()
    .optional()
    .describe('Optional notes about the approval decision'),
});

export type ApproveAuthorInput = z.infer<typeof approveAuthorSchema>;