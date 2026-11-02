import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders CMS text with a tiny inline markup so admins can keep the emphasis the
 * original copy had: `**bold**` and `[label](/href)`. Everything else is plain text.
 */
export function CmsText({
  text,
  strongClassName = "font-semibold text-slate-900",
  linkClassName = "font-semibold text-[#1e40af] hover:underline",
}: {
  text: string | undefined | null;
  strongClassName?: string;
  linkClassName?: string;
}) {
  if (!text) return null;
  const nodes: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={i++} className={strongClassName}>
          {match[1]}
        </strong>
      );
    } else {
      const href = match[3];
      const external = /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
      nodes.push(
        external ? (
          <a key={i++} href={href} className={linkClassName} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {match[2]}
          </a>
        ) : (
          <Link key={i++} href={href} className={linkClassName}>
            {match[2]}
          </Link>
        )
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
