import Link from "next/link";
import { ArrowRight, CalendarDays, Library } from "lucide-react";
import { IssueCover } from "@/components/issue-cover";
import { PageShell } from "@/components/page-shell";
import { issues } from "@/lib/data";

export default function IssuesPage() {
  return (
    <PageShell>
      {/* Page Header */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14">
          <span className="page-badge">
            <Library className="h-3 w-3" />
            Archive
          </span>
          <h1 className="page-title">Issues & Volumes</h1>
          <p className="page-subtitle">
            Browse all published volumes and issues of the Gono Bishwabidyalay Journal of Research.
          </p>
        </div>
        <div className="page-header-accent" />
      </div>

      <section className="container-x py-8">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <IssueCover
            volume={issues[0].volume}
            issue={issues[0].issue}
            month={issues[0].month}
            theme={issues[0].theme}
          />
          <div className="grid gap-3 content-start">
            {issues.map((issue) => (
              <Link
                href={issue.id === "2026-2" ? "/issues/current" : "/issues"}
                key={issue.id}
                className="surface-elevated group relative overflow-hidden p-5"
              >
                {/* Left accent */}
                <div className="absolute inset-y-0 left-0 w-[3px] bg-[color:var(--color-gb-blue)] group-hover:bg-[color:var(--color-gb-gold)] transition-colors" />

                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-bold text-[color:var(--ink-muted)]">
                      <CalendarDays className="h-3.5 w-3.5 text-[color:var(--color-gb-gold)]" />
                      {issue.month}
                    </p>
                    <h2 className="mt-2 text-xl font-black text-[color:var(--color-gb-blue-dark)] group-hover:text-[color:var(--bangla-red)] transition-colors">
                      {issue.theme}
                    </h2>
                    <p className="mt-1.5 text-xs font-semibold text-[color:var(--ink-muted)]">
                      {issue.volume} · {issue.issue} · {issue.articleCount} articles
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[color:var(--color-gb-blue)] group-hover:text-[color:var(--color-gb-gold)] transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
