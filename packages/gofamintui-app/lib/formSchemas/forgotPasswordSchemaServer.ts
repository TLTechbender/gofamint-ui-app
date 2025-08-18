import { z } from "zod";

export const forgotPasswordSchemaServer = z.object({
  email: z.string().email(),
});

export type ForgotPasswordSchemaServer = z.infer<typeof forgotPasswordSchemaServer>;
