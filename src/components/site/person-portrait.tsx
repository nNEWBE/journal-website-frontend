import Image from "next/image";
import { cn } from "@/lib/utils";

function initialsOf(name: string) {
  const parts = name
    .replace(/^((Prof|Dr|Mr|Mrs|Ms)\.?\s+)+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return `${first}${last}`.toUpperCase() || "GB";
}

/**
 * A person's photo inside a sized frame (the caller sets width / aspect ratio via
 * `className`). Without a photo it shows the person's initials instead of a stock image.
 */
export function PersonPortrait({
  src,
  name,
  sizes,
  priority,
  className,
  imageClassName,
  dark = false,
}: {
  src?: string | null;
  name: string;
  sizes: string;
  priority?: boolean;
  /** Frame size and border, e.g. "w-32 aspect-4/5". */
  className?: string;
  imageClassName?: string;
  /** Initials tile for dark surfaces. */
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden border",
        dark ? "border-white/20 bg-slate-900" : "border-slate-200/90 bg-slate-100",
        className
      )}
    >
      {src ? (
        <Image src={src} alt={name} fill sizes={sizes} priority={priority} className={cn("object-cover object-top", imageClassName)} />
      ) : (
        <span
          role="img"
          aria-label={name}
          className={cn(
            "absolute inset-0 flex items-center justify-center font-academic text-2xl font-medium",
            dark ? "text-slate-300" : "text-slate-400"
          )}
        >
          {initialsOf(name)}
        </span>
      )}
    </div>
  );
}
