import type { Icon } from "@phosphor-icons/react";
import {
  CheckCircleIcon,
  ClockIcon,
  MinusCircleIcon,
  PackageIcon,
  QuestionIcon,
  SpinnerGapIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "cn";

import type { DeploymentStatus } from "@/lib/api/response";

type StatusMeta = {
  label: string;
  icon: Icon;
  badgeClassName: string;
  iconClassName: string;
  spin?: boolean;
};

const STATUS_META: Record<DeploymentStatus, StatusMeta> = {
  queued: {
    label: "Queued",
    icon: ClockIcon,
    badgeClassName:
      "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300",
    iconClassName:
      "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300",
  },
  building: {
    label: "Building",
    icon: SpinnerGapIcon,
    spin: true,
    badgeClassName:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
    iconClassName:
      "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
  },
  built: {
    label: "Built",
    icon: PackageIcon,
    badgeClassName:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300",
    iconClassName:
      "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300",
  },
  live: {
    label: "Live",
    icon: CheckCircleIcon,
    badgeClassName:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
    iconClassName:
      "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  failed: {
    label: "Failed",
    icon: XCircleIcon,
    badgeClassName:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
    iconClassName:
      "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
  },
  cancelled: {
    label: "Cancelled",
    icon: MinusCircleIcon,
    badgeClassName:
      "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400",
    iconClassName:
      "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400",
  },
};

const UNKNOWN_STATUS: StatusMeta = {
  label: "Unknown",
  icon: QuestionIcon,
  badgeClassName:
    "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400",
  iconClassName:
    "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400",
};

export function getStatusMeta(status: DeploymentStatus | null): StatusMeta {
  if (!status) return UNKNOWN_STATUS;

  return STATUS_META[status] ?? UNKNOWN_STATUS;
}

export function DeploymentStatusBadge({
  status,
  className,
}: {
  status: DeploymentStatus | null;
  className?: string;
}) {
  const meta = getStatusMeta(status);
  const StatusIcon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        meta.badgeClassName,
        className,
      )}
    >
      <StatusIcon
        aria-hidden="true"
        weight="fill"
        className={cn("size-3.5", meta.spin && "animate-spin")}
      />
      {meta.label}
    </span>
  );
}
