import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message || data.error || "Authentication failed" },
        { status: backendRes.status }
      );
    }

    const { accessToken, refreshToken, user } = data;

    const response = NextResponse.json({
      success: true,
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

    const isProduction = process.env.NODE_ENV === "production";

    // Set secure HttpOnly cookie for Access Token
    response.cookies.set("gb_access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Set secure HttpOnly cookie for Refresh Token
    if (refreshToken) {
      response.cookies.set("gb_refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
