import { DeploymentListSkeleton } from "@/app/deployments/_components/skeletons";

export function ProjectsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading projects" className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-56 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-9 w-32 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading project" className="space-y-6">
      <div className="h-4 w-48 animate-pulse rounded bg-muted" />

      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="h-7 w-56 animate-pulse rounded bg-muted" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>

      <DeploymentListSkeleton />
    </div>
  );
}
