"use client";

import React from "react";

type ImportProjectContextType = {
  projectName: string;
  environmentVariables: Record<string, string>;
  projectNameExists: boolean;
  projectCreated: boolean;
  deploymentId: string | null;

  setProjectCreated: (created: boolean) => void;
  setDeploymentId: (id: string | null) => void;
  setProjectName: (name: string) => void;
  setEnvironmentVariables: (variables: Record<string, string>) => void;
  setProjectNameExists: (exists: boolean) => void;
};

const ImportProjectContext = React.createContext<
  ImportProjectContextType | undefined
>(undefined);

type ImportProviderProps = {
  children: React.ReactNode;
};

export const ImportProjectProvider: React.FC<ImportProviderProps> = ({
  children,
}) => {
  const [projectName, setProjectName] = React.useState<string>("");
  const [environmentVariables, setEnvironmentVariables] = React.useState<
    Record<string, string>
  >({});
  const [projectNameExists, setProjectNameExists] =
    React.useState<boolean>(false);
  const [projectCreated, setProjectCreated] = React.useState<boolean>(false);

  const [deploymentId, setDeploymentId] = React.useState<string | null>(null);

  return (
    <ImportProjectContext.Provider
      value={{
        projectName,
        environmentVariables,
        projectCreated,
        deploymentId,
        setDeploymentId,
        setProjectCreated,
        setProjectName,
        setEnvironmentVariables,

        projectNameExists,
        setProjectNameExists,
      }}
    >
      {children}
    </ImportProjectContext.Provider>
  );
};

export const useImportProjectContext = (): ImportProjectContextType => {
  const context = React.useContext(ImportProjectContext);
  if (!context) {
    throw new Error("useImportContext must be used within an ImportProvider");
  }
  return context;
};
