"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { getUserByEmail, signIn } from "@/auth";
import { loginSchema } from "@/schemas/loginSchema";

export const login = async (
  values: z.infer<typeof loginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.isActive) {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

      const response = await fetch(`${baseUrl}/api/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: existingUser.email }),
      });

      if (!response.ok) {
        console.error("Failed to send verification email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
    }

    return {
      error:
        "Your account has not yet been verified. Please check your email and verify your account before signing in.",
    };
  }

  const DEFAULT_LOGIN_REDIRECT = "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });

    // If we reach here, the signIn was successful but didn't redirect
    // This shouldn't happen normally, but we'll handle it gracefully
    return { success: "Login successful!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        case "CallbackRouteError":
          return { error: "Authentication callback failed!" };
        default:
          return { error: "Something went wrong during authentication!" };
      }
    }

    // If it's a redirect error (which is expected behavior), re-throw it
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Unexpected login error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
};

//  action for Google OAuth
export const signInWithGoogle = async (callbackUrl?: string | null) => {
  const DEFAULT_LOGIN_REDIRECT = "/dashboard";

  try {
    await signIn("google", {
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Handle known error types
      const errorType = error.type as string;

      switch (errorType) {
        case "OAuthAccountNotLinked":
          return { error: "Email already in use with different provider!" };
        case "OAuthCreateAccount":
          return { error: "Error creating OAuth account!" };
        case "EmailCreateAccount":
          return { error: "Error creating account with email!" };
        case "Callback":
          return { error: "Authentication callback failed!" };
        case "OAuthCallbackError":
          return { error: "OAuth callback error!" };
        case "SessionRequired":
          return { error: "Session required!" };
        default:
          return { error: `Authentication error: ${errorType}` };
      }
    }

    // Re-throw redirect errors as they're expected
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Unexpected Google sign-in error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
};
