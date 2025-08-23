import { z } from "zod";

const imageValidator = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 2 * 1024 * 1024, // 2MB in bytes
    {
      message: "Image file size must not exceed 2MB",
    }
  )
  .refine((file) => file.type.startsWith("image/"), {
    message: "File must be an image",
  })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Only JPEG, PNG, and WebP images are allowed"
  )
  .or(z.string().url().optional());

export const editAuthorProfilePictureSchema = z.object({
  profilePicture: imageValidator,
});

export type AuthorProfilePictureSchemaData = z.infer<
  typeof editAuthorProfilePictureSchema
>;

export const editAuthorBioSchema = z.object({
  bio: z.string().min(10, "A short description of your self").trim(),
});

const SocialMediaSchema = z.object({
  platform: z.enum([
    "twitter",
    "linkedin",
    "instagram",
    "facebook",
    "github",
    "website",
  ]),
  url: z.string().url("Please provide a valid URL").trim(),
  handle: z.string().trim().optional().or(z.literal("")), // Allow empty string or undefined
});
//I've run out of names ooo, abeg no vex
export const editAuthorDetailsBarImagesSchema = editAuthorBioSchema.extend({
  socialMedia: z.array(SocialMediaSchema).optional(), // allow multiple socials
});

export type AuthorDetailsBarImagesSchemaData = z.infer<
  typeof editAuthorDetailsBarImagesSchema
>;
