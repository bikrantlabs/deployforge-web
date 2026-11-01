import { ImportProjectForm } from "../_components/import-project-form";

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-7 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create project
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Inspect a repository to see the runtime and build configuration
            DeployForge detected before continuing.
          </p>
        </header>
        <ImportProjectForm />
      </div>
    </main>
  );
}
