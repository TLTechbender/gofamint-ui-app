// schemas/resetPasswordSchema.ts
import { z } from "zod";

export const resetPasswordSchemaServer = z.object({
  token: z.string().min(4),
  password: z.string().min(8),
  email: z.string().email(),
});

export type ResetPasswordSchemaDataServer = z.infer<
  typeof resetPasswordSchemaServer
>;
