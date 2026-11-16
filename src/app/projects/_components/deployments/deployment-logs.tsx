"use client";

import { useEffect, useRef, useState } from "react";

import {
  CaretDownIcon,
  CheckIcon,
  CopyIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { cn } from "cn";
import { toast } from "sonner";

import { useDeploymentLogs } from "../../_hooks/use-deployment-logs";

export type DeploymentLogsProps = {
  deploymentId: string;
  className?: string;

  expanded?: boolean;
  /** Show the connection status in the panel heading. */
  showStatus?: boolean;
  baseUrl?: string;
  eventName?: string;
  /** Maximum number of rendered log lines. */
  maxLines?: number;
};

export function DeploymentLogs({
  deploymentId,
  className,
  expanded = true,
  showStatus = true,
  maxLines = 1000,
}: DeploymentLogsProps) {
  const { chunks, status } = useDeploymentLogs(deploymentId, maxLines);
  const [_expanded, setExpanded] = useState(expanded);
  const [copied, setCopied] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  const lines = chunks
    .flatMap((chunk) =>
      chunk.lines.map((line, index) => ({
        key: `${chunk.seq}-${index}`,
        line,
        time: chunk.time,
        isError: chunk.stream === "stderr",
      })),
    )
    .slice(-maxLines);
  const errorCount = chunks.filter((chunk) => chunk.stream === "stderr").length;

  useEffect(() => {
    const element = boxRef.current;
    if (element && _expanded && stickToBottom.current) {
      element.scrollTop = element.scrollHeight;
    }
  }, [chunks, _expanded]);

  async function copyLogs() {
    try {
      await navigator.clipboard.writeText(
        lines.map(({ line }) => line).join("\n"),
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy the build logs.");
    }
  }

  const statusLabel = {
    connecting: "Connecting",
    open: "Streaming",
    error: "Connection error",
    closed: "Stream ended",
  }[status];

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border bg-card text-card-foreground",
        className,
      )}
      aria-label="Deployment build logs"
    >
      <div className="flex min-h-14 items-center justify-between gap-4 px-4 sm:px-5">
        <button
          type="button"
          aria-expanded={_expanded}
          aria-controls="deployment-log-output"
          onClick={() => setExpanded((value) => !value)}
          className="group flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <CaretDownIcon
            aria-hidden="true"
            className={cn(
              "size-5 shrink-0 text-muted-foreground transition-transform",
              _expanded ? "rotate-0" : "-rotate-90",
            )}
            weight="bold"
          />
          <span className="truncate text-base font-semibold">Build logs</span>
          {showStatus ? (
            <span className="ml-auto flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
              <span
                aria-hidden="true"
                className={cn("size-2.5 rounded-full", {
                  "bg-emerald-600 dark:bg-emerald-400": status === "open",
                  "bg-destructive": status === "error",
                  "bg-muted-foreground": status === "closed",
                  "animate-pulse bg-amber-500": status === "connecting",
                })}
              />
              <span className="hidden sm:inline">{statusLabel}</span>
            </span>
          ) : null}
        </button>
      </div>

      {_expanded ? (
        <div id="deployment-log-output" className="border-t">
          <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b bg-muted/40 px-3 py-2 sm:px-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <button
                type="button"
                onClick={copyLogs}
                disabled={lines.length === 0}
                className="inline-flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:text-muted-foreground/60"
                aria-label={copied ? "Logs copied" : "Copy build logs"}
                title={copied ? "Copied" : "Copy logs"}
              >
                {copied ? (
                  <CheckIcon
                    aria-hidden="true"
                    className="size-5 text-emerald-600 dark:text-emerald-400"
                    weight="bold"
                  />
                ) : (
                  <CopyIcon aria-hidden="true" className="size-5" />
                )}
              </button>
              <span className="tabular-nums">
                {lines.length} {lines.length === 1 ? "line" : "lines"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {errorCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive/10 px-2.5 py-1 font-medium text-destructive">
                  <WarningCircleIcon
                    aria-hidden="true"
                    className="size-4"
                    weight="fill"
                  />
                  <span className="tabular-nums">{errorCount}</span>
                  <span>{errorCount === 1 ? "error" : "errors"}</span>
                </span>
              ) : (
                <span className="text-muted-foreground">No errors</span>
              )}
            </div>
          </div>

          <div
            ref={boxRef}
            onScroll={() => {
              const element = boxRef.current;
              if (element) {
                stickToBottom.current =
                  element.scrollHeight -
                    element.scrollTop -
                    element.clientHeight <
                  24;
              }
            }}
            role="log"
            aria-label="Build output"
            aria-live="off"
            className="h-[28rem] max-h-[70vh] overflow-auto bg-background px-3 py-3 font-mono text-[13px] leading-6 text-foreground sm:px-4 sm:text-sm"
          >
            {lines.length === 0 ? (
              <p className="px-1 py-2 font-sans text-sm text-muted-foreground">
                {status === "connecting"
                  ? "Connecting to build logs…"
                  : "No build output yet."}
              </p>
            ) : (
              <div className="min-w-0">
                {lines.map(({ key, line, time, isError }) => (
                  <div
                    key={key}
                    className={cn(
                      "grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-3 rounded-sm px-1 sm:grid-cols-[8.25rem_minmax(0,1fr)] sm:gap-x-4 mt-0.5 first:mt-0 last:mb-0.5]",
                      isError
                        ? "bg-destructive/10 text-destructive"
                        : "text-foreground",
                    )}
                  >
                    <time className="select-text whitespace-nowrap text-muted-foreground">
                      {formatTimestamp(time)}
                    </time>
                    <span className="min-w-0 whitespace-pre-wrap tracking-tight [overflow-wrap:anywhere]">
                      {line || "\u00a0"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hourCycle: "h23",
  }).format(date);
}
