import type { InspectionViewData } from "../../../_types/inspection";

type DetectedRuntimeSectionProps = Pick<
  InspectionViewData["detection"],
  "resolvedPackages" | "metadata"
>;

export function DetectedRuntimeSection({
  resolvedPackages,
  metadata,
}: DetectedRuntimeSectionProps) {
  const metadataEntries = Object.entries(metadata);

  return (
    <section aria-labelledby="runtime-heading">
      <details className="group overflow-hidden rounded-xl border bg-card" open>
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
          <h2 id="runtime-heading" className="text-base font-semibold">
            Detected runtime
          </h2>
          <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
            {resolvedPackages.length}{" "}
            {resolvedPackages.length === 1 ? "package" : "packages"}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 transition-transform group-open:rotate-180"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </summary>

        <div className="space-y-4 border-t px-4 py-4">
          {resolvedPackages.length > 0 ? (
            <ul className="flex flex-wrap gap-2.5">
              {resolvedPackages.map((item) => (
                <li
                  key={`${item.name}-${item.resolvedVersion}`}
                  className="flex min-w-40 items-baseline gap-3 rounded-xl border bg-card px-3.5 py-3"
                >
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {item.resolvedVersion}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No runtime packages were detected.
            </p>
          )}

          {metadataEntries.length > 0 ? (
            <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {metadataEntries.map(([key, value]) => (
                <div key={key} className="flex items-baseline gap-1.5">
                  <dt className="text-muted-foreground">
                    {formatMetadataLabel(key)}
                  </dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </details>
    </section>
  );
}

function formatMetadataLabel(value: string) {
  if (value.endsWith("PackageManager")) return "Package manager";
  if (value.endsWith("Runtime")) return "Runtime";
  if (value === "providers") return "Provider";
  return formatLabel(value);
}

function formatLabel(value: string) {
  return value
    .replaceAll(/([\da-z])([A-Z])/g, "$1 $2")
    .replaceAll(/[_-]+/g, " ")
    .replaceAll(/\b\w/g, (character) => character.toUpperCase());
}
