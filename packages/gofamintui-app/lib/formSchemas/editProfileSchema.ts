import { z } from "zod";

export const editProfileSchema = z.object({
  firstName: z.string().min(3, "first name must be at least 3 letters"),
  lastName: z.string().min(3, "last name must be at least 3 letters"),

  phoneNumber: z.string().refine(
    (phone) => {
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
  ).optional(),
  bio: z.string().optional(),
});

export type EditProfileSchemaData = z.infer<typeof editProfileSchema>;
