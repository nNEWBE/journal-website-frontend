import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

/**
 * POST /api/auth/upload-avatar
 *
 * Secure multipart proxy: reads the image file from the browser FormData,
 * forwards it to Spring Boot POST /api/v1/auth/avatar (which uploads to
 * Cloudinary, saves the URL to DB, and returns updated UserInfo).
 *
 * Auth flow:
 *  1. Read access token from HttpOnly cookie
 *  2. Forward multipart to Spring Boot
 *  3. On 401 → call /api/v1/auth/refresh to get a fresh JWT → retry once
 *  4. If refresh also fails → return 401 (session expired, user must re-login)
 */
export async function POST(req: NextRequest) {
  try {
    // ── Parse incoming FormData ────────────────────────────────────────────
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (err: any) {
      return NextResponse.json(
        { message: "Failed to parse form data: " + err.message },
        { status: 400 }
      );
    }

    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: "No file found. Send the image as multipart field 'file'." },
        { status: 400 }
      );
    }

    const fileName =
      file instanceof File ? file.name : `avatar-${Date.now()}.jpg`;

    // ── Read access token ──────────────────────────────────────────────────
    let accessToken =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("gb_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Session expired. Please log in again.", sessionExpired: true },
        { status: 401 }
      );
    }

    // ── Helper: rebuild FormData each time (streams can't be reused) ───────
    const buildForm = (): FormData => {
      const f = new FormData();
      f.append("file", file, fileName);
      return f;
    };

    // ── Helper: POST multipart to Spring Boot ──────────────────────────────
    const postToBackend = (token: string): Promise<Response> =>
      fetch(`${BACKEND_URL}/api/v1/auth/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        // DO NOT set Content-Type — fetch auto-sets multipart/form-data + boundary
        body: buildForm(),
      });

    // ── First attempt ──────────────────────────────────────────────────────
    let backendRes = await postToBackend(accessToken);

    // ── 401: try token refresh then retry once ─────────────────────────────
    let refreshCookies: string[] = [];
    if (backendRes.status === 401) {
      const refreshToken =
        req.cookies.get("refresh_token")?.value ||
        req.cookies.get("gb_refresh_token")?.value;

      if (refreshToken) {
        try {
          // Call Spring Boot refresh directly (same as the generic proxy does)
          const refreshRes = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
            signal: AbortSignal.timeout(4000),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newToken: string | undefined = refreshData.accessToken;

            if (newToken) {
              accessToken = newToken;

              // Retry upload with refreshed token
              backendRes = await postToBackend(newToken);

              // Tell the browser to update its HttpOnly cookies
              const isProduction = process.env.NODE_ENV === "production";
              const opts = `; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}${
                isProduction ? "; Secure" : ""
              }`;
              refreshCookies = [
                `access_token=${newToken}${opts}`,
                `gb_access_token=${newToken}${opts}`,
              ];
            }
          } else {
            // Refresh token is invalid/expired — force re-login
            return NextResponse.json(
              {
                message: "Session expired. Please log out and log back in.",
                sessionExpired: true,
              },
              { status: 401 }
            );
          }
        } catch {
          // Network issue during refresh — fall through and return original 401
        }
      }
    }

    // ── Handle non-OK backend response ────────────────────────────────────
    if (!backendRes.ok) {
      let errorMsg = `Upload failed (${backendRes.status})`;
      let sessionExpired = backendRes.status === 401;

      try {
        const errBody = await backendRes.json();
        errorMsg = errBody.message || errBody.error || errorMsg;
      } catch {
        // non-JSON error body
      }

      if (sessionExpired) {
        errorMsg = "Session expired. Please log out and log back in.";
      }

      return NextResponse.json(
        { message: errorMsg, sessionExpired },
        { status: backendRes.status }
      );
    }

    // ── Parse response — Spring Boot returns AuthResponse.UserInfo ─────────
    const userInfo = await backendRes.json();
    const avatarUrl: string | null =
      userInfo?.avatarUrl ?? userInfo?.avatar_url ?? userInfo?.avatar ?? null;

    const res = NextResponse.json({ ...userInfo, avatarUrl }, { status: 200 });

    // Attach refreshed cookies to update browser's stored token
    for (const header of refreshCookies) {
      res.headers.append("Set-Cookie", header);
    }

    return res;
  } catch (error: any) {
    console.error("[upload-avatar] Unexpected error:", error);
    return NextResponse.json(
      { message: error.message || "Avatar upload failed" },
      { status: 500 }
    );
  }
}
