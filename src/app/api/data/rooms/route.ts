import { NextRequest } from "next/server";
import { proxyGet, proxyRequest } from "../_lib/proxy";

export async function GET(request: NextRequest) {
  return proxyGet("/v1/room/", request);
}

export async function POST(request: NextRequest) {
  return proxyRequest("/v1/room/create-room", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  }, request);
}