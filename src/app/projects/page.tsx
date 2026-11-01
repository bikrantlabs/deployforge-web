import Link from "next/link";
import { Suspense } from "react";

import { projectApi } from "@/lib/api/projects.api";

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading projects...</div>}>
      <ProjectList />
    </Suspense>
  );
}

async function ProjectList() {
  const projects = await projectApi.getAllProjectForUser();

  if (projects.length === 0)
    return (
      <div>
        No projects yet.{" "}
        <Link href="/projects/new" className="underline">
          Create one.
        </Link>
      </div>
    );

  return (
    <div>
      <Link href="/projects/new" className="underline">
        Create new project.
      </Link>
      {projects.map((project) => (
        <div key={project.projectId}>
          <h1>{project.projectName}</h1>
          <p>{project.sourceUrl}</p>
        </div>
      ))}
    </div>
  );
}
