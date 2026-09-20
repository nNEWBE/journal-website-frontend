import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

const BACKEND_URL = getBackendUrl();

export async function GET(req: NextRequest) {
  try {
    let accessToken =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("gb_access_token")?.value;
    const refreshToken =
      req.cookies.get("refresh_token")?.value ||
      req.cookies.get("gb_refresh_token")?.value;

    let refreshCookies: string[] = [];

    const fetchMeFromBackend = async (token: string) => {
      return fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(15000),
      });
    };

    let backendRes: Response | null = null;

    if (accessToken) {
      try {
        backendRes = await fetchMeFromBackend(accessToken);
      } catch {
        // Backend offline / network issue
      }
    }

    // If access token is expired (401) or absent, try refresh token
    if ((!backendRes || backendRes.status === 401) && refreshToken) {
      try {
        const refreshRes = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          signal: AbortSignal.timeout(15000),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newToken: string | null = refreshData.accessToken ?? null;
          const newRefreshToken: string | null = refreshData.refreshToken ?? null;

          if (newToken) {
            accessToken = newToken;
            const isProduction = process.env.NODE_ENV === "production";
            const opts = `; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}${isProduction ? "; Secure" : ""}`;
            const refreshOpts = `; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${isProduction ? "; Secure" : ""}`;
            refreshCookies = [
              `access_token=${newToken}${opts}`,
              `gb_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`,
            ];
            if (newRefreshToken) {
              refreshCookies.push(
                `refresh_token=${newRefreshToken}${refreshOpts}`,
                `gb_refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
              );
            }

            try {
              backendRes = await fetchMeFromBackend(newToken);
            } catch {}
          }
        }
      } catch {}
    }

    if (backendRes && backendRes.ok) {
      const user = await backendRes.json();
      const response = NextResponse.json({
        authenticated: true,
        user: {
          id: user?.id,
          email: user?.email,
          name: user?.fullName || user?.name,
          role: user?.role,
          title: user?.title,
          department: user?.department,
          institution: user?.institution,
          avatar: user?.avatarUrl || user?.avatar,
        },
      });

      for (const cookie of refreshCookies) {
        response.headers.append("Set-Cookie", cookie);
      }
      return response;
    }

    // Backend did not authenticate user — purge invalid cookies and return 401
    const unauthResponse = NextResponse.json(
      { user: null, authenticated: false, message: "Unauthorized or session expired." },
      { status: 401 }
    );
    unauthResponse.cookies.delete("access_token");
    unauthResponse.cookies.delete("refresh_token");
    unauthResponse.cookies.delete("gb_access_token");
    unauthResponse.cookies.delete("gb_refresh_token");
    unauthResponse.cookies.delete("gb_journal_user_session");
    return unauthResponse;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to verify session" },
      { status: 500 }
    );
  }
}
