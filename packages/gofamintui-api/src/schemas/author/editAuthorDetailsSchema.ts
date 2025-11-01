import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

const phoneValidator = z
  .string()
  .refine(
    (phone) => isValidPhoneNumber(phone, "NG"),
    {
      message: "Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)",
    }
  )
  .optional();

const bioValidator = z
  .string()
  .min(10, "Bio must be at least 10 characters")
  .trim()
  .optional();

const imageValidator = z
  .instanceof(File)
  .refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "Image file size must not exceed 2MB",
  })
  .refine((file) => file.type.startsWith("image/"), {
    message: "File must be an image",
  })
  .refine(
    (file) => ["image/jpeg", "image/png"].includes(file.type),
    "Only JPEG and PNG images are allowed"
  )
 
  .optional();

const socialSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.url("Must be a valid URL"),
  handle: z.string().optional(),
});


export const editAuthorProfileSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 letters").trim(),
  lastName: z.string().min(3, "Last name must be at least 3 letters").trim(),
  phoneNumber: phoneValidator,
  bio: bioValidator,
  profilePicture: imageValidator,
  socialMedia: z.array(socialSchema).optional(),
});

export type EditAuthorProfileSchemaData = z.infer<typeof editAuthorProfileSchema>;