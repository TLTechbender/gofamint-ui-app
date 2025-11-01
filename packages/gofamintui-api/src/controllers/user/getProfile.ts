import { Response, Request } from "express";
import { prisma } from "../../database/prisma";
import { AppError } from "../../utils/appError";
import { AppResponse } from "../../utils/appResponse";
import { catchAsync } from "../../utils/catchAsync";
import { logger } from "../../utils/logger";
import { AuthRequest } from "../../common/constants";
import { getPublicUserProfileSchema } from "../../schemas/user/getPublicUserProfileSchema";
import { formatZodErrors } from "../../utils/formatZodErrors";

interface UserProfile {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  bio: string | null;
  authProvider: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    status: string;
    authorBio: string | null;
    profilePic: string | null;
    appliedAt: Date;
    approvedAt: Date | null;
    rejectedAt: Date | null;
    rejectionReason: string | null;
    isSuspended: boolean;
    socials: {
      id: string;
      platform: string;
      url: string;
      handle: string | null;
    }[];
  } | null;
  stats: {
    totalComments: number;
    totalBlogLikes: number;
    totalCommentLikes: number;
    totalBlogsRead: number;
  };
}

export const getUserProfile = catchAsync(
  async (req: AuthRequest, res: Response) => {
   
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }


    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        bio: true,
        authProvider: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        author: {
          select: {
            id: true,
            status: true,
            authorBio: true,
            profilePic: true,
            appliedAt: true,
            approvedAt: true,
            rejectedAt: true,
            rejectionReason: true,
            isSuspended: true,
            isDeleted: true,
            socials: {
              select: {
                id: true,
                platform: true,
                url: true,
                handle: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
        _count: {
          select: {
            comments: {
              where: {
                isDeleted: false,
              },
            },
            blogLikes: true,
            commentLikes: true,
            blogReads: true,
          },
        },
      },
    });

    if (!user || user.isDeleted) {
      logger.warn("Profile requested for non-existent/deleted user", {
        userId,
      });
      throw new AppError("User account not found", 404);
    }

  
    const authorData =
      user.author && !user.author.isDeleted ? user.author : null;

  
    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      authProvider: user.authProvider,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      author: authorData
        ? {
            id: authorData.id,
            status: authorData.status,
            authorBio: authorData.authorBio,
            profilePic: authorData.profilePic,
            appliedAt: authorData.appliedAt,
            approvedAt: authorData.approvedAt,
            rejectedAt: authorData.rejectedAt,
            rejectionReason: authorData.rejectionReason,
            isSuspended: authorData.isSuspended,
            socials: authorData.socials,
          }
        : null,
      stats: {
        totalComments: user._count.comments,
        totalBlogLikes: user._count.blogLikes,
        totalCommentLikes: user._count.commentLikes,
        totalBlogsRead: user._count.blogReads,
      },
    };

    logger.info("User profile fetched successfully", {
      userId,
      isAuthor: !!authorData,
    });

    return AppResponse(res, 200, profile, "Profile retrieved successfully");
  }
);



interface PublicUserProfile {
  userName: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  bio:string | null;
}

export const getPublicUserProfile = catchAsync(
  async (req: Request, res: Response) => {

    const validationResult = getPublicUserProfileSchema.safeParse({
      userName: req.params.userName,
    });

    if (!validationResult.success) {
      const formattedErrors = formatZodErrors(validationResult.error);
      throw new AppError("Validation failed", 400, formattedErrors);
    }

    const { userName } = validationResult.data;

  
    const user = await prisma.user.findUnique({
      where: { userName },
      select: {
        userName: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        isDeleted: true,
        bio: true,
      },
    });

    if (!user || user.isDeleted) {
      logger.warn("Public profile requested for non-existent user", {
        userName,
      });
      throw new AppError("User not found", 404);
    }

   
    const publicProfile: PublicUserProfile = {
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      bio: user.bio,
    };

    logger.info("Public user profile fetched successfully", {
      userName,
    });

    return AppResponse(
      res,
      200,
      publicProfile,
      "Public profile retrieved successfully"
    );
  }
);