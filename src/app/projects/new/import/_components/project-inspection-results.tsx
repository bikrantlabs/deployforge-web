import type { InspectionViewData } from "../../../_types/inspection";
import { BuildStepsSection } from "./build-steps-section";
import { DetectedRuntimeSection } from "./detected-runtime-section";
import { EnvironmentVariablesSection } from "./environment-variables-section";
import { ProjectInspectionHeader } from "./project-inspection-header";
import { StartCommandSection } from "./start-command-section";

export function ProjectInspectionResults({
  data,
}: {
  data: InspectionViewData;
}) {
  const { project, detection, existing } = data;

  return (
    <section className="w-full space-y-8" aria-label="Repository inspection">
      <ProjectInspectionHeader
        project={project}
        existing={existing}
        detection={detection}
      />
      {/* <DetectedRuntimeSection
        resolvedPackages={detection.resolvedPackages}
        metadata={detection.metadata}
      /> */}
      <BuildStepsSection steps={detection.steps} />
      <StartCommandSection startCommand={detection.startCommand} />
      <EnvironmentVariablesSection />
    </section>
  );
}
