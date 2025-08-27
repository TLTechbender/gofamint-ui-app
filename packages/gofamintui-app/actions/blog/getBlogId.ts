"use server";
//walahi, I don't think I be doing this optimally here sha, subject to review in the future
import { prisma } from "@/lib/prisma/prisma";
type ActionResponse = {
  status: number;
  success: boolean;
  message: string;
  error?: string | string[];

  blogId?: string | null;
};

export async function getBlogId(formData: FormData): Promise<ActionResponse> {
  try {
    const sanitySlug = formData.get("sanitySlug") as string;

    if (!sanitySlug) {
      return {
        status: 400,
        success: false,
        message: "Missing sanitySlug parameter",
        error: "sanitySlug is required",
      };
    }

    const blogDetails = await prisma.blog.findUnique({
      where: {
        sanitySlug: sanitySlug,
      },
    });

    if (!blogDetails) {
      return {
        status: 404,
        success: false,
        message: "Blog post not found",
        error: "The specified blog post does not exist",
      };
    }

    return {
      status: 200,
      success: true,
      message: "blog id retrieved successfully",
      blogId: blogDetails.id,
    };
  } catch (error) {
    console.error("Error retrieving blog id:", error);

    return {
      status: 500,
      success: false,
      message: "Failed to retrive blog id",
      error: "An unexpected error occurred",
    };
  }
}
