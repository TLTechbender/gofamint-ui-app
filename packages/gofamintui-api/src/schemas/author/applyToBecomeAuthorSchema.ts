import { z } from "zod";



const socialSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.url("Must be a valid URL"),
  handle: z.string().optional(),
});

const imageValidator = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 2 * 1024 * 1024, 
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
  );
export const applyToBecomeAuthorSchema = z.object({
  bio: z.string().min(10, "A short description of your self").trim(),
  profilePicture: imageValidator,
    socials: z.array(socialSchema).max(5, "Maximum 5 social links allowed").optional(),
});

export type ApplyToBecomeAuthorSchemaData = z.infer<
  typeof applyToBecomeAuthorSchema
>;
