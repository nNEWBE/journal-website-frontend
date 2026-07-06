import { ClipboardCheck, ShieldCheck, UserCheck, Eye } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export default function ReviewersPage() {
  return (
    <PageShell>
      {/* Page Header */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14">
          <span className="page-badge">
            <Eye className="h-3 w-3" />
            Reviewer Guidance
          </span>
          <h1 className="page-title">Peer Review Workspace</h1>
          <p className="page-subtitle">
            Guidelines, expectations, and workflow for invited peer reviewers at Gono Bishwabidyalay Journal.
          </p>
        </div>
        <div className="page-header-accent" />
      </div>

      <section className="container-x py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: UserCheck,
              title: "Accept or Decline",
              text: "Reviewers confirm availability, conflict status, and expected deadline before files unlock.",
            },
            {
              icon: ClipboardCheck,
              title: "Structured Review",
              text: "Ratings, confidential comments, comments to author, recommendation, and attachments.",
            },
            {
              icon: ShieldCheck,
              title: "Confidential Process",
              text: "Double-blind review with editor-visible audit trail and reviewer recognition support.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="surface-elevated p-5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] group-hover:bg-[color:var(--bangla-red)] group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-black text-[color:var(--color-gb-blue-dark)]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
