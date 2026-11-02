import type { InspectionViewData } from "../../../_types/inspection";

type StartCommandSectionProps = Pick<
  InspectionViewData["detection"],
  "startCommand"
>;

export function StartCommandSection({
  startCommand,
}: StartCommandSectionProps) {
  return (
    <section className="space-y-3" aria-labelledby="start-command-heading">
      <h2 id="start-command-heading" className="text-base font-semibold">
        Start command
      </h2>
      {startCommand ? (
        <div className="flex min-w-0 items-start gap-3 rounded-xl border bg-card px-4 py-3.5">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          >
            <path d="m4 17 6-6-6-6m8 14h8" />
          </svg>
          <code className="min-w-0 break-all font-mono text-sm leading-relaxed">
            {startCommand}
          </code>
        </div>
      ) : (
        <p className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
          No start command was detected.
        </p>
      )}
    </section>
  );
}
