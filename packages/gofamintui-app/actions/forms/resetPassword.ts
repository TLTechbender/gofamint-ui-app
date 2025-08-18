import { ResetPasswordActionState } from "@/lib/formActionStates/resetPasswordActionState";
import { prisma } from "@/lib/prisma/prisma";
import { resetPasswordSchemaServer } from "@/lib/formSchemas/resetPasswordSchemaServer";
import verifyToken from "@/lib/tokenHandler/verifyToken";
import bcrypt from "bcrypt";

export default async function resetPassword(
  initialState: ResetPasswordActionState,
  formData: FormData
): Promise<ResetPasswordActionState> {
  try {
    const rawData = {
      token: formData.get("token") as string,
      password: formData.get("password") as string,
      userId: formData.get("userId") as string,
    };

    const result = resetPasswordSchemaServer.safeParse(rawData);
    if (!result.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid input. Please check your credentials.",
      };
    }

    const { token, password, userId } = result.data;

    const verified = verifyToken(userId, "reset-password", token);

    if (!verified) {
      return {
        success: false,
        status: 404,
        message: "Invalid or expired reset token.",
      };
    }


    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: userId },
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
