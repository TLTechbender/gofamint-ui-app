import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      if (isOnProfile) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isOnAuth && isLoggedIn) {
        // Redirect logged-in users away from auth pages
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Allow access to all other routes regardless of login status
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now (nha normal login I wan use abeg, I no get time to dey stress about google and apple for now)
} satisfies NextAuthConfig;
