import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

const BACKEND_URL = getBackendUrl();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path.join("/"), "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path.join("/"), "POST");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path.join("/"), "PUT");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path.join("/"), "DELETE");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path.join("/"), "PATCH");
}

/**
 * Attempt to refresh the access token using the stored refresh token cookie.
 * Calls the Spring Boot /api/v1/auth/refresh endpoint directly.
 * Returns the new access token string, or null if refresh failed.
 */
async function tryRefreshToken(req: NextRequest): Promise<{
  newToken: string | null;
  setCookieHeaders: string[];
}> {
  const refreshToken =
    req.cookies.get("refresh_token")?.value ||
    req.cookies.get("gb_refresh_token")?.value;

  if (!refreshToken) return { newToken: null, setCookieHeaders: [] };

  try {
    const refreshRes = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      signal: AbortSignal.timeout(15000),
    });

    if (!refreshRes.ok) return { newToken: null, setCookieHeaders: [] };

    const data = await refreshRes.json();
    const newToken: string | null = data.accessToken ?? null;
    const newRefreshToken: string | null = data.refreshToken ?? null;
    if (!newToken) return { newToken: null, setCookieHeaders: [] };

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOpts = `; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}${isProduction ? "; Secure" : ""}`;
    const refreshOpts = `; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${isProduction ? "; Secure" : ""}`;
    const setCookieHeaders = [
      `access_token=${newToken}${cookieOpts}`,
      `gb_access_token=${newToken}${cookieOpts}`,
    ];

    if (newRefreshToken) {
      setCookieHeaders.push(
        `refresh_token=${newRefreshToken}${refreshOpts}`,
        `gb_refresh_token=${newRefreshToken}${refreshOpts}`
      );
    }

    return { newToken, setCookieHeaders };
  } catch {
    return { newToken: null, setCookieHeaders: [] };
  }
}

/**
 * Makes a request to the Spring Boot backend with a 20-second timeout.
 * Returns null if the backend is unreachable (connection refused / timeout).
 */
async function makeBackendRequest(
  targetUrl: string,
  method: string,
  headers: Record<string, string>,
  body: any
): Promise<Response | null> {
  try {
    return await fetch(targetUrl, {
      method,
      headers,
      body,
      signal: AbortSignal.timeout(20000),
    });
  } catch (err: any) {
    const msg = err?.message ?? "";
    // ECONNREFUSED = backend not running locally
    // TimeoutError / AbortError = too slow
    console.error(`[proxy] Backend unreachable at ${targetUrl}: ${msg}`);
    return null;
  }
}

async function handleProxy(req: NextRequest, endpoint: string, method: string) {
  try {
    let accessToken =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("gb_access_token")?.value;

    const url = new URL(req.url);
    const targetUrl = `${BACKEND_URL}/api/v1/${endpoint}${url.search}`;

    const buildHeaders = (token: string | undefined): Record<string, string> => {
      const h: Record<string, string> = {};
      if (token) h["Authorization"] = `Bearer ${token}`;
      const contentType = req.headers.get("content-type");
      if (contentType) h["content-type"] = contentType;
      return h;
    };

    // Read body once — body streams can only be consumed once
    let body: any = undefined;
    if (method !== "GET" && method !== "HEAD") {
      const contentType = req.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        body = JSON.stringify(await req.json());
      } else {
        body = await req.arrayBuffer();
      }
    }

    // ── First attempt ────────────────────────────────────────────────────────
    let backendRes = await makeBackendRequest(
      targetUrl,
      method,
      buildHeaders(accessToken),
      body
    );

    // Backend is completely unreachable (ECONNREFUSED, timeout, etc.)
    if (backendRes === null) {
      return NextResponse.json(
        { message: "Backend service is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    // ── 401 → try token refresh then retry once ───────────────────────────
    let refreshCookies: string[] = [];
    if (backendRes.status === 401) {
      const { newToken, setCookieHeaders } = await tryRefreshToken(req);
      if (newToken) {
        accessToken = newToken;
        refreshCookies = setCookieHeaders;
        // Retry with refreshed token
        const retried = await makeBackendRequest(
          targetUrl,
          method,
          buildHeaders(newToken),
          body
        );
        if (retried !== null) {
          backendRes = retried;
        }
      }
    }

    // ── Build response ───────────────────────────────────────────────────────
    const buildNextResponse = async (res: Response): Promise<NextResponse> => {
      if (res.status === 204) {
        return new NextResponse(null, { status: 204 });
      }

      const resContentType = res.headers.get("content-type");
      let nextRes: NextResponse;

      if (resContentType?.includes("application/json")) {
        const data = await res.json();
        nextRes = NextResponse.json(data, { status: res.status });
      } else {
        const buffer = await res.arrayBuffer();
        nextRes = new NextResponse(buffer, {
          status: res.status,
          headers: { "content-type": resContentType || "application/octet-stream" },
        });
      }

      // Attach refreshed token cookies to the response so the browser
      // updates its stored HttpOnly cookies automatically
      for (const cookieHeader of refreshCookies) {
        nextRes.headers.append("Set-Cookie", cookieHeader);
      }

      return nextRes;
    };

    return buildNextResponse(backendRes);
  } catch (error: any) {
    console.error(`[proxy] Unexpected error:`, error);
    return NextResponse.json(
      { message: error.message || "An unexpected proxy error occurred." },
      { status: 500 }
    );
  }
}
