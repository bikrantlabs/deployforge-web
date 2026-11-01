"use client";

import Link from "next/link";

import {
  ArrowLeftIcon,
  ArrowSquareOutIcon,
  CheckCircle,
  Package,
  Terminal,
  WarningCircle,
} from "@phosphor-icons/react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

import type { InspectionViewData } from "../_types/inspection";

export function ProjectInspectionResults({
  data,
}: {
  data: InspectionViewData;
}) {
  const { project, detection, existing } = data;
  const metadata = Object.entries(detection.metadata);

  return (
    <section aria-labelledby="inspection-title" className="w-full space-y-5">
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
              <CheckCircle
                aria-hidden="true"
                className="size-3.5 text-emerald-600 dark:text-emerald-400"
              />
              {existing ? "Already in DeployForge" : "Repository inspected"}
            </span>
            {detection.providers.map((provider) => (
              <span
                key={provider}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
              >
                {provider}
              </span>
            ))}
          </div>
          <h2
            id="inspection-title"
            className="truncate text-2xl font-semibold tracking-tight"
          >
            {project.projectName}
          </h2>
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-full items-center gap-1.5 break-all text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
          >
            <span className="truncate">{project.sourceUrl}</span>
            <ArrowSquareOutIcon
              aria-hidden="true"
              className="size-3.5 shrink-0"
            />
          </a>
        </div>

        <Link href="/projects/new">
          <Button variant="outline" className="w-full shrink-0 sm:w-auto">
            <ArrowLeftIcon aria-hidden="true" />
            Inspect another
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section
          className="min-w-0 space-y-3"
          aria-labelledby="runtime-heading"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 id="runtime-heading" className="text-base font-semibold">
              Detected runtime
            </h3>
            <span className="text-xs text-muted-foreground">
              {detection.packages.length}{" "}
              {detection.packages.length === 1 ? "package" : "packages"}
            </span>
          </div>
          {detection.packages.length > 0 ? (
            <ul className="divide-y rounded-xl border">
              {detection.packages.map((item) => (
                <li
                  key={`${item.name}-${item.resolvedVersion}`}
                  className="flex gap-3 p-4"
                >
                  <Package
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="font-mono text-sm tabular-nums">
                        {item.resolvedVersion}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Requested {item.requestedVersion}
                      {item.source ? ` · ${item.source}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border p-4 text-sm text-muted-foreground">
              No runtime packages were detected.
            </p>
          )}

          <div className="space-y-2 pt-1">
            <h3 className="text-sm font-semibold">Start command</h3>
            {detection.startCommand ? (
              <div className="flex min-w-0 items-start gap-2 rounded-xl bg-muted p-3">
                <Terminal
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                />
                <code className="min-w-0 break-all text-sm">
                  {detection.startCommand}
                </code>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No start command was detected.
              </p>
            )}
          </div>
        </section>

        <section
          className="min-w-0 space-y-3"
          aria-labelledby="details-heading"
        >
          <h3 id="details-heading" className="text-base font-semibold">
            Build details
          </h3>
          {metadata.length > 0 ? (
            <dl className="divide-y rounded-xl border">
              {metadata.map(([key, value]) => (
                <div
                  key={key}
                  className="grid gap-1 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-4"
                >
                  <dt className="text-sm text-muted-foreground">
                    {formatLabel(key)}
                  </dt>
                  <dd className="wrap-break-word text-sm font-medium sm:text-right">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="rounded-xl border p-4 text-sm text-muted-foreground">
              No additional build details were detected.
            </p>
          )}
        </section>
      </div>

      <section className="space-y-3" aria-labelledby="logs-heading">
        <div className="flex items-center justify-between gap-3">
          <h3 id="logs-heading" className="text-base font-semibold">
            Inspection log
          </h3>
          <span className="text-xs text-muted-foreground">
            {detection.logs.length}{" "}
            {detection.logs.length === 1 ? "message" : "messages"}
          </span>
        </div>
        {detection.logs.length > 0 ? (
          <ul className="space-y-2">
            {detection.logs.map((log, index) => {
              const isProblem = /warn|error/i.test(log.level);
              const LogIcon = isProblem ? WarningCircle : CheckCircle;

              return (
                <li
                  key={`${log.level}-${log.message}-${index}`}
                  className="flex min-w-0 items-start gap-3 rounded-lg bg-muted/60 px-3 py-2.5 text-sm"
                >
                  <LogIcon
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      isProblem
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-muted-foreground",
                    )}
                  />
                  <span className="wrap-break-word min-w-0 flex-1">
                    {log.message}
                  </span>
                  <span className="shrink-0 text-xs capitalize text-muted-foreground">
                    {log.level}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-xl border p-4 text-sm text-muted-foreground">
            No inspection messages were returned.
          </p>
        )}
      </section>
    </section>
  );
}

function formatLabel(value: string) {
  return value
    .replaceAll(/([\da-z])([A-Z])/g, "$1 $2")
    .replaceAll(/[_-]+/g, " ")
    .replace(/^\w/, (character) => character.toUpperCase());
}
