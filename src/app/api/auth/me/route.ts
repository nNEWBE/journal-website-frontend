import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

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
        signal: AbortSignal.timeout(3000),
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
          signal: AbortSignal.timeout(4000),
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
              `gb_access_token=${newToken}${opts}`,
            ];
            if (newRefreshToken) {
              refreshCookies.push(
                `refresh_token=${newRefreshToken}${refreshOpts}`,
                `gb_refresh_token=${newRefreshToken}${refreshOpts}`
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

    // Try decoding from JWT
    if (accessToken) {
      const jwtPayload = parseJwt(accessToken);
      if (jwtPayload && jwtPayload.sub) {
        const response = NextResponse.json({
          authenticated: true,
          user: {
            id: jwtPayload.id || "usr_jwt",
            email: jwtPayload.sub,
            name: jwtPayload.name || jwtPayload.sub.split("@")[0],
            role: jwtPayload.role || "author",
            title: "Academic Member",
            department: "Department of Pharmacy",
            institution: "Gono Bishwabidyalay",
          },
        });
        for (const cookie of refreshCookies) {
          response.headers.append("Set-Cookie", cookie);
        }
        return response;
      }
    }

    return NextResponse.json(
      { user: null, authenticated: false },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to verify session" },
      { status: 500 }
    );
  }
}
