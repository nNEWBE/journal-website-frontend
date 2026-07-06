import { Mail, Users, User } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { boardMembers } from "@/lib/data";

export default function EditorialBoardPage() {
  return (
    <PageShell>
      {/* Page Header */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14">
          <span className="page-badge">
            <Users className="h-3 w-3" />
            Governance
          </span>
          <h1 className="page-title">Editorial Board</h1>
          <p className="page-subtitle">
            Meet the academic leadership overseeing peer review, editorial standards, and publication quality.
          </p>
        </div>
        <div className="page-header-accent" />
      </div>

      <section className="container-x py-8">
        <div className="grid gap-4 md:grid-cols-2">
          {boardMembers.map((member) => (
            <div key={member.name} className="surface-elevated p-5 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Avatar placeholder */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] group-hover:bg-[color:var(--color-gb-blue)] group-hover:text-white transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[color:var(--color-gb-blue-dark)]">
                      {member.name}
                    </h2>
                    <p className="mt-0.5 text-sm font-bold text-[color:var(--bangla-red)]">
                      {member.role}
                    </p>
                  </div>
                </div>
                <button className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] bg-white hover:bg-slate-50 text-[color:var(--ink-muted)] hover:text-[color:var(--color-gb-blue)] transition-colors cursor-pointer">
                  <Mail className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 pl-[3.75rem]">
                <p className="text-xs font-bold text-[color:var(--color-gb-blue)] uppercase tracking-wider">
                  {member.unit}
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--ink-muted)]">
                  {member.expertise}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
