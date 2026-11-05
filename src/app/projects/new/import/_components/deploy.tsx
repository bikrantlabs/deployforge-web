"use client";

import { startTransition, useActionState, useEffect } from "react";

import { toast } from "sonner";

import { Button } from "@/app/_components/ui/button";
import { deployAction } from "@/app/projects/_actions/deploy.action";
import type { Project } from "@/lib/api/response";

import { useImportProjectContext } from "../import-context";

export function Deploy({ project }: { project: Omit<Project, "userId"> }) {
  const { projectNameExists, projectName, environmentVariables } =
    useImportProjectContext();
  const [state, formAction, isPending] = useActionState(deployAction, {});

  useEffect(() => {
    if (!state.message || state.success === undefined) return;
    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);
  // TODO: if state is success, redirect to the page that connects with SSE.
  // FIX Deploying bug first.
  function handleClick() {
    // The dispatch must run inside a transition when not used via <form action>
    startTransition(() => {
      formAction({
        project: {
          projectId: project.projectId,
          projectName,
          sourceUrl: project.sourceUrl,
        },
        envVariables: environmentVariables,
      });
    });
  }

  return (
    <Button onClick={handleClick} disabled={projectNameExists || isPending}>
      Deploy
    </Button>
  );
}
