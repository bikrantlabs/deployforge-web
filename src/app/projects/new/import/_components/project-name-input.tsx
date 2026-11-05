"use client";

import { useEffect } from "react";

import { cn } from "cn";

import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";

import { useImportProjectContext } from "../import-context";

export function ProjectNameInput({
  detectedName,
  existingProject,
}: {
  detectedName: string;
  existingProject: boolean;
}) {
  const { projectName, setProjectName, setProjectNameExists } =
    useImportProjectContext();

  useEffect(() => {
    setProjectName(detectedName);
  }, [detectedName, setProjectName]);

  const hasConflict = existingProject && projectName === detectedName;

  useEffect(() => {
    setProjectNameExists(hasConflict);
  }, [hasConflict, setProjectNameExists]);

  return (
    <div className="space-y-2">
      <Label htmlFor="projectName" className={cn("font-semibold text-base")}>
        Project Name{" "}
        <span className={cn("text-sm font-normal")}>(Must be unique)</span>
      </Label>
      <Input
        id="projectName"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        aria-invalid={hasConflict}
        aria-describedby={hasConflict ? "projectName-error" : undefined}
        className={cn(
          hasConflict &&
            "border-destructive text-destructive focus-visible:border-destructive focus-visible:ring-destructive/30",
        )}
      />
      {hasConflict && (
        <p id="projectName-error" className="text-sm text-destructive">
          You already have a project with this name, rename to something new.
        </p>
      )}
    </div>
  );
}
