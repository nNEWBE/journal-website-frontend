import Link from "next/link";
import { CheckCircle2, FileText, Send } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { articleTypes, policies } from "@/lib/data";

export default function AuthorsPage() {
  return (
    <PageShell>
      {/* Page Header */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14">
          <span className="page-badge">
            <FileText className="h-3 w-3" />
            For Authors
          </span>
          <h1 className="page-title">Submit with Confidence</h1>
          <p className="page-subtitle">
            Clear manuscript categories, ethical declarations, file requirements,
            and review expectations for Gono Bishwabidyalay journal submissions.
          </p>
          <Link
            href="/dashboard/submissions/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[color:var(--bangla-red)] hover:bg-[color:var(--color-gb-red-dark)] px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-red-900/25 transition-all"
          >
            <Send className="h-4 w-4" />
            Start Submission
          </Link>
        </div>
        <div className="page-header-accent" />
      </div>

      <section className="container-x py-8">
        {/* Article types */}
        <h2 className="text-xs font-black uppercase tracking-wider text-[color:var(--ink-muted)] mb-4">Accepted Manuscript Types</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {articleTypes.map((type) => (
            <div key={type} className="surface-elevated p-5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] group-hover:bg-[color:var(--color-gb-gold)] group-hover:text-white transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-lg font-black text-[color:var(--color-gb-blue-dark)]">
                {type}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
                Structured metadata, abstract, references, declarations, and
                source files are required. Word limits can be configured by
                admins.
              </p>
            </div>
          ))}
        </div>

        {/* Submission checklist */}
        <div className="surface-elevated mt-8 p-6">
          <h2 className="text-lg font-black text-[color:var(--color-gb-blue-dark)] flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[color:var(--color-gb-blue)]" />
            Submission Checklist
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {policies.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg bg-slate-50 border border-[color:var(--border)] p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <p className="text-sm font-semibold text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
