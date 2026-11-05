import type { InspectionViewData } from "../../../_types/inspection";
import { ImportProjectProvider } from "../import-context";
import { BuildStepsSection } from "./build-steps-section";
import { Deploy } from "./deploy";
import { DetectedRuntimeSection } from "./detected-runtime-section";
import { EnvironmentVariablesSection } from "./environment-variables-section";
import { ProjectInspectionHeader } from "./project-inspection-header";
import { ProjectNameInput } from "./project-name-input";

export function ProjectInspectionResults({
  data,
}: {
  data: InspectionViewData;
}) {
  const { project, detection, existing } = data;

  return (
    <ImportProjectProvider>
      <section className="w-full space-y-8" aria-label="Repository inspection">
        <ProjectInspectionHeader
          project={project}
          existing={existing}
          detection={detection}
        />
        <ProjectNameInput
          detectedName={project.projectName}
          existingProject={existing}
        />
        <DetectedRuntimeSection
          resolvedPackages={detection.resolvedPackages}
          metadata={detection.metadata}
        />
        <BuildStepsSection
          startCommand={detection.startCommand}
          steps={detection.steps}
        />
        <EnvironmentVariablesSection />
        <div className="flex justify-end items-center w-full">
          <Deploy project={project} />
        </div>{" "}
      </section>
    </ImportProjectProvider>
  );
}
