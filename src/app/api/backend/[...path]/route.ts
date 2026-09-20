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
      `gb_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`,
    ];

    if (newRefreshToken) {
      setCookieHeaders.push(
        `refresh_token=${newRefreshToken}${refreshOpts}`,
        `gb_refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
      );
    }

    return { newToken, setCookieHeaders };
  } catch {
    return { newToken: null, setCookieHeaders: [] };
  }
}

interface CachedResponse {
  data: any;
  status: number;
  contentType: string;
  timestamp: number;
}

const proxyMemoryCache = new Map<string, CachedResponse>();
const PROXY_CACHE_TTL_MS = 60 * 1000; // 60s in-memory TTL

function isCacheablePublicEndpoint(endpoint: string): boolean {
  return (
    endpoint.startsWith("navigation") ||
    endpoint.startsWith("content/") ||
    endpoint.startsWith("editorial-board") ||
    endpoint.startsWith("issues") ||
    endpoint.startsWith("articles")
  );
}

function invalidateProxyCache(endpoint: string) {
  for (const key of proxyMemoryCache.keys()) {
    if (
      (endpoint.includes("content") && key.includes("content")) ||
      (endpoint.includes("navigation") && key.includes("navigation")) ||
      (endpoint.includes("board") && key.includes("editorial-board")) ||
      (endpoint.includes("issue") && key.includes("issue")) ||
      (endpoint.includes("article") && key.includes("article"))
    ) {
      proxyMemoryCache.delete(key);
    }
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
    const url = new URL(req.url);
    const targetUrl = `${BACKEND_URL}/api/v1/${endpoint}${url.search}`;
    const cacheControlHeader = req.headers.get("cache-control") || "";
    const isCacheBypass =
      cacheControlHeader.includes("no-cache") ||
      cacheControlHeader.includes("no-store") ||
      req.headers.get("pragma") === "no-cache" ||
      url.searchParams.has("_t") ||
      url.searchParams.has("fresh");

    // Fast-path: Return cached public GET response (< 1ms) unless cache bypass is requested
    if (method === "GET" && isCacheablePublicEndpoint(endpoint) && !isCacheBypass) {
      const cached = proxyMemoryCache.get(targetUrl);
      if (cached && Date.now() - cached.timestamp < PROXY_CACHE_TTL_MS) {
        return NextResponse.json(cached.data, {
          status: cached.status,
          headers: {
            "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
            "X-Proxy-Cache": "HIT",
          },
        });
      }
    }

    // Invalidate cached endpoints on mutations
    if (method !== "GET" && method !== "HEAD") {
      invalidateProxyCache(endpoint);
    }

    let accessToken = req.cookies.get("access_token")?.value;

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
      const contentType = req.headers.get("content-type") || "";
      if (
        contentType.includes("multipart/form-data") ||
        contentType.includes("application/octet-stream")
      ) {
        body = await req.arrayBuffer();
      } else {
        try {
          const text = await req.text();
          if (text && text.trim().length > 0) {
            body = text;
          }
        } catch {
          // Empty body
        }
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
        try {
          const text = await res.text();
          if (text && text.trim().length > 0) {
            const data = JSON.parse(text);
            nextRes = NextResponse.json(data, { status: res.status });

            // Populate proxy in-memory cache for public GET endpoints
            if (method === "GET" && res.status === 200 && isCacheablePublicEndpoint(endpoint)) {
              proxyMemoryCache.set(targetUrl, {
                data,
                status: res.status,
                contentType: resContentType,
                timestamp: Date.now(),
              });
            }
          } else {
            nextRes = new NextResponse(null, { status: res.status });
          }
        } catch {
          nextRes = new NextResponse(null, { status: res.status });
        }
      } else {
        const buffer = await res.arrayBuffer();
        const resHeaders: Record<string, string> = {
          "content-type": resContentType || "application/octet-stream",
        };
        const disposition = res.headers.get("content-disposition");
        if (disposition) {
          resHeaders["content-disposition"] = disposition;
        }
        nextRes = new NextResponse(buffer, {
          status: res.status,
          headers: resHeaders,
        });
      }

      // Attach refreshed token cookies to the response so the browser
      // updates its stored HttpOnly cookies automatically
      for (const cookieHeader of refreshCookies) {
        nextRes.headers.append("Set-Cookie", cookieHeader);
      }

      // Add edge and client caching for public static GET endpoints (independent of login cookies)
      if (
        method === "GET" &&
        res.status === 200 &&
        isCacheablePublicEndpoint(endpoint)
      ) {
        if (isCacheBypass) {
          nextRes.headers.set(
            "Cache-Control",
            "no-store, no-cache, must-revalidate"
          );
        } else {
          nextRes.headers.set(
            "Cache-Control",
            "public, max-age=60, stale-while-revalidate=300"
          );
        }
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
