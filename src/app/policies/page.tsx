import { ShieldCheck, Scale } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { policies } from "@/lib/data";

export default function PoliciesPage() {
  return (
    <PageShell>
      {/* Page Header */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14">
          <span className="page-badge">
            <Scale className="h-3 w-3" />
            Publication Ethics
          </span>
          <h1 className="page-title">Policies</h1>
          <p className="page-subtitle">
            Our commitment to research integrity, ethical peer review, and transparent publishing practices.
          </p>
        </div>
        <div className="page-header-accent" />
      </div>

      <section className="container-x py-8">
        <div className="surface-elevated p-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-[color:var(--color-gb-blue-dark)] flex items-center gap-2 mb-5">
            <ShieldCheck className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
            Publication Ethics & Standards
          </h2>
          <div className="grid gap-3">
            {policies.map((policy, index) => (
              <div
                key={policy}
                className="flex gap-3.5 rounded-lg border border-[color:var(--border)] bg-slate-50/50 p-4 hover:border-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-soft)] transition-all group"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[color:var(--color-gb-blue-soft)] text-[10px] font-black text-[color:var(--color-gb-blue)] group-hover:bg-[color:var(--color-gb-blue)] group-hover:text-white transition-colors">
                  {index + 1}
                </span>
                <p className="font-semibold leading-6 text-slate-600 text-sm">
                  {policy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
