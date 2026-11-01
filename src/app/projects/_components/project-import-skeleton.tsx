export function ProjectImportSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Inspecting repository"
      className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 sm:py-16"
    >
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-7 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Inspecting repository
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Detecting the runtime, package manager, and start command. Results
            will appear here when the inspection is complete.
          </p>
        </header>

        <div className="space-y-6 rounded-xl border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="size-10 animate-pulse rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-muted" />
              <div className="h-3 w-52 animate-pulse rounded bg-muted" />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="h-5 w-36 animate-pulse rounded bg-muted" />
              <div className="space-y-3 rounded-xl border p-4">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-16 animate-pulse rounded-xl bg-muted" />
            </div>
            <div className="space-y-4">
              <div className="h-5 w-28 animate-pulse rounded bg-muted" />
              <div className="space-y-4 rounded-xl border p-4">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}
