const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/** Formats an ISO timestamp for display, returning an em dash when missing. */
export function formatDateTime(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return dateTimeFormatter.format(date);
}

/** Renders the elapsed time between two ISO timestamps, e.g. "2m 14s". */
export function formatDuration(start?: string | null, end?: string | null) {
  if (!start || !end) return "—";

  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "—";

  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/** Shortens long identifiers so they fit comfortably in tables and headings. */
export function shortId(id?: string | null) {
  if (!id) return "—";

  return id.length > 8 ? id.slice(0, 8) : id;
}

/** Turns a repository URL into a compact "github.com/owner/repo" label. */
export function repoLabel(url?: string | null) {
  if (!url) return "—";

  return url
    .replace(/^https?:\/\//, "")
    .replace(/\.git$/, "")
    .replace(/\/$/, "");
}
