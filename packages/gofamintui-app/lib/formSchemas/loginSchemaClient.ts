
import { z } from "zod";

export const loginSchemaClient = z.object({
  emailOrUserName: z.string().min(3,"Please enter a valid email address or user name"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginSchemaClientData = z.infer<typeof loginSchemaClient>;
