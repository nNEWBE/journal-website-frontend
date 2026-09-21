import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

const BACKEND_URL = getBackendUrl();

export async function POST(req: NextRequest) {
  try {
    const accessToken =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("gb_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Authentication required. Please sign in to continue." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { newEmail, password } = body;

    if (!newEmail || !password || typeof newEmail !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { message: "New email address and current password are required." },
        { status: 400 }
      );
    }

    let backendRes: Response;
    try {
      backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/change-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          newEmail: newEmail.trim().toLowerCase(),
          password,
        }),
        signal: AbortSignal.timeout(15000),
      });
    } catch (networkErr: any) {
      console.error("[auth/change-email] Backend network error:", networkErr?.message);
      return NextResponse.json(
        { message: "Authentication service is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    if (!backendRes.ok) {
      let errorMessage = "Failed to update email address.";
      try {
        const errorData = await backendRes.json();
        if (errorData.message) errorMessage = errorData.message;
        else if (errorData.error) errorMessage = errorData.error;
      } catch {}

      return NextResponse.json(
        { message: errorMessage },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    const newAccessToken = data.accessToken;
    const newRefreshToken = data.refreshToken;
    const user = data.user;

    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.fullName || user?.name,
        role: user?.role,
        title: user?.title || "Academic Member",
        department: user?.department || "Academic Department",
        institution: user?.institution || "Gono Bishwabidyalay",
        avatar: user?.avatarUrl || user?.avatar,
        secondaryEmail: user?.secondaryEmail,
      },
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Set updated secure HttpOnly Access Token cookie
    if (newAccessToken) {
      response.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

    // Set updated secure HttpOnly Refresh Token cookie
    if (newRefreshToken) {
      response.cookies.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    // Update client session cookie for UI hydration
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
          secondaryEmail: user?.secondaryEmail,
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
      { message: error.message || "An unexpected error occurred during email update." },
      { status: 500 }
    );
  }
}
