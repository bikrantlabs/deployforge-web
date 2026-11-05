"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { useDeploymentLogs } from "../../_hooks/use-deployment-logs";

export type DeploymentLogsProps = {
  deploymentId: string;
  /** Height of the log box (number = px, or any CSS size) */
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  /** Show the connection status above the logs */
  showStatus?: boolean;
  baseUrl?: string;
  eventName?: string;
  /** Maximum number of rendered log lines */
  maxLines?: number;
};

export function DeploymentLogs({
  deploymentId,
  height = 400,
  className,
  style,
  showStatus = true,
  maxLines,
}: DeploymentLogsProps) {
  const { chunks, status } = useDeploymentLogs(deploymentId, maxLines);

  const boxRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  const handleScroll = () => {
    const el = boxRef.current;
    if (!el) return;

    stickToBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  };

  useEffect(() => {
    const el = boxRef.current;
    if (el && stickToBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chunks]);

  return (
    <div className={className} style={style}>
      {showStatus && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
            color: "#71717a",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background:
                status === "open"
                  ? "#22c55e"
                  : status === "error"
                    ? "#ef4444"
                    : status === "closed"
                      ? "#71717a"
                      : "#eab308",
            }}
          />
          <span>{deploymentId}</span>
          <span aria-hidden="true">·</span>
          <span>{status}</span>
        </div>
      )}

      <div
        ref={boxRef}
        onScroll={handleScroll}
        role="log"
        aria-label="Deployment build logs"
        aria-live="off"
        style={{
          height,
          overflow: "auto",
          boxSizing: "border-box",
          padding: "14px 16px",
          border: "1px solid #27272a",
          borderRadius: 8,
          background: "#09090b",
          color: "#d4d4d8",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: 12,
          lineHeight: 1.65,
          scrollbarGutter: "stable",
        }}
      >
        {chunks.length === 0 ? (
          <div style={{ color: "#71717a" }}>
            {status === "connecting"
              ? "Connecting to build logs…"
              : "No build output yet."}
          </div>
        ) : (
          chunks.map((chunk) => (
            <div
              key={chunk.seq}
              data-stream={chunk.stream}
              style={{
                marginBottom: 12,
                paddingLeft: 10,
                borderLeft: `2px solid ${
                  chunk.stream === "stderr" ? "#f59e0b" : "#3f3f46"
                }`,
              }}
            >
              {chunk.lines.map((line, index) => (
                <div
                  key={`${chunk.seq}-${index}`}
                  style={{
                    minHeight: "1.65em",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    color: chunk.stream === "stderr" ? "#fbbf24" : "#d4d4d8",
                  }}
                >
                  {line || "\u00a0"}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
