import { TerminalIcon } from "@phosphor-icons/react/ssr";

import type { InspectionViewData } from "../../../_types/inspection";
import { CollapsibleSection } from "./collapsible-section";

type BuildStepsSectionProps = Pick<
  InspectionViewData["detection"],
  "steps" | "startCommand"
>;

export function BuildStepsSection({
  steps,
  startCommand,
}: BuildStepsSectionProps) {
  const totalCommands =
    steps.reduce((total, step) => total + step.commands.length, 0) +
    (startCommand ? 1 : 0);

  return (
    <CollapsibleSection
      id="build-start"
      summary={`${totalCommands} ${
        totalCommands === 1 ? "command" : "commands"
      }`}
      title="Build and Start Commands"
    >
      <div className="space-y-3 p-3 sm:p-4">
        {steps.length > 0 || startCommand ? (
          <>
            {steps.map((step, index) => (
              <CommandGroup
                commands={step.commands}
                index={index}
                key={`${step.name}-${index}`}
                label={step.name}
              />
            ))}
            {startCommand ? (
              <CommandGroup
                commands={[startCommand]}
                index={steps.length}
                label="Start"
              />
            ) : null}
          </>
        ) : (
          <p className="px-1 py-2 text-sm text-muted-foreground">
            No install, build, or start commands were detected.
          </p>
        )}
      </div>
    </CollapsibleSection>
  );
}

function CommandGroup({
  label,
  index,
  commands,
}: {
  label: string;
  index: number;
  commands: string[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex min-h-12 items-center gap-3 px-4 py-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-full border bg-background text-xs font-medium text-muted-foreground">
          {index + 1}
        </span>
        <span className="shrink-0 text-sm font-semibold capitalize">
          {label}
        </span>
        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
          {commands.length} {commands.length === 1 ? "command" : "commands"}
        </span>
      </div>

      <div className="border-t p-2.5">
        {commands.length > 0 ? (
          <ul className="space-y-1.5">
            {commands.map((command, commandIndex) => (
              <li
                key={`${command}-${commandIndex}`}
                className="flex min-w-0 items-start gap-2.5 rounded-lg bg-muted/70 px-3 py-2.5"
              >
                <TerminalIcon
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
        )}
      </div>
    </div>
  );
}
