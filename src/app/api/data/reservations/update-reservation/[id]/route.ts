import { NextRequest } from "next/server";
import { proxyRequest } from "../../../_lib/proxy";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return proxyRequest(
    `/v1/reservation/update-reservation/${encodeURIComponent(id)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    },
    request,
  );
}