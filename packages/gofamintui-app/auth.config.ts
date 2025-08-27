import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";


//Omo,next.js wan use learning wound me
// This file MUST be edge-safe - NO database calls, NO Node.js APIs
export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
    // Minimal credentials setup - actual authorization logic goes in auth.ts
    Credentials({
      name: "credentials",
      credentials: {
        emailOrUsername: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter email or username",
        },
        password: { label: "Password", type: "password" },
      },
      // This will be overridden in auth.ts
      authorize: async () => null,
    }),
  ],
} satisfies NextAuthConfig;
