import type { ReactNode } from "react";

import { CaretDownIcon } from "@phosphor-icons/react/ssr";

type CollapsibleSectionProps = {
  id: string;
  title: string;
  description?: string;
  summary?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CollapsibleSection({
  id,
  title,
  description,
  summary,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  return (
    <section aria-labelledby={`${id}-heading`}>
      <details
        className="group overflow-hidden rounded-xl border bg-card"
        open={defaultOpen}
      >
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
          <div>
            <h2 id={`${id}-heading`} className="text-base font-semibold">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
            {summary}
            <CaretDownIcon
              aria-hidden="true"
              className="size-4 transition-transform group-open:rotate-180"
            />
          </span>
        </summary>
        <div className="border-t">{children}</div>
      </details>
    </section>
  );
}
