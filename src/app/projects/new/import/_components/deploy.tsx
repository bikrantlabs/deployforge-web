"use client";

import { startTransition, useActionState, useEffect } from "react";

import { toast } from "sonner";

import { Button } from "@/app/_components/ui/button";
import { deployAction } from "@/app/projects/_actions/deploy.action";
import type { Project } from "@/lib/api/response";

import { useImportProjectContext } from "../import-context";

export function Deploy({ project }: { project: Omit<Project, "userId"> }) {
  const {
    projectNameExists,
    projectName,
    setProjectCreated,
    environmentVariables,
    setDeploymentId,
  } = useImportProjectContext();
  const [state, formAction, isPending] = useActionState(deployAction, {
    data: null,
  });

  useEffect(() => {
    if (!state.message || state.success === undefined) {
      setProjectCreated(false);
      return;
    }
    if (state.success) {
      setProjectCreated(true);
      setDeploymentId(state.data?.data.deployment.deploymentId ?? null);
      toast.success(state.message);
    } else {
      setProjectCreated(false);
      toast.error(state.message);
    }
  }, [state, setProjectCreated, setDeploymentId]);

  function handleClick() {
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
