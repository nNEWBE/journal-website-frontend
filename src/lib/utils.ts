export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a date/time string, ISO timestamp, or Date object into a clean, human-readable date and time.
 * Example output: "Sep 20, 2026, 11:52 AM" (in client's local timezone)
 */
export function formatDateTime(dateVal?: string | Date | number | null): string {
  if (!dateVal) return "Recently";
  if (typeof dateVal === "string") {
    const trimmed = dateVal.trim();
    if (!trimmed) return "Recently";
    if (trimmed.toLowerCase() === "just now" || trimmed.toLowerCase() === "recently") {
      return trimmed;
    }
  }

  try {
    const d = typeof dateVal === "object" && dateVal instanceof Date ? dateVal : new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);

    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return String(dateVal);
  }
}

/**
 * Format a date string, ISO timestamp, or Date object into a readable date.
 * Example output: "Sep 20, 2026"
 */
export function formatDate(dateVal?: string | Date | number | null): string {
  if (!dateVal) return "";
  if (typeof dateVal === "string") {
    const trimmed = dateVal.trim();
    if (!trimmed) return "";
    if (
      trimmed.includes("days") ||
      trimmed.toLowerCase() === "just now" ||
      trimmed.toLowerCase() === "recently"
    ) {
      return trimmed;
    }
  }

  try {
    const d = typeof dateVal === "object" && dateVal instanceof Date ? dateVal : new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(dateVal);
  }
}

