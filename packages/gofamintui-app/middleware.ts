export { auth as middleware } from "./auth";

export const config = {
  matcher: ["/profile/:path*", "/publishing/author/:path*", "/auth/:path*"],
};
