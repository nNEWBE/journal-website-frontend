import {
  BookMarked,
  Building2,
  GraduationCap,
  Mail,
  Quote,
  Shield,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { boardMembers } from "@/lib/data";

const disciplineColors: Record<string, { from: string; to: string; soft: string; text: string }> = {
  Law:         { from: "from-rose-600",    to: "to-red-700",     soft: "bg-rose-50",    text: "text-rose-700" },
  Agriculture: { from: "from-emerald-600", to: "to-teal-700",    soft: "bg-emerald-50", text: "text-emerald-700" },
  Pharmacy:    { from: "from-violet-600",  to: "to-purple-700",  soft: "bg-violet-50",  text: "text-violet-700" },
  Health:      { from: "from-blue-600",    to: "to-indigo-700",  soft: "bg-blue-50",    text: "text-blue-700" },
  Technology:  { from: "from-cyan-600",    to: "to-sky-700",     soft: "bg-cyan-50",    text: "text-cyan-700" },
};

function getColor(unit: string) {
  for (const key of Object.keys(disciplineColors)) {
    if (unit.toLowerCase().includes(key.toLowerCase())) return disciplineColors[key];
  }
  return { from: "from-slate-600", to: "to-slate-800", soft: "bg-slate-100", text: "text-slate-600" };
}

const policies = [
  {
    icon: Shield,
    title: "Editorial Independence",
    body: "All manuscript decisions are made solely on academic merit, without influence from commercial, institutional, or political interests.",
  },
  {
    icon: ShieldCheck,
    title: "COPE Compliance",
    body: "Our governance framework strictly follows the Committee on Publication Ethics guidelines for editorial conduct and conflict of interest.",
  },
  {
    icon: BookMarked,
    title: "Peer-Review Based Decisions",
    body: "Every submission outcome — accept, revise, or reject — is grounded exclusively in independent expert peer review reports.",
  },
];

export default function EditorialBoardPage() {
  const chief = boardMembers.find((m) => m.role === "Editor-in-Chief") || boardMembers[0];
  const managing = boardMembers.find((m) => m.role === "Managing Editor") || boardMembers[1];
  const sectionEditors = boardMembers.filter(
    (m) => m.role !== "Editor-in-Chief" && m.role !== "Managing Editor"
  );

  const chiefInitials = chief.name.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase();
  const managingInitials = managing.name.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase();

  return (
    <PageShell>
      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[color:var(--color-gb-blue-deep)]">
        <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.04]" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[color:var(--color-gb-blue)] opacity-[0.14] blur-[90px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-[color:var(--color-gb-gold)] opacity-[0.07] blur-[80px]" />

        <div className="container-x relative py-18 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/60 backdrop-blur-sm">
              <Users className="h-3.5 w-3.5 text-amber-300" />
              Academic Governance
            </span>
            <h1 className="mt-5 font-academic text-4xl font-bold leading-[1.07] tracking-[-0.03em] text-white md:text-5xl lg:text-6xl">
              Editorial board<br />
              <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
                & governance
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/55">
              Meet the academic leadership responsible for peer review, editorial standards, research ethics,
              and publication quality at the Gono Bishwabidyalay Journal of Research.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-white/10 pt-6 text-[11px] font-bold text-white/50">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                Editorial independence
              </span>
              <span className="inline-flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-amber-300" />
                Discipline-led assessment
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-amber-300" />
                Accountable decisions
              </span>
            </div>
          </div>
        </div>

        {/* Board summary bar */}
        <div className="border-t border-white/[0.07]">
          <div className="container-x grid grid-cols-2 divide-x divide-white/[0.07] md:grid-cols-4">
            {[
              { val: "1", label: "Editor-in-Chief" },
              { val: "1", label: "Managing Editor" },
              { val: String(sectionEditors.length), label: "Section Editors" },
              { val: "COPE", label: "Ethics standard" },
            ].map((s) => (
              <div key={s.label} className="py-5 pl-5 pr-4 md:py-7">
                <p className="font-academic text-2xl font-black text-white md:text-3xl">{s.val}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Executive Officers ────────────────────── */}
      <section className="container-x py-14 md:py-18">
        <div className="mb-10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gb-blue)]">
            Leadership Spotlight
          </p>
          <h2 className="mt-1.5 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
            Executive Editorial Officers
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Editor-in-Chief */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_4px_24px_rgba(11,18,61,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,18,61,0.12)]">
            {/* top gradient bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[color:var(--color-gb-blue-deep)] via-[color:var(--color-gb-blue)] to-[color:var(--color-gb-gold)]" />

            <div className="p-7">
              {/* header row */}
              <div className="flex items-start gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--color-gb-blue-deep)] to-[color:var(--color-gb-blue)] text-xl font-black text-white shadow-md">
                  {chiefInitials}
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-amber-400">
                    <Star className="h-2.5 w-2.5 fill-current text-amber-900" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-md bg-amber-100 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-800 border border-amber-200/80">
                    {chief.role}
                  </span>
                  <h3 className="mt-1.5 font-academic text-xl font-bold text-slate-900">{chief.name}</h3>
                  <p className="text-xs font-semibold text-[color:var(--color-gb-blue)] mt-0.5">{chief.unit}</p>
                </div>
              </div>

              {/* details */}
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-xs">
                <div className="flex items-start gap-2.5 text-slate-600">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span><strong className="text-slate-800">Research Specialization:</strong> {chief.expertise}</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-600">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>Gono Bishwabidyalay Executive Board</span>
                </div>
              </div>

              {/* quote block */}
              <div className="relative mt-5 rounded-xl bg-[color:var(--color-gb-blue-soft)] p-4">
                <Quote className="absolute top-2 right-3 h-8 w-8 text-[color:var(--color-gb-blue)]/10" />
                <p className="text-[11px] leading-5 text-slate-600 italic font-medium">
                  &ldquo;Scholarly rigour, ethical transparency, and community impact are the pillars of every editorial decision we make.&rdquo;
                </p>
              </div>

              <div className="mt-5 flex justify-end">
                <a
                  href={`mailto:editorial@gonouniversity.edu.bd?subject=Inquiry%20for%20${encodeURIComponent(chief.name)}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue-deep)] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[color:var(--color-gb-blue)]"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact Editor
                </a>
              </div>
            </div>
          </div>

          {/* Managing Editor */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_4px_24px_rgba(11,18,61,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,18,61,0.12)]">
            <div className="h-1.5 w-full bg-gradient-to-r from-[color:var(--color-gb-gold)] via-amber-400 to-[color:var(--color-gb-red)]" />

            <div className="p-7">
              <div className="flex items-start gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-xl font-black text-white shadow-md">
                  {managingInitials}
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[color:var(--color-gb-blue)]">
                    <BookMarked className="h-2.5 w-2.5 text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-md bg-[color:var(--color-gb-blue-soft)] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[color:var(--color-gb-blue)] border border-[color:var(--color-gb-blue)]/15">
                    {managing.role}
                  </span>
                  <h3 className="mt-1.5 font-academic text-xl font-bold text-slate-900">{managing.name}</h3>
                  <p className="text-xs font-semibold text-[color:var(--color-gb-blue)] mt-0.5">{managing.unit}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-xs">
                <div className="flex items-start gap-2.5 text-slate-600">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span><strong className="text-slate-800">Research Specialization:</strong> {managing.expertise}</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-600">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>Faculty of Pharmacy &amp; Health Operations</span>
                </div>
              </div>

              <div className="relative mt-5 rounded-xl bg-amber-50 p-4">
                <Quote className="absolute top-2 right-3 h-8 w-8 text-amber-400/20" />
                <p className="text-[11px] leading-5 text-slate-600 italic font-medium">
                  &ldquo;Operational excellence and author support are central to ensuring every submission receives timely, fair, and constructive evaluation.&rdquo;
                </p>
              </div>

              <div className="mt-5 flex justify-end">
                <a
                  href={`mailto:managing@gonouniversity.edu.bd?subject=Inquiry%20for%20${encodeURIComponent(managing.name)}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-amber-600"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact Managing Editor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section Editors ───────────────────────── */}
      <section className="bg-[#f5f7fb] py-14 md:py-18">
        <div className="container-x">
          <div className="mb-10">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gb-blue)]">
              Discipline Chairs
            </p>
            <h2 className="mt-1.5 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
              Section Editors &amp; Advisory Panel
            </h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Domain specialists who lead peer review assignment and quality control for each research discipline.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sectionEditors.map((member, idx) => {
              const color = getColor(member.unit);
              const initials = member.name.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase();
              return (
                <div
                  key={member.name}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  {/* left accent bar */}
                  <div className={`absolute inset-y-0 left-0 w-[3px] rounded-l-2xl bg-gradient-to-b ${color.from} ${color.to}`} />

                  <div className="ml-3 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color.soft} text-base font-black ${color.text}`}>
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-academic text-base font-bold text-slate-900">{member.name}</h3>
                        <p className={`text-[11px] font-extrabold ${color.text} mt-0.5`}>{member.role}</p>
                        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{member.unit}</p>
                      </div>
                    </div>
                    <a
                      href={`mailto:journal@gonouniversity.edu.bd?subject=Query%20for%20${encodeURIComponent(member.name)}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:border-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-soft)] hover:text-[color:var(--color-gb-blue)]"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <div className="ml-3 mt-4 rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-[11px] leading-5 text-slate-600 font-medium">
                      <strong className="text-slate-800">Domain Focus: </strong>
                      {member.expertise}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Governance Policies ───────────────────── */}
      <section className="container-x py-14 md:py-18">
        <div className="mb-10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gb-blue)]">
            Governance Framework
          </p>
          <h2 className="mt-1.5 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] md:text-3xl">
            Editorial Independence &amp; Ethical Integrity
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {policies.map((pol) => {
            const Icon = pol.icon;
            return (
              <div
                key={pol.title}
                className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)]">
                  <Icon className="h-5 w-5 text-[color:var(--color-gb-blue-deep)]" />
                </div>
                <h3 className="mt-4 font-academic text-base font-bold text-slate-900">{pol.title}</h3>
                <p className="mt-2 text-xs leading-5.5 text-slate-500 font-medium">{pol.body}</p>
              </div>
            );
          })}
        </div>

        {/* Full independence statement */}
        <div className="mt-6 relative overflow-hidden rounded-2xl border border-[color:var(--color-gb-blue)]/20 bg-gradient-to-br from-[color:var(--color-gb-blue-soft)] via-white to-white p-6 md:p-8">
          <Quote className="absolute top-4 right-4 h-14 w-14 text-[color:var(--color-gb-blue)]/8" />
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--color-gb-blue-deep)]">
              <ShieldCheck className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-academic text-lg font-bold text-[color:var(--color-gb-blue-deep)]">
                Independence Statement
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-600 font-medium">
                The Editorial Board of Gono Bishwabidyalay Journal of Research operates with full editorial independence.
                Decisions to accept or reject submitted manuscripts are based strictly on peer review merit, scientific rigor,
                and ethical compliance — without influence from commercial, institutional, or political interests.
                All board members adhere to COPE&rsquo;s Code of Conduct and Best Practice Guidelines for Journal Editors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
