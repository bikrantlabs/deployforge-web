"use client";

import { useEffect, useState } from "react";

export type LogStatus = "connecting" | "open" | "error" | "closed";

type LogChunk = {
  seq: number;
  time: string;
  stream: "stdout" | "stderr";
  lines: string[];
};

type State = {
  id?: string;
  chunks: LogChunk[];
  status: LogStatus;
};

const INITIAL: State = { chunks: [], status: "connecting" };

export function useDeploymentLogs(
  deploymentId: string | undefined,
  maxLines = 1000,
) {
  const [state, setState] = useState<State>(INITIAL);

  useEffect(() => {
    if (!deploymentId) return;

    const update = (fn: (current: State) => Partial<State>) =>
      setState((prev) => {
        const current: State =
          prev.id === deploymentId ? prev : { ...INITIAL, id: deploymentId };
        return { ...current, ...fn(current), id: deploymentId };
      });

    const es = new EventSource(
      `/api/deployments/${encodeURIComponent(deploymentId)}/logs`,
    );

    es.onopen = () => update(() => ({ status: "open" }));

    es.addEventListener("log", (event) => {
      const chunk = JSON.parse(event.data) as LogChunk;

      update((current) => {
        if (current.chunks.some((existing) => existing.seq === chunk.seq)) {
          return {}; // Already received this chunk.
        }

        return { chunks: [...current.chunks, chunk] };
      });
    });

    es.addEventListener("done", () => {
      es.close();
      update(() => ({ status: "closed" }));
    });

    es.onerror = () => {
      es.close(); // Disable EventSource's automatic retry.
      update(() => ({ status: "error" }));
    };

    return () => es.close();
  }, [deploymentId]);

  const current = state.id === deploymentId ? state : INITIAL;
  const lines = current.chunks.flatMap((chunk) => chunk.lines).slice(-maxLines);

  return { chunks: current.chunks, lines, status: current.status };
}
