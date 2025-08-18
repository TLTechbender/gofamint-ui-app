// schemas/resetPasswordSchema.ts
import { z } from "zod";

export const resetPasswordSchemaServer = z.object({
  token: z.string().min(8),
  password: z.string().min(8),
  userId: z.string(),
});

export type ResetPasswordSchemaDataServer = z.infer<
  typeof resetPasswordSchemaServer
>;
