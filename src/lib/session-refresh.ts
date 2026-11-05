export type RefreshSessionResult =
  "success" | "unauthenticated" | "unavailable";

const LOCK_NAME = "session-refresh";

let inFlight: Promise<RefreshSessionResult> | null = null;

async function requestRefresh(): Promise<RefreshSessionResult> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
    });

    if (res.ok) return "success";
    if (res.status === 401) return "unauthenticated";

    return "unavailable";
  } catch {
    return "unavailable";
  }
}

async function withLock(): Promise<RefreshSessionResult> {
  if (typeof navigator !== "undefined" && "locks" in navigator) {
    return navigator.locks.request(LOCK_NAME, requestRefresh);
  }

  return requestRefresh();
}

/**
 * Refreshes the session once across every caller in the tab. Parallel calls
 * share the same in-flight request, and `navigator.locks` keeps other tabs
 * from refreshing at the same time.
 */
export function refreshSession(): Promise<RefreshSessionResult> {
  if (inFlight) return inFlight;

  const promise = withLock().finally(() => {
    if (inFlight === promise) inFlight = null;
  });

  inFlight = promise;
  return promise;
}
