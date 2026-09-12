import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxyRequest(
  backendPath: string,
  init: RequestInit = {},
  request?: NextRequest,
): Promise<NextResponse> {
  const backendUrl = process.env.BACKEND_URL;

  const token = request?.cookies.get("auth-token")?.value
    ?? (await cookies()).get("auth-token")?.value;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${backendUrl}${backendPath}`, {
      ...init,
      headers,
      cache: "no-store",
    });
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the backend" },
      { status: 502 },
    );
  }
}

export function proxyGet(
  backendPath: string,
  request?: NextRequest,
): Promise<NextResponse> {
  return proxyRequest(backendPath, {}, request);
}
