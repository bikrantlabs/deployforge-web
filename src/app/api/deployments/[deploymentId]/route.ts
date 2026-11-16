import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_TOKEN_COOKIE_KEY } from "@/lib/cookie-config";
import { env } from "@/lib/env";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ deploymentId: string }> },
) {
  const { deploymentId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  console.log(
    `${env.NEXT_PUBLIC_API_URL}/deployments/${encodeURIComponent(deploymentId)}`,
  );
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_URL}/deployments/${encodeURIComponent(deploymentId)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("Content-Type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}
