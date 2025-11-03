
import { refreshTokenSchema } from "../../schemas/auth/refreshTokenSchema";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { Response,Request } from "express";
import { formatZodErrors } from "../../utils/formatZodErrors";
import { rotateRefreshToken, verifyRefreshToken } from "../../utils/tokens/tokenService";
import { AppResponse } from "../../utils/appResponse";
export const refreshAccessToken = catchAsync(
  async (req: Request, res: Response) => {
  

    const validationResult = refreshTokenSchema.safeParse(req.cookies);
    if (!validationResult.success) {
      const formattedErrors = formatZodErrors(validationResult.error);
      throw new AppError("Validation failed", 400, formattedErrors);
    }

    const { refreshToken} = validationResult.data;


    if (!refreshToken) {
      throw new AppError('Refresh token not found', 401);
    }


    const user = await verifyRefreshToken(refreshToken);

    if (!user) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

   
    const sessionData = {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.socket.remoteAddress,
    };

    const newTokens = await rotateRefreshToken(
      refreshToken,
      user.userId,
      sessionData
    );

  
    res.cookie('accessToken', newTokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Set new refresh token cookie
    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // Changed from /api/auth/refresh to / for consistency
    });

    return AppResponse(
      res,
      200,
        null,
      'Tokens refreshed successfully'
    );
  }
);