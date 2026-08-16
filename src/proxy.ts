import { NextRequest, NextResponse } from "next/server";

/**
 * GB Journal - Edge Middleware (Runs BEFORE any page renders)
 *
 * Protects all /dashboard/* routes by verifying the HttpOnly access token cookie.
 * No client-side JavaScript can bypass this — it runs entirely on the server edge.
 */

// Routes that require authentication
const PROTECTED_PREFIXES = ["/dashboard"];

// Routes only accessible when NOT logged in
const AUTH_ONLY_ROUTES = ["/login", "/register"];

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("gb_access_token")?.value;

  // Check if this is a protected route
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Check if this is an auth-only route (login/register)
  const isAuthRoute = AUTH_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "?")
  );

  if (isProtected) {
    if (!accessToken) {
      // No token at all — redirect to login immediately
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the token is still valid with the backend
    try {
      const verifyRes = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        // Short timeout — edge should respond fast
        signal: AbortSignal.timeout(5000),
      });

      if (!verifyRes.ok) {
        // Token is expired or invalid — clear cookies and redirect
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("redirect", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("gb_access_token");
        response.cookies.delete("gb_refresh_token");
        return response;
      }
    } catch {
      // Backend is unreachable — still block access for security
      // (avoid falling through to unprotected page)
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("gb_access_token");
      response.cookies.delete("gb_refresh_token");
      return response;
    }
  }

  if (isAuthRoute && accessToken) {
    // Already logged in — redirect away from login/register
    try {
      const verifyRes = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: AbortSignal.timeout(3000),
      });

      if (verifyRes.ok) {
        const dashboardUrl = req.nextUrl.clone();
        dashboardUrl.pathname = "/dashboard";
        dashboardUrl.search = "";
        return NextResponse.redirect(dashboardUrl);
      }
    } catch {
      // Backend down — allow access to login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icon.png, public files
     * - /api/* (our own API route handlers)
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|images/|gb-logo|api/).*)",
  ],
};
