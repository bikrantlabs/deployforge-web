"use client";

import { useActionState, useEffect } from "react";

import { cn } from "cn";
import { toast } from "sonner";

import { FieldError } from "@/components/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createProjectAction } from "../actions/create-project.action";

export function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    {},
  );
  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="flex border flex-col p-4 rounded gap-2"
    >
      <Label htmlFor="sourceUrl">Source URL(github or gitlab)</Label>
      <Input
        name="sourceUrl"
        id="sourceUrl"
        placeholder="Github or Gitlab URL"
        defaultValue={state.values?.sourceUrl}
        className={cn(state.fieldErrors?.sourceUrl ? "border-destructive" : "")}
      />
      <FieldError errors={state.fieldErrors?.sourceUrl} />
      <Label htmlFor="projectName">Project Name (must be unique)</Label>
      <Input
        name="projectName"
        id="projectName"
        placeholder="Project Name"
        defaultValue={state.values?.projectName}
        className={cn(
          state.fieldErrors?.projectName ? "border-destructive" : "",
        )}
      />
      <FieldError errors={state.fieldErrors?.projectName} />
      <Button disabled={isPending}>Import</Button>
    </form>
  );
}
