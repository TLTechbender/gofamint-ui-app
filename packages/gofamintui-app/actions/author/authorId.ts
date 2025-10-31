"use server";

import { prisma } from "@/lib/prisma/prisma";
import { auth } from "@/auth";

interface GetAuthorIdResponse {
  success: boolean;
  data?: {
    authorId: string;
    userId: string;
  };
  error?: string;
}

export const getAuthorId = async (): Promise<GetAuthorIdResponse> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required - no valid session found",
      };
    }

    const author = await prisma.author.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!author) {
      return {
        success: false,
        error: "Author profile not found - user is not an author",
      };
    }

    return {
      success: true,
      data: {
        authorId: author.id,
        userId: author.userId,
      },
    };
  } catch (error) {
    console.error("Error fetching author ID:", error);
    return {
      success: false,
      error: "Failed to fetch author information",
    };
  }
};
