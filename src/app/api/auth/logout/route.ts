import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  // Delete HttpOnly cookies
  response.cookies.delete("gb_access_token");
  response.cookies.delete("gb_refresh_token");

  return response;
}
