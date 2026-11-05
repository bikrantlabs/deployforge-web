"use client";

import { useEffect, useState } from "react";

import { SpinnerIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  DASHBOARD_URL,
  LOGIN_URL,
  SESSION_REFRESH_PATH,
} from "@/lib/auth-routes";
import { refreshSession } from "@/lib/session-refresh";

const AUTO_RETRY_MS = 3_000;

type RefreshStatus = "refreshing" | "unavailable";

export function RefreshSession() {
  const [status, setStatus] = useState<RefreshStatus>("refreshing");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const nextPath = getSafeNextPath();

    async function run() {
      setStatus("refreshing");

      const result = await refreshSession();

      if (cancelled) return;

      if (result === "success") {
        window.location.replace(nextPath);
        return;
      }

      if (result === "unauthenticated") {
        window.location.replace(LOGIN_URL);
        return;
      }

      setStatus("unavailable");
      retryTimer = setTimeout(
        () => setAttempt((value) => value + 1),
        AUTO_RETRY_MS,
      );
    }

    void run();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, [attempt]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <SpinnerIcon
          aria-hidden="true"
          className="size-8 animate-spin text-muted-foreground"
        />
        <div className="space-y-1" role="status" aria-live="polite">
          <p className="font-medium">
            {status === "refreshing"
              ? "Restoring your session…"
              : "Still restoring your session…"}
          </p>
          <p className="text-sm text-muted-foreground">
            {status === "refreshing"
              ? "This only takes a moment."
              : "The server is taking longer than expected. We will retry automatically."}
          </p>
        </div>
        {status === "unavailable" ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try again
          </Button>
        ) : null}
      </div>
    </main>
  );
}

function getSafeNextPath(): string {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("next");

  if (!raw) return DASHBOARD_URL;

  try {
    const url = new URL(raw, window.location.origin);

    if (url.origin !== window.location.origin) return DASHBOARD_URL;
    if (
      url.pathname === SESSION_REFRESH_PATH ||
      url.pathname.startsWith(`${SESSION_REFRESH_PATH}/`)
    ) {
      return DASHBOARD_URL;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DASHBOARD_URL;
  }
}
