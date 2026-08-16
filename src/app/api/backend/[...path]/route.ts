import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path.join("/"), "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path.join("/"), "POST");
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path.join("/"), "PUT");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path.join("/"), "DELETE");
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path.join("/"), "PATCH");
}

async function handleProxy(req: NextRequest, endpoint: string, method: string) {
  try {
    const accessToken = req.cookies.get("gb_access_token")?.value;
    const url = new URL(req.url);
    const targetUrl = `${BACKEND_URL}/api/v1/${endpoint}${url.search}`;

    const headers: Record<string, string> = {};

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const contentType = req.headers.get("content-type");
    if (contentType) {
      headers["content-type"] = contentType;
    }

    let body: any = undefined;
    if (method !== "GET" && method !== "HEAD") {
      if (contentType?.includes("application/json")) {
        body = JSON.stringify(await req.json());
      } else {
        body = await req.arrayBuffer();
      }
    }

    const backendRes = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    if (backendRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const resContentType = backendRes.headers.get("content-type");
    if (resContentType?.includes("application/json")) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }

    const buffer = await backendRes.arrayBuffer();
    return new NextResponse(buffer, {
      status: backendRes.status,
      headers: {
        "content-type": resContentType || "application/octet-stream",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Proxy request failed" },
      { status: 500 }
    );
  }
}
