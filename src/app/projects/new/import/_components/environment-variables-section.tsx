"use client";

import { useRef, useState, type ClipboardEvent } from "react";

import { Eye, EyeSlash, Plus, Trash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type VariableRow = {
  id: number;
  key: string;
  value: string;
  visible: boolean;
};

const variableKeyPattern = /^[A-Z_a-z]\w*$/;

export function EnvironmentVariablesSection() {
  const nextId = useRef(1);
  const [rows, setRows] = useState<VariableRow[]>([
    { id: 0, key: "", value: "", visible: false },
  ]);
  const [importMessage, setImportMessage] = useState("");

  const keyCounts = new Map<string, number>();
  for (const row of rows) {
    const normalizedKey = row.key.trim();
    if (normalizedKey) {
      keyCounts.set(normalizedKey, (keyCounts.get(normalizedKey) ?? 0) + 1);
    }
  }

  const configuredCount = rows.filter((row) => row.key.trim()).length;

  function addRow(key = "", value = "") {
    const id = nextId.current++;
    setRows((current) => [...current, { id, key, value, visible: false }]);
    setImportMessage("");
  }

  function updateRow(id: number, patch: Partial<VariableRow>) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
    setImportMessage("");
  }

  function removeRow(id: number) {
    setRows((current) => current.filter((row) => row.id !== id));
    setImportMessage("");
  }

  function importEnvText(
    event: ClipboardEvent<HTMLInputElement>,
    row: VariableRow,
  ) {
    const text = event.clipboardData.getData("text");
    if (!/[\n=]/.test(text)) return;

    const parsed = parseEnv(text);
    if (parsed.length === 0) return;

    event.preventDefault();
    const useCurrentRow = !row.key.trim() && !row.value;
    const entriesToAppend = useCurrentRow ? parsed.slice(1) : parsed;

    setRows((current) => {
      const updated = current.map((item) =>
        useCurrentRow && item.id === row.id
          ? { ...item, key: parsed[0][0], value: parsed[0][1] }
          : item,
      );

      return [
        ...updated,
        ...entriesToAppend.map(([key, value]) => ({
          id: nextId.current++,
          key,
          value,
          visible: false,
        })),
      ];
    });
    setImportMessage(
      `Imported ${parsed.length} ${parsed.length === 1 ? "variable" : "variables"}.`,
    );
  }

  return (
    <section className="space-y-3" aria-labelledby="environment-heading">
      <div className="flex min-h-9 items-center justify-between gap-3">
        <div>
          <h2 id="environment-heading" className="text-base font-semibold">
            Environment variables
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Keep secrets out of your source code.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {configuredCount > 0 ? `${configuredCount} added` : "Optional"}
        </span>
      </div>

      <div className="rounded-xl border bg-card p-3 sm:p-4">
        {rows.length > 0 ? (
          <>
            <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.5rem] gap-2 px-1 pb-2 text-xs text-muted-foreground sm:grid">
              <span>Key</span>
              <span>Value</span>
              <span className="sr-only">Actions</span>
            </div>
            <ul className="space-y-3">
              {rows.map((row) => {
                const key = row.key.trim();
                const error = key
                  ? variableKeyPattern.test(key)
                    ? (keyCounts.get(key) ?? 0) > 1
                      ? "This key is already used."
                      : ""
                    : "Use letters, numbers, and underscores; the key cannot start with a number."
                  : "";

                return (
                  <li
                    key={row.id}
                    className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.5rem]"
                  >
                    <div className="min-w-0 space-y-1">
                      <label
                        htmlFor={`env-key-${row.id}`}
                        className="text-xs text-muted-foreground sm:sr-only"
                      >
                        Key
                      </label>
                      <Input
                        id={`env-key-${row.id}`}
                        value={row.key}
                        onChange={(event) =>
                          updateRow(row.id, { key: event.target.value })
                        }
                        onPaste={(event) => importEnvText(event, row)}
                        placeholder="DATABASE_URL"
                        aria-label="Variable key"
                        aria-invalid={Boolean(error)}
                        aria-describedby={
                          error ? `env-error-${row.id}` : undefined
                        }
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        className="h-10 rounded-lg font-mono text-sm"
                      />
                      {error ? (
                        <p
                          id={`env-error-${row.id}`}
                          className="text-xs text-destructive"
                        >
                          {error}
                        </p>
                      ) : null}
                    </div>

                    <div className="relative min-w-0 space-y-1">
                      <label
                        htmlFor={`env-value-${row.id}`}
                        className="text-xs text-muted-foreground sm:sr-only"
                      >
                        Value
                      </label>
                      <Input
                        id={`env-value-${row.id}`}
                        type={row.visible ? "text" : "password"}
                        value={row.value}
                        onChange={(event) =>
                          updateRow(row.id, { value: event.target.value })
                        }
                        placeholder="Value"
                        aria-label="Variable value"
                        autoComplete="off"
                        spellCheck={false}
                        className="h-10 rounded-lg pr-11 font-mono text-sm"
                      />
                      <button
                        type="button"
                        aria-label={row.visible ? "Hide value" : "Show value"}
                        aria-pressed={row.visible}
                        onClick={() =>
                          updateRow(row.id, { visible: !row.visible })
                        }
                        className="absolute right-1 top-1 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {row.visible ? (
                          <EyeSlash aria-hidden="true" className="size-4" />
                        ) : (
                          <Eye aria-hidden="true" className="size-4" />
                        )}
                      </button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${key || "environment variable"}`}
                      onClick={() => removeRow(row.id)}
                      className="justify-self-end rounded-lg text-muted-foreground hover:text-destructive sm:mt-1"
                    >
                      <Trash aria-hidden="true" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="px-1 py-2 text-sm text-muted-foreground">
            No environment variables added yet. Add any values your app needs at
            runtime.
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => addRow()}
            className="rounded-lg"
          >
            <Plus aria-hidden="true" />
            Add variable
          </Button>
          <span className="text-xs text-muted-foreground">
            Paste a .env file into a key field to import it.
          </span>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {importMessage}
        </p>
      </div>
    </section>
  );
}

function parseEnv(text: string): Array<[string, string]> {
  const entries: Array<[string, string]> = [];

  for (const rawLine of text.split(/\r?\n/)) {
    let line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    line = line.replace(/^export\s+/, "");
    const equalsIndex = line.indexOf("=");
    if (equalsIndex < 1) continue;

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/, "");
    }

    if (key) entries.push([key, value]);
  }

  return entries;
}
