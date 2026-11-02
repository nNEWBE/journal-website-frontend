/** "Volume 4, Issue 2" from whichever parts the issue has ("" when it has none). */
export function volumeIssueLabel(iss: { volume?: string; issue?: string }, separator = ", ") {
  return [iss.volume, iss.issue].filter(Boolean).join(separator);
}

/** "July 2026" from whichever parts the issue has ("" when it has none). */
export function issueDateLabel(iss: { month?: string; year?: string | number }) {
  return [iss.month, iss.year].filter(Boolean).join(" ");
}
