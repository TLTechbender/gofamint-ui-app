"use server";

import * as z from "zod";
import { registerSchema } from "@/schemas/registerSchema";

export const registerServerAction = async (
  values: z.infer<typeof registerSchema>
) => {
  try {
    // Use absolute URL for server-to-server communication
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Registration failed" };
    }

    return { success: data.message };
  } catch (error) {
    console.error("Server action error:", error);
    return { error: "Network error occurred" };
  }
};
