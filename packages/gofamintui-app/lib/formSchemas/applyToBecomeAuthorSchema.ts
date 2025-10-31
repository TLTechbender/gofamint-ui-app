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
  );
export const applyToBecomeAuthorSchema = z.object({
  bio: z.string().min(10, "A short description of your self").trim(),
  profilePicture: imageValidator,
});

export type ApplyToBecomeAuthorSchemaData = z.infer<
  typeof applyToBecomeAuthorSchema
>;
