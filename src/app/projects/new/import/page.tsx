import { Suspense } from "react";

import { ProjectImportError } from "../../_components/project-import-error";
import { ProjectImportSkeleton } from "../../_components/project-import-skeleton";
import { ProjectInspectionResults } from "../../_components/project-inspection-results";
import { inspectProject } from "../../_data/inspect-project";
import { inspectProjectSchema } from "../../_schemas";

type ImportProjectPageProps = {
  searchParams: Promise<{ sourceUrl?: string | string[] }>;
};

export default function ImportProjectPage({
  searchParams,
}: ImportProjectPageProps) {
  return (
    <Suspense fallback={<ProjectImportSkeleton />}>
      <ImportProjectContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ImportProjectContent({ searchParams }: ImportProjectPageProps) {
  const query = await searchParams;
  const sourceUrl = query.sourceUrl;

  if (typeof sourceUrl !== "string") {
    return (
      <ImportProjectLayout>
        <ProjectImportError
          title="Repository URL is missing"
          message="Return to the previous step and enter a GitHub or GitLab repository URL."
        />
      </ImportProjectLayout>
    );
  }

  const parsed = inspectProjectSchema.safeParse({ sourceUrl });

  if (!parsed.success) {
    return (
      <ImportProjectLayout>
        <ProjectImportError
          title="Repository URL is invalid"
          message="Only valid GitHub or GitLab repository URLs can be inspected."
        />
      </ImportProjectLayout>
    );
  }

  const result = await inspectProject(parsed.data.sourceUrl);

  return (
    <ImportProjectLayout>
      {result.data ? (
        <ProjectInspectionResults data={result.data} />
      ) : (
        <ProjectImportError
          title="Could not inspect this repository"
          message={result.error}
        />
      )}
    </ImportProjectLayout>
  );
}

function ImportProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-7 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Review your repository
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Review the runtime and build configuration detected for this
            repository.
          </p>
        </header>
        {children}
      </div>
    </main>
  );
}
