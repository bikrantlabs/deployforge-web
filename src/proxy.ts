// The proxy only does optimistic redirects. It never refreshes tokens itself.
//
// Refreshing lives in the browser (see `app/components/session-keeper.tsx`).
// The browser is the only place that can (a) write cookies onto the response
// the user is actually waiting for, and (b) coordinate parallel requests, so
// the refresh race simply cannot happen there.
//
// When a protected page is opened without an access token, we send the browser
// to a small interstitial that shows a spinner while the existing browser-side
// refresh runs. Only after the new cookie is set do we reload the original URL,
// so server components never render with a missing token.

import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_PREFIX,
  DASHBOARD_URL,
  LOGIN_URL,
  PROTECTED_ROUTES,
  SESSION_REFRESH_PATH,
} from "@/lib/auth-routes";
import {
  ACCESS_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
} from "@/lib/cookie-config";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_COOKIE_KEY);
  const hasAccessToken = request.cookies.has(ACCESS_TOKEN_COOKIE_KEY);

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtectedRoute) {
    if (!hasRefreshToken) {
      return NextResponse.redirect(new URL(LOGIN_URL, request.url));
    }

    if (!hasAccessToken) {
      return redirectToSessionRefresh(request, `${pathname}${search}`);
    }
  }

  if (pathname.startsWith(AUTH_PREFIX) && hasRefreshToken) {
    if (!hasAccessToken) {
      return redirectToSessionRefresh(request, DASHBOARD_URL);
    }

    return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
  }

  return NextResponse.next();
}

function redirectToSessionRefresh(request: NextRequest, nextPath: string) {
  const url = new URL(SESSION_REFRESH_PATH, request.url);
  url.searchParams.set("next", nextPath);

  return NextResponse.redirect(url);
}

export const config = {
  // Every page route. `api` is excluded so /api/auth/refresh is never proxied,
  // and static assets are excluded so a missing image never runs auth logic.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|xml|woff|woff2|ttf|otf)$).*)",
  ],
};
