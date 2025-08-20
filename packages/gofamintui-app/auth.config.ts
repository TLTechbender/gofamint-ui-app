import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");
      // Add more protected routes here as needed
      const isOnAuthor = nextUrl.pathname.startsWith("/author"); // Your todo item

      // Check if user is trying to access protected routes
      const isOnProtectedRoute = isOnProfile || isOnAuthor;

      if (isOnProtectedRoute) {
        if (isLoggedIn) return true;
        
        // Create callback URL with the current page they were trying to access
        const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
        const loginUrl = new URL("/auth/signin", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", callbackUrl);
        
        // Redirect to login with callback URL
        return Response.redirect(loginUrl);
      } 
      else if (isOnAuth && isLoggedIn) {
        // Check if there's a callback URL to redirect to after login
        const callbackUrl = nextUrl.searchParams.get("callbackUrl");
        
        if (callbackUrl) {
          try {
            // Validate and decode the callback URL
            const decodedUrl = decodeURIComponent(callbackUrl);
            const redirectUrl = new URL(decodedUrl, nextUrl.origin);
            
            // Security check: ensure it's the same origin
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

      // Allow access to all other routes regardless of login status
      return true;
    },
    
    // Add this redirect callback to handle post-login redirects
    async redirect({ url, baseUrl }) {
      // If the URL contains a callbackUrl parameter, use it
      try {
        const urlObj = new URL(url);
        const callbackUrl = urlObj.searchParams.get('callbackUrl');
        
        if (callbackUrl) {
          const decodedCallback = decodeURIComponent(callbackUrl);
          const callbackUrlObj = new URL(decodedCallback, baseUrl);
          
          // Security: only allow same-origin redirects
          if (callbackUrlObj.origin === baseUrl) {
            return callbackUrlObj.href;
          }
        }
      } catch (e) {
        // Invalid URL, continue with default logic
      }

      // Handle relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Handle same-origin URLs
      if (new URL(url).origin === baseUrl) return url;
      
      // Default redirect after successful login
      return `${baseUrl}/profile`;
    },
  },
  providers: [],
} satisfies NextAuthConfig;