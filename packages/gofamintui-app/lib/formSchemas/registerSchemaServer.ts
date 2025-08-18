import { z } from "zod";

export const registerSchemaServer = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  userName: z.string().min(2, "user name must be at least 4 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")

    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export type RegisterFormDataServer = z.infer<typeof registerSchemaServer>;
