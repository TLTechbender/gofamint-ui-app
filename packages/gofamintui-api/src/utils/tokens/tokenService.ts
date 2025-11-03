import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { prisma } from '../../database/prisma';
import { AppError } from '../appError';
import crypto from 'crypto';
import { env } from '../../config/enviroment';

interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  tokenId?: string;
}

interface SessionData {
  userAgent?: string;
  ipAddress?: string;
}

export async function generateTokens(
  userId: string,
  sessionData: SessionData = {}
): Promise<{ accessToken: string; refreshToken: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, isDeleted: true },
  });

  if (!user || user.isDeleted) {
    throw new AppError('User not found', 404);
  }

  // Create session
  const session = await prisma.session.create({
    data: {
      userId,
      userAgent: sessionData.userAgent,
      ipAddress: sessionData.ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Generate access token (simple payload, no tokenId)
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRY } as SignOptions
  );

  // Generate refresh token with unique tokenId
  const refreshTokenId = crypto.randomBytes(40).toString('hex');
  
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, tokenId: refreshTokenId },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRY } as SignOptions
  );

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      sessionId: session.id,
      token: refreshTokenId, // Store the tokenId, not the JWT
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    // Decode and verify the JWT
    const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET) as TokenPayload;

    // Check if token exists in database and is not revoked
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: decoded.tokenId!,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        session: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                isDeleted: true,
              },
            },
          },
        },
      },
    });

    if (!storedToken) {
      return null;
    }

    if (storedToken.session.user.isDeleted) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    return null;
  }
}

export async function rotateRefreshToken(
  oldRefreshToken: string,
  userId: string,
  sessionData: SessionData = {}
): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    // Extract tokenId from old refresh token
    const decoded = jwt.verify(oldRefreshToken, env.REFRESH_TOKEN_SECRET) as TokenPayload;
    
    // Revoke old refresh token
    await prisma.refreshToken.updateMany({
      where: {
        token: decoded.tokenId!,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });
  } catch (error) {
    // If verification fails, still generate new tokens
    console.error('Error revoking old token:', error);
  }

  // Generate new tokens with existing or new session
  return generateTokens(userId, sessionData);
}

export async function revokeRefreshToken(token: string): Promise<void> {
  try {
    const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET) as TokenPayload;

    await prisma.refreshToken.updateMany({
      where: { token: decoded.tokenId! },
      data: { isRevoked: true },
    });
  } catch (error) {
    console.error('Error revoking token:', error);
  }
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: {
      session: { userId },
      isRevoked: false,
    },
    data: { isRevoked: true },
  });
}