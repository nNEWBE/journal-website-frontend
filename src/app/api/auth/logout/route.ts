import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  // Delete all auth and session cookies
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.delete("gb_access_token");
  response.cookies.delete("gb_refresh_token");
  response.cookies.delete("gb_journal_user_session");

  return response;
}
