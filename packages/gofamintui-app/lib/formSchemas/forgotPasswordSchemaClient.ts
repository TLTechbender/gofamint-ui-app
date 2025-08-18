import { z } from "zod";

export const forgotPasswordSchemaClient = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordSchemaClientData = z.infer<typeof forgotPasswordSchemaClient>;
