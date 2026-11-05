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

    let hasStarted = false;
    const seenSeqs = new Set<number>();

    es.addEventListener("log", (event) => {
      const chunk = JSON.parse(event.data) as LogChunk;

      if (seenSeqs.has(chunk.seq)) return;
      seenSeqs.add(chunk.seq);

      let lines = chunk.lines;
      if (!hasStarted) {
        const startIndex = lines.findIndex((line) =>
          /starting\s+docker\s+build/i.test(line),
        );

        if (startIndex === -1) return;

        hasStarted = true;
        lines = lines.slice(startIndex);
      }

      update((current) => ({
        chunks: [...current.chunks, { ...chunk, lines }],
      }));
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
