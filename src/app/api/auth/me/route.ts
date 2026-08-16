import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("gb_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { user: null, authenticated: false },
        { status: 401 }
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { user: null, authenticated: false },
        { status: 401 }
      );
    }

    const user = await backendRes.json();

    return NextResponse.json({
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
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to verify session" },
      { status: 500 }
    );
  }
}
