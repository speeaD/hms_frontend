import { NextRequest } from "next/server";
import { proxyRequest } from "../../_lib/proxy";

export async function POST(request: NextRequest) {
  return proxyRequest("/v1/room/bulk", {
    method: "POST",
    body: await request.formData(),
  }, request);
}