import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isOnProfile = nextUrl.pathname.startsWith("/profile");
  const isOnAuth = nextUrl.pathname.startsWith("/auth");
  const isOnAuthor = nextUrl.pathname.startsWith("/publishing/author");

  const isOnProtectedRoute = isOnProfile || isOnAuthor;

  // Protect routes that require authentication
  if (isOnProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return Response.redirect(
      new URL(`/auth/signin?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // Redirect authenticated users away from auth pages
  if (isOnAuth && isLoggedIn) {
    const callbackUrl = nextUrl.searchParams.get("callbackUrl");

    if (callbackUrl) {
      try {
        const decodedUrl = decodeURIComponent(callbackUrl);
        const redirectUrl = new URL(decodedUrl, nextUrl.origin);

        // Security check: ensure same origin
        if (redirectUrl.origin === nextUrl.origin) {
          return Response.redirect(redirectUrl);
        }
      } catch (e) {
        // Invalid URL, fall back to default
      }
    }

    // Default redirect for authenticated users on auth pages
    return Response.redirect(new URL("/profile", nextUrl));
  }

  return null; // Allow access
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/"],
};
