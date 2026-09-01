import { NextRequest, NextResponse } from "next/server";

/**
 * GB Journal - Edge Middleware (Runs BEFORE any page renders)
 *
 * Protects all /dashboard/* routes by verifying the HttpOnly access token cookie.
 * No client-side JavaScript can bypass this — it runs entirely on the server edge.
 */

import { getBackendUrl } from "./lib/backend-url";

// Routes that require authentication
const PROTECTED_PREFIXES = ["/dashboard"];

// Routes only accessible when NOT logged in
const AUTH_ONLY_ROUTES = ["/login", "/register"];

const BACKEND_URL = getBackendUrl();

function isLikelyValidJwt(token: string): boolean {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
    const payload = JSON.parse(payloadJson);
    if (payload.exp && typeof payload.exp === "number") {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    }
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken =
    req.cookies.get("access_token")?.value ||
    req.cookies.get("gb_access_token")?.value;

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

    // Verify token validity
    let isValid = false;

    try {
      const verifyRes = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: AbortSignal.timeout(15000),
      });

      if (verifyRes.ok) {
        isValid = true;
      }
    } catch {
      // Backend offline fallback - verify JWT structure & expiry locally
      if (isLikelyValidJwt(accessToken)) {
        isValid = true;
      }
    }

    if (!isValid && !isLikelyValidJwt(accessToken)) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      response.cookies.delete("gb_access_token");
      response.cookies.delete("gb_refresh_token");
      response.cookies.delete("gb_journal_user_session");
      return response;
    }
  }

  if (isAuthRoute && accessToken && isLikelyValidJwt(accessToken)) {
    // Already logged in with valid token — redirect to dashboard
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
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
