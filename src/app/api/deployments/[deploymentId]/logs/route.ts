// app/api/deployments/[id]/logs/route.ts
import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE_KEY } from "@/lib/cookie-config";
import { env } from "@/lib/env";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ deploymentId: string }> },
) {
  const { deploymentId } = await params;
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE_KEY)?.value;

  if (!token) return new Response("Unauthorized", { status: 401 });

  const upstream = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/deployments/${encodeURIComponent(deploymentId)}/logs`,
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: req.signal, // closes the upstream when the browser disconnects
      cache: "no-store",
    },
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
