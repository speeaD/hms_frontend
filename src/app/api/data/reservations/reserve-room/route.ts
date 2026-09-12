import { NextRequest } from "next/server";
import { proxyRequest } from "../../_lib/proxy";

export async function POST(request: NextRequest) {
  return proxyRequest("/v1/reservation/reserve-room", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  }, request);
}