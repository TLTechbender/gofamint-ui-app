"use server";
import { sendResetPasswordEmail } from "@/lib/email/emailHandler";

import { ForgotPasswordActionState } from "@/lib/formActionStates/forgotPasswordActionState";
import { forgotPasswordSchemaServer } from "@/lib/formSchemas/forgotPasswordSchemaServer";
import { prisma } from "@/lib/prisma/prisma";
import generateToken from "@/lib/tokenHandler/generateToken";

export default async function forgotPassword(
  formData: FormData
): Promise<ForgotPasswordActionState> {
  const email = formData.get("email");
  console.log(email);
  const result = forgotPasswordSchemaServer.safeParse({ email });
  console.log(result);
 
  if (!result.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid Credentials Input",
    };
  }

  const safeEmail = result.data.email;
  const userExists = await prisma.user.findUnique({
    where: { email: safeEmail },
  });

  if (!userExists) {
    return {
      success: false,
      status: 404,
      message: "No user found with this email",
    };
  }

  if (userExists.isVerified) {
    const verificationToken = generateToken(userExists.id, "reset-password");
    await sendResetPasswordEmail(
      userExists.email,
      verificationToken,
      userExists.firstName
    );
  }

  return {
    success: true,
    status: 200,
    message: "Reset password message sent",
  };
}
