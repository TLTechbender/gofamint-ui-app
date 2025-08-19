"use server";
import { ResetPasswordActionState } from "@/lib/formActionStates/resetPasswordActionState";
import { prisma } from "@/lib/prisma/prisma";
import { resetPasswordSchemaServer } from "@/lib/formSchemas/resetPasswordSchemaServer";
import verifyToken from "@/lib/tokenHandler/verifyToken";
import bcrypt from "bcrypt";

export default async function resetPassword(
  formData: FormData
): Promise<ResetPasswordActionState> {
  try {
    const rawData = {
      token: formData.get("token") as string,
      password: formData.get("password") as string,
      email: formData.get("email") as string,
    };

    const result = resetPasswordSchemaServer.safeParse(rawData);
    console.log(result.error)
    if (!result.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid input. Please check your credentials.",
      };
    }

    const { token, password, email } = result.data;

    const isExistingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!isExistingUser) {
      return {
        success: false,
        status: 404,
        message: "User does not exist",
      };
    }

    if (!isExistingUser.isVerified) {
      return {
        success: false,
        status: 404,
        message: "Account has not been verified",
      };
    }

    const verifiedToken = verifyToken(
      isExistingUser.id,
      "reset-password",
      token
    );

    if (!verifiedToken) {
      return {
        success: false,
        status: 404,
        message: "Invalid or expired reset token.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email: isExistingUser.email },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      status: 200,
      message: "Password has been reset successfully.",
    };
  } catch (err) {
    console.error("Reset password error:", err);
    return {
      success: false,
      status: 500,
      message: "Something went wrong. Please try again later.",
    };
  }
}
