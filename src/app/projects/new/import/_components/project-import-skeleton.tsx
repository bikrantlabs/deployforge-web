export function ProjectImportSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Inspecting repository"
      className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 sm:py-16"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="space-y-8">
          <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-7 w-36 animate-pulse rounded-full bg-muted" />
                <div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-8 w-64 max-w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-72 max-w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="h-9 w-full animate-pulse rounded-lg bg-muted sm:w-24" />
          </header>

          <section aria-label="Build steps loading" className="space-y-3">
            <div className="flex min-h-9 items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                <div className="h-3 w-36 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-7 w-24 animate-pulse rounded bg-muted" />
            </div>

            <ol className="space-y-2.5">
              {[0, 1].map((step) => (
                <li key={step} className="relative pl-10">
                  {step === 0 ? (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-3 left-[0.8rem] top-8 w-px bg-border"
                    />
                  ) : null}
                  <div className="absolute left-0 top-2 size-7 animate-pulse rounded-full bg-muted" />
                  <div className="overflow-hidden rounded-xl border bg-card">
                    <div className="flex min-h-12 items-center gap-3 px-4 py-3">
                      <div className="h-4 w-14 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                      <div className="ml-auto hidden h-3 w-36 animate-pulse rounded bg-muted sm:block" />
                      <div className="size-4 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-label="Start command loading" className="space-y-3">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="flex h-12 items-center gap-3 rounded-xl border bg-card px-4">
              <div className="size-4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-48 max-w-full animate-pulse rounded bg-muted" />
            </div>
          </section>

          <section
            aria-label="Environment variables loading"
            className="space-y-3"
          >
            <div className="flex min-h-9 items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="h-5 w-44 animate-pulse rounded bg-muted" />
                <div className="h-3 w-52 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-3 w-14 animate-pulse rounded bg-muted" />
            </div>
            <div className="rounded-xl border bg-card p-3 sm:p-4">
              <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.5rem] gap-2 px-1 pb-2 sm:grid">
                <div className="h-3 w-8 animate-pulse rounded bg-muted" />
                <div className="h-3 w-12 animate-pulse rounded bg-muted" />
              </div>
              <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.5rem]">
                <div className="h-10 animate-pulse rounded-lg bg-muted" />
                <div className="h-10 animate-pulse rounded-lg bg-muted" />
                <div className="h-8 w-8 justify-self-end animate-pulse rounded-lg bg-muted sm:mt-1" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3">
                <div className="h-7 w-28 animate-pulse rounded bg-muted" />
                <div className="hidden h-3 w-52 animate-pulse rounded bg-muted sm:block" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
