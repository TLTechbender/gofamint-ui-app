"use server";

import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function resetPasswordAction(
  values: z.infer<typeof resetPasswordSchema>
) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || "Password reset failed",
        success: false,
      };
    }

    return { success: data.message };
  } catch (error) {
    console.error("Password reset action error:", error);
    return {
      error: "Something went wrong. Please try again.",
      success: false,
    };
  }
}
