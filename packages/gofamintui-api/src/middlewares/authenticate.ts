import { Response, NextFunction, Request } from 'express';
import { AppError } from '../utils/appError';
import { prisma } from '../database/prisma';
import { verifyAccessToken } from '../utils/tokens/tokenService';
import { catchAsync } from '../utils/catchAsync';
import { AuthRequest } from '../common/constants';

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  if (req.body?.token) {
    return req.body.token;
  }

  return null;
}

async function requireAuthHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const accessToken = extractToken(req);

  if (!accessToken) {
    throw new AppError('No access token provided', 401);
  }

  const payload = verifyAccessToken(accessToken);

  if (!payload) {
    throw new AppError('Invalid or expired access token', 401);
  }
//attach everything I need to the request object man, nha just to plug and play my nigga
  const userDetails = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      author: {
        where: {
          isDeleted: false,
          isSuspended: false,
        }
      },
      admin: {
        where: {
          isDeleted: false,
          isActive: true,
          isSuspended: false,
        }
      }
    }
  });

  if (!userDetails) {
    throw new AppError('User not found', 401);
  }

  if (userDetails.isDeleted) {
    throw new AppError('User does not exist', 401);
  }

  const authReq = req as AuthRequest;
  authReq.user = userDetails;
  authReq.author = userDetails.author || null;
  authReq.admin = userDetails.admin || null;
  authReq.isAuthor = !!userDetails.author;
  authReq.isAdmin = !!userDetails.admin;
  next();
}

export const requireAuth = catchAsync(requireAuthHandler);