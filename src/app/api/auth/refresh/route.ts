import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

const BACKEND_URL = getBackendUrl();

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Dev-mode JWT — only used when Spring Boot is completely unreachable (ECONNREFUSED).
 * When the backend IS reachable but rejects the token, we return 401 and force re-login.
 */
function generateDevJwt(payload: Record<string, any>, expiresInSec: number): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSec };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = base64UrlEncode(`gb_secret_sig_${now}`);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function POST(req: NextRequest) {
  try {
    const refreshToken =
      req.cookies.get("refresh_token")?.value ||
      req.cookies.get("gb_refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    let newAccessToken: string | null = null;
    let newRefreshToken: string | null = null;
    let backendReachable = false;

    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        signal: AbortSignal.timeout(15000),
      });

      // Mark backend as reachable regardless of HTTP status
      backendReachable = true;

      if (backendRes.ok) {
        const data = await backendRes.json();
        newAccessToken = data.accessToken ?? null;
        newRefreshToken = data.refreshToken ?? null;
      } else {
        // Backend is running but rejected the token (invalid/expired/dev token).
        // Do NOT fall back to a dev JWT — return 401 to force re-login.
        const errBody = await backendRes.json().catch(() => ({}));
        const msg = errBody?.message || "Session expired. Please log in again.";
        return NextResponse.json({ message: msg }, { status: 401 });
      }
    } catch {
      // Network error — backend is unreachable (ECONNREFUSED, timeout, etc.)
      backendReachable = false;
    }

    // Only generate a dev JWT when the backend is completely unreachable (offline dev mode)
    if (!newAccessToken && !backendReachable) {
      newAccessToken = generateDevJwt(
        { type: "access_refreshed_offline", refreshedAt: Date.now() },
        60 * 60 * 24
      );
      newRefreshToken = refreshToken;
    }

    // If backend was reachable but gave no token (shouldn't happen, but guard anyway)
    if (!newAccessToken) {
      return NextResponse.json(
        { message: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    const isProduction = process.env.NODE_ENV === "production";
    const response = NextResponse.json({ success: true, accessToken: newAccessToken });

    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    response.cookies.set("gb_access_token", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    if (newRefreshToken) {
      response.cookies.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.set("gb_refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to refresh token" },
      { status: 500 }
    );
  }
}
