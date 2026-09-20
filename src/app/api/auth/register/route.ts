import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

const BACKEND_URL = getBackendUrl();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.email || !body.password || !body.fullName) {
      return NextResponse.json(
        { message: "Full name, email, and password are required for registration." },
        { status: 400 }
      );
    }

    let backendRes: Response;
    try {
      backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });
    } catch (networkErr: any) {
      console.error("[auth/register] Backend network error:", networkErr?.message);
      return NextResponse.json(
        { message: "Registration service is temporarily unavailable. Please try again shortly." },
        { status: 503 }
      );
    }

    if (!backendRes.ok) {
      let errorMessage = "Registration failed. Please check your details and try again.";
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
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    const user = data.user;

    const response = NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.fullName || user?.name,
        role: user?.role,
        title: user?.title || "Author",
        department: user?.department || "Department of Pharmacy",
        institution: user?.institution || "Gono Bishwabidyalay",
        avatar: user?.avatarUrl || user?.avatar,
      },
    });

    const isProduction = process.env.NODE_ENV === "production";

    if (accessToken) {
      response.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      response.cookies.delete("gb_access_token");
    }

    if (refreshToken) {
      response.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      response.cookies.delete("gb_refresh_token");
    }

    response.cookies.set(
      "gb_journal_user_session",
      encodeURIComponent(
        JSON.stringify({
          email: user?.email,
          name: user?.fullName || user?.name,
          role: user?.role,
          title: user?.title || "Author",
          department: user?.department || "Department of Pharmacy",
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
      { message: error.message || "Registration error" },
      { status: 500 }
    );
  }
}
