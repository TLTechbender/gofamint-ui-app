import { z } from "zod";

export const createBlogSchema = z.object({
  sanityId: z.string().min(1, "Sanity ID is required"),
  sanitySlug: z.string().min(1, "Sanity slug is required"),
  authorId: z.string().uuid("Invalid author ID format"),
});
