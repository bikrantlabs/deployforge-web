"use client";

import { useState } from "react";

import { CaretDownIcon, CheckCircle, Terminal } from "@phosphor-icons/react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

import type { InspectionViewData } from "../../../_types/inspection";

type BuildStepsSectionProps = Pick<InspectionViewData["detection"], "steps">;

export function BuildStepsSection({ steps }: BuildStepsSectionProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(
    () => new Set(),
  );
  const allExpanded = steps.length > 0 && expandedSteps.size === steps.length;
  const commandCount = steps.reduce(
    (total, step) => total + step.commands.length,
    0,
  );

  function toggleAll() {
    setExpandedSteps(
      allExpanded ? new Set() : new Set(steps.map((_, index) => index)),
    );
  }

  function toggleStep(index: number) {
    setExpandedSteps((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <section className="space-y-3" aria-labelledby="steps-heading">
      <div className="flex min-h-9 items-center justify-between gap-3">
        <div>
          <h2 id="steps-heading" className="text-base font-semibold">
            Build steps
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {steps.length} {steps.length === 1 ? "step" : "steps"} ·{" "}
            {commandCount} {commandCount === 1 ? "command" : "commands"}
          </p>
        </div>
        {steps.length > 1 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-lg"
            onClick={toggleAll}
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </Button>
        ) : null}
      </div>

      {steps.length > 0 ? (
        <ol className="space-y-2.5">
          {steps.map((step, index) => {
            const expanded = expandedSteps.has(index);
            const commandsId = `step-commands-${index}`;

            return (
              <li key={`${step.name}-${index}`} className="relative pl-10">
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-3 left-[0.8rem] top-8 w-px bg-border"
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-2 grid size-7 place-items-center rounded-full border bg-background text-xs font-medium text-muted-foreground",
                    expanded && "border-foreground/30 text-foreground",
                  )}
                >
                  {expanded ? <CheckCircle className="size-4" /> : index + 1}
                </span>

                <div className="overflow-hidden rounded-xl border bg-card">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={commandsId}
                    onClick={() => toggleStep(index)}
                    className="flex min-h-12 w-full min-w-0 items-center gap-3 px-4 py-3 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  >
                    <span className="shrink-0 text-sm font-semibold capitalize">
                      {step.name}
                    </span>
                    <span className="hidden min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground sm:block">
                      {step.commands.at(-1) ?? "No commands"}
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      {step.commands.length}{" "}
                      {step.commands.length === 1 ? "command" : "commands"}
                    </span>
                    <CaretDownIcon
                      aria-hidden="true"
                      className={cn(
                        "ml-auto size-4 shrink-0 text-muted-foreground transition-transform",
                        expanded && "rotate-180",
                      )}
                    />
                  </button>

                  <div
                    id={commandsId}
                    hidden={!expanded}
                    className="border-t p-2.5"
                  >
                    {expanded ? (
                      step.commands.length > 0 ? (
                        <ul className="space-y-1.5">
                          {step.commands.map((command, commandIndex) => (
                            <li
                              key={`${command}-${commandIndex}`}
                              className="flex min-w-0 items-start gap-2.5 rounded-lg bg-muted/70 px-3 py-2.5"
                            >
                              <Terminal
                                aria-hidden="true"
                                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                              />
                              <code className="min-w-0 break-all font-mono text-xs leading-relaxed sm:text-sm">
                                {command}
                              </code>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="px-2 py-1 text-sm text-muted-foreground">
                          No commands were provided for this step.
                        </p>
                      )
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
          No install or build steps were detected.
        </p>
      )}
    </section>
  );
}
