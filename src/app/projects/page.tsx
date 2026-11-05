import Link from "next/link";
import { Suspense } from "react";

import {
  CubeIcon,
  PlusIcon,
  RocketLaunchIcon,
} from "@phosphor-icons/react/dist/ssr";

import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { projectApi } from "@/lib/api/projects.api";
import { allDeploymentsPath } from "@/lib/project-routes";

import { ProjectCard } from "./_components/project-card";
import { ProjectsSkeleton } from "./_components/skeletons";

export const metadata = {
  title: "Projects · DeployForge",
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectList />
      </Suspense>
    </PageShell>
  );
}

async function ProjectList() {
  const projects = await projectApi.getAllProjectForUser();

  return (
    <>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length === 0
              ? "Connect a repository to start deploying with DeployForge."
              : `${projects.length} ${projects.length === 1 ? "project" : "projects"} connected to DeployForge.`}
          </p>
        </div>
        <div className="flex w-fit flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="lg" className="rounded-lg">
            <Link href={allDeploymentsPath}>
              <RocketLaunchIcon aria-hidden="true" weight="duotone" />
              Deployments
            </Link>
          </Button>
          <Button asChild size="lg" className="rounded-lg">
            <Link href="/projects/new">
              <PlusIcon aria-hidden="true" weight="bold" />
              New project
            </Link>
          </Button>
        </div>
      </header>

      {projects.length === 0 ? (
        <EmptyProjects />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.projectId}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function EmptyProjects() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-background/40 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full border bg-card text-muted-foreground">
        <CubeIcon aria-hidden="true" className="size-6" weight="duotone" />
      </span>
      <div className="space-y-1.5">
        <h2 className="text-sm font-medium">No projects yet</h2>
        <p className="mx-auto max-w-sm text-xs text-muted-foreground">
          Import a GitHub or GitLab repository and DeployForge will detect its
          runtime, build steps, and start command.
        </p>
      </div>
      <Button asChild className="rounded-lg">
        <Link href="/projects/new">
          <PlusIcon aria-hidden="true" weight="bold" />
          Import a repository
        </Link>
      </Button>
    </div>
  );
}
