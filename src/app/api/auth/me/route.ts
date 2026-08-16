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
    const accessToken =
      req.cookies.get("access_token")?.value ||
      req.cookies.get("gb_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { user: null, authenticated: false },
        { status: 401 }
      );
    }

    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal: AbortSignal.timeout(3000),
      });

      if (backendRes.ok) {
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
      }
    } catch {
      // Backend offline fallback
    }

    // Try decoding from JWT
    const jwtPayload = parseJwt(accessToken);
    if (jwtPayload && jwtPayload.sub) {
      return NextResponse.json({
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
