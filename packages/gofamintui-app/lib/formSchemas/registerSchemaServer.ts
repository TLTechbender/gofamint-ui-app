import { z } from "zod";

export const registerSchemaServer = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .trim(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").trim(),
  email: z.string().email("Please enter a valid email address").trim(),
  phoneNumber: z
    .string()
    .trim()
    .refine(
      (phone) => {
        // Remove all spaces and hyphens for validation
        const cleaned = phone.replace(/[\s-]/g, "");

        // Local format: starts with 0, followed by specific prefixes, total 11 digits
        const localPattern = /^0[789][01]\d{8}$/;

        // International format: +234 followed by network code and 8 digits
        const intlPattern = /^\+234[789][01]\d{8}$/;

        return localPattern.test(cleaned) || intlPattern.test(cleaned);
      },
      {
        message:
          "Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)",
      }
    ),
  userName: z.string().min(2, "user name must be at least 4 characters").trim(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")

    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export type RegisterFormDataServer = z.infer<typeof registerSchemaServer>;
