import { signinSchema } from "../../schemas/auth/signinSchema";
import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { formatZodErrors } from "../../utils/formatZodErrors";
import { AppError } from "../../utils/appError";
import { prisma } from "../../database/prisma";
import { verifyPasswordSignature } from "../../utils/helpers";
import { generateTokens } from "../../utils/tokens/tokenService";
import { AppResponse } from "../../utils/appResponse";
export const signin = catchAsync(async (req: Request, res: Response) => {
  const validationResult = signinSchema.safeParse(req.body);

  if (!validationResult.success) {
    const formattedErrors = formatZodErrors(validationResult.error);
    throw new AppError('Validation failed', 400, formattedErrors);
  }

  const { username, password } = validationResult.data;

 
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ userName: username }, { email: username }],
      isDeleted: false, 
    },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check if user uses local auth (not OAuth)
  if (user.authProvider !== 'LOCAL') {
    throw new AppError(
      `This account uses ${user.authProvider} authentication. Please sign in with ${user.authProvider}.`,
      400
    );
  }

  // Verify password
  //at this point the password can never be null because only local auth users reach here
  const userPasword = user!.password;
  const isValidPassword = await verifyPasswordSignature(password, userPasword!);

  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isVerified) {
    throw new AppError('Please verify your email before signing in', 403);
  }


  const sessionData = {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip || req.socket.remoteAddress,
  };

   const tokens = await generateTokens(user.id, sessionData);

   res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,   
    secure: true,       
    sameSite: 'strict', 
    maxAge: 15 * 60 * 1000,
    path: '/',
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh', 
  });


 

  return AppResponse(
    res,
    200,
    {
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
    'Sign in successful'
  );
});