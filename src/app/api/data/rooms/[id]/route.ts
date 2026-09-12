import { NextRequest } from "next/server";
import { proxyGet } from "../../_lib/proxy";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyGet(`/v1/room/${encodeURIComponent(id)}`, request);
}