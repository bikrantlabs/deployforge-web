export function DeploymentsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading deployments"
      className="space-y-6"
    >
      <div className="h-4 w-56 animate-pulse rounded bg-muted" />

      <header className="space-y-2">
        <div className="h-7 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 max-w-full animate-pulse rounded bg-muted" />
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-20 animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>

      <DeploymentListSkeleton />
    </div>
  );
}

export function DeploymentDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading deployment" className="space-y-6">
      <div className="h-4 w-64 animate-pulse rounded bg-muted" />

      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="size-11 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
      </header>

      <div className="h-64 animate-pulse rounded-xl border bg-card" />
    </div>
  );
}

export function DeploymentListSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 border-b px-4 py-4 last:border-b-0"
        >
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-56 animate-pulse rounded bg-muted" />
          </div>
          <div className="size-4 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
