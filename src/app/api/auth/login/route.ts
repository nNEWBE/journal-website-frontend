import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

const BACKEND_URL = getBackendUrl();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { message: "Institutional email address and password are required." },
        { status: 400 }
      );
    }

    let backendRes: Response;
    try {
      backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        signal: AbortSignal.timeout(15000),
      });
    } catch (networkErr: any) {
      console.error("[auth/login] Backend network error:", networkErr?.message);
      return NextResponse.json(
        { message: "Authentication service is temporarily unavailable. Please check your connection and try again." },
        { status: 503 }
      );
    }

    if (!backendRes.ok) {
      let errorMessage = "Invalid email or password. Please check your credentials.";
      try {
        const errorData = await backendRes.json();
        if (errorData.message) errorMessage = errorData.message;
        else if (errorData.error) errorMessage = errorData.error;
      } catch {}

      return NextResponse.json(
        { message: errorMessage },
        { status: backendRes.status === 400 || backendRes.status === 401 ? 401 : backendRes.status }
      );
    }

    const data = await backendRes.json();
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    const user = data.user;

    if (!accessToken || !user) {
      return NextResponse.json(
        { message: "Authentication failed. The authentication server returned an invalid response." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.fullName || user?.name,
        role: user?.role,
        title: user?.title || "Academic Member",
        department: user?.department || "Academic Department",
        institution: user?.institution || "Gono Bishwabidyalay",
        avatar: user?.avatarUrl || user?.avatar,
      },
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Set secure HttpOnly Access Token cookie
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    response.cookies.delete("gb_access_token");

    // Set secure HttpOnly Refresh Token cookie
    if (refreshToken) {
      response.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      response.cookies.delete("gb_refresh_token");
    }

    // Set client session cookie for UI hydration
    response.cookies.set(
      "gb_journal_user_session",
      encodeURIComponent(
        JSON.stringify({
          email: user?.email,
          name: user?.fullName || user?.name,
          role: user?.role,
          title: user?.title || "Academic Member",
          department: user?.department || "Academic Department",
          institution: user?.institution || "Gono Bishwabidyalay",
          avatar: user?.avatarUrl || user?.avatar,
        })
      ),
      {
        httpOnly: false,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
