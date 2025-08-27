"use server";

import { auth } from "@/auth";
//walahi, I don't think I be doing this optimally here sha, subject to review in the future
import { prisma } from "@/lib/prisma/prisma";

import { unstable_noStore } from "next/cache";
type ActionResponse = {
  status: number;
  success: boolean;
  message: string;
  error?: string | string[];

  
};

export async function getBlogInfoForUpdateBlogPage(
  formData: FormData
): Promise<ActionResponse> {
   unstable_noStore(); 
  try {
    const sanitySlug = formData.get("sanitySlug") as string;
    const session = await auth();
    if (!sanitySlug) {
      return {
        status: 400,
        success: false,
        message: "Missing sanitySlug parameter",
        error: "sanitySlug is required",
      };
    }

    if (!session) {
      return {
        status: 401,
        success: false,
        message: "Unauthorized",
        error: "User not authorized",
      };
    }

    const isThisUserAnAuthorInTheFirstPlace = await prisma.author.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!isThisUserAnAuthorInTheFirstPlace) {
      return {
        status: 401,
        success: false,
        message: "Unauthorized",
        error: "User not an author in the first place dawg",
      };
    }

    const blogDetails = await prisma.blog.findUnique({
      where: {
        sanitySlug: sanitySlug,
        authorId: isThisUserAnAuthorInTheFirstPlace.id,
      },
    });

    if (!blogDetails) {
      return {
        status: 404,
        success: false,
        message: "Blog post not found",
        error:
          "The specified blog post belonging to this author does not exist",
      };
    }

    //now get the one from sanity

   

    return {
      status: 200,
      success: true,
      message: "blog Content retrieved successfully",
    
    };
  } catch (error) {
    console.error("Error retrieving blog Content:", error);

    return {
      status: 500,
      success: false,
      message: "Failed to retrive blog Details",
      error: "An unexpected error occurred",
    };
  }
}
