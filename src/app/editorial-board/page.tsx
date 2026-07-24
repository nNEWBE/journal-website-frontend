import Image from "next/image";
import {
  Award,
  BookMarked,
  BookOpen,
  Building2,
  CalendarDays,
  FileCheck2,
  Globe2,
  GraduationCap,
  Landmark,
  Mail,
  Quote,
  Scale,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { HeroActionButton } from "@/components/ui/hero-action-button";
import { SupportingTag, Badge } from "@/components/ui/badge";
import { boardMembers } from "@/lib/data";

const disciplineColors: Record<
  string,
  { soft: string; text: string; border: string }
> = {
  Law: {
    soft: "bg-rose-50/80",
    text: "text-rose-700",
    border: "border-rose-200/60",
  },
  Agriculture: {
    soft: "bg-emerald-50/80",
    text: "text-emerald-700",
    border: "border-emerald-200/60",
  },
  Pharmacy: {
    soft: "bg-violet-50/80",
    text: "text-violet-700",
    border: "border-violet-200/60",
  },
  Health: {
    soft: "bg-blue-50/80",
    text: "text-blue-700",
    border: "border-blue-200/60",
  },
  Technology: {
    soft: "bg-cyan-50/80",
    text: "text-cyan-700",
    border: "border-cyan-200/60",
  },
};

function getDisciplineTheme(unit: string) {
  for (const key of Object.keys(disciplineColors)) {
    if (unit.toLowerCase().includes(key.toLowerCase()))
      return disciplineColors[key];
  }
  return {
    soft: "bg-slate-100/80",
    text: "text-slate-700",
    border: "border-slate-200/60",
  };
}

const governancePrinciples = [
  {
    icon: ShieldCheck,
    title: "Editorial Independence",
    description:
      "All manuscript decisions are made strictly on academic merit, without influence from commercial, institutional, or political interests.",
  },
  {
    icon: Scale,
    title: "COPE Code of Conduct",
    description:
      "Our governance framework strictly follows the Committee on Publication Ethics guidelines for editorial behavior and conflict disclosure.",
  },
  {
    icon: BookOpen,
    title: "Peer-Review Based Outcomes",
    description:
      "Every submission outcome—accept, revise, or reject—is grounded exclusively in independent expert double-blind peer review reports.",
  },
];

export default function EditorialBoardPage() {
  const chief =
    boardMembers.find((m) => m.role === "Editor-in-Chief") || boardMembers[0];
  const managing =
    boardMembers.find((m) => m.role === "Managing Editor") || boardMembers[1];
  const sectionEditors = boardMembers.filter(
    (m) => m.role !== "Editor-in-Chief" && m.role !== "Managing Editor"
  );

  return (
    <PageShell>
      {/* ── Editorial Header (Kept intact & unified) ── */}
      <EditorialPageHeader
        icon={Users}
        eyebrow="Academic Governance"
        title="Editorial board & leadership"
        description="Meet the academic leadership and subject-matter specialists responsible for peer review, editorial standards, research ethics, and publication quality at the Gono Bishwabidyalay Journal of Research."
        supporting={
          <>
            <SupportingTag icon={ShieldCheck}>
              Editorial independence
            </SupportingTag>
            <SupportingTag icon={GraduationCap}>
              Discipline-led assessment
            </SupportingTag>
            <SupportingTag icon={Users}>Accountable decisions</SupportingTag>
          </>
        }
        frameworkCard={{
          eyebrow: "Editorial Standards",
          title: "Governance Model",
          icon: ShieldCheck,
          featured: {
            tag: "Standard",
            title: "COPE-Aligned Practice",
            badge: "Verified",
            icon: Award,
          },
          items: [
            {
              label: "Review Model",
              val: "Double Blind",
              icon: ShieldCheck,
            },
            {
              label: "Decision Basis",
              val: "Academic Merit",
              icon: BookOpen,
            },
            {
              label: "Conflict Policy",
              val: "Mandatory Disclosure",
              icon: Scale,
            },
          ],
        }}
      />

      {/* ── Main Content Container ── */}
      <div className="bg-[#fbfcff] py-12 md:py-16">
        <div className="container-x space-y-16">
          {/* ── Section 1: Executive Leadership Spotlight ── */}
          <section aria-labelledby="executive-leadership-heading">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] font-extrabold tracking-[0.08em] text-slate-400">
                01
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[color:var(--color-gb-gold-dark)]">
                Leadership Spotlight
              </span>
            </div>
            <h2
              id="executive-leadership-heading"
              className="mt-3 font-academic text-3xl font-bold tracking-[-0.03em] text-[color:var(--color-gb-blue-deep)] md:text-4xl"
            >
              Executive Editorial Officers
            </h2>
            <p className="mt-2.5 max-w-2xl text-xs leading-6 text-slate-600 md:text-sm">
              Senior academic leadership overseeing editorial policy, double-blind review integrity, and stewardship of the published record.
            </p>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {/* Editor-in-Chief Card */}
              <article className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_12px_36px_rgba(11,18,61,0.05)] transition-all duration-300 hover:border-slate-300 hover:shadow-[0_18px_48px_rgba(11,18,61,0.09)] md:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 shadow-xs">
                      <Image
                        src={chief.image || "/images/editor_chief.png"}
                        alt={chief.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 border border-white text-slate-900 shadow-xs">
                        <Award className="h-3 w-3 fill-current" />
                      </span>
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50/80 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[color:var(--color-gb-gold-dark)]">
                        {chief.role}
                      </span>
                      <h3 className="mt-2 font-academic text-2xl font-bold leading-snug text-[color:var(--color-gb-blue-deep)]">
                        {chief.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Building2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        {chief.unit}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="flex items-start gap-2.5 text-xs leading-6 text-slate-600">
                    <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gb-blue)]" />
                    <span>
                      <strong className="font-extrabold text-slate-800">Domain Specialization:</strong>{" "}
                      {chief.expertise}
                    </span>
                  </div>
                </div>

                <blockquote className="relative mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <Quote className="absolute right-3 top-3 h-6 w-6 text-slate-300/40" />
                  <p className="text-xs italic leading-relaxed text-slate-600 font-medium">
                    &ldquo;Scholarly rigour, ethical transparency, and community impact are the pillars of every editorial decision we make.&rdquo;
                  </p>
                </blockquote>

                <div className="mt-6 flex flex-row items-center gap-2.5 sm:gap-3">
                  <HeroActionButton
                    href={`mailto:editorial@gonouniversity.edu.bd?subject=Inquiry%20for%20${encodeURIComponent(chief.name)}`}
                    variant="dark"
                    icon={Mail}
                  >
                    <span className="sm:hidden">Contact</span>
                    <span className="hidden sm:inline">Contact Editor-in-Chief</span>
                  </HeroActionButton>
                </div>
              </article>

              {/* Managing Editor Card */}
              <article className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_12px_36px_rgba(11,18,61,0.05)] transition-all duration-300 hover:border-slate-300 hover:shadow-[0_18px_48px_rgba(11,18,61,0.09)] md:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 shadow-xs">
                      <Image
                        src={managing.image || "/images/managing_editor.png"}
                        alt={managing.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-gb-blue)] border border-white text-white shadow-xs">
                        <BookMarked className="h-3 w-3" />
                      </span>
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-gb-blue)]/20 bg-[color:var(--color-gb-blue-soft)] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[color:var(--color-gb-blue-dark)]">
                        {managing.role}
                      </span>
                      <h3 className="mt-2 font-academic text-2xl font-bold leading-snug text-[color:var(--color-gb-blue-deep)]">
                        {managing.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Building2 className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)] shrink-0" />
                        {managing.unit}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="flex items-start gap-2.5 text-xs leading-6 text-slate-600">
                    <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gb-blue)]" />
                    <span>
                      <strong className="font-extrabold text-slate-800">Domain Specialization:</strong>{" "}
                      {managing.expertise}
                    </span>
                  </div>
                </div>

                <blockquote className="relative mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <Quote className="absolute right-3 top-3 h-6 w-6 text-slate-300/40" />
                  <p className="text-xs italic leading-relaxed text-slate-600 font-medium">
                    &ldquo;Operational excellence and author support are central to ensuring every submission receives timely, fair, and constructive evaluation.&rdquo;
                  </p>
                </blockquote>

                <div className="mt-6 flex flex-row items-center gap-2.5 sm:gap-3">
                  <HeroActionButton
                    href={`mailto:managing@gonouniversity.edu.bd?subject=Inquiry%20for%20${encodeURIComponent(managing.name)}`}
                    variant="outline"
                    icon={Mail}
                  >
                    <span className="sm:hidden">Contact</span>
                    <span className="hidden sm:inline">Contact Managing Editor</span>
                  </HeroActionButton>
                </div>
              </article>
            </div>
          </section>

          {/* ── Section 2: Section Editors & Discipline Chairs ── */}
          <section aria-labelledby="section-editors-heading">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] font-extrabold tracking-[0.08em] text-slate-400">
                02
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[color:var(--color-gb-gold-dark)]">
                Discipline Chairs
              </span>
            </div>
            <h2
              id="section-editors-heading"
              className="mt-3 font-academic text-3xl font-bold tracking-[-0.03em] text-[color:var(--color-gb-blue-deep)] md:text-4xl"
            >
              Section Editors &amp; Subject Specialists
            </h2>
            <p className="mt-2.5 max-w-2xl text-xs leading-6 text-slate-600 md:text-sm">
              Domain experts who assign independent peer reviewers, manage double-blind evaluation, and oversee field-specific quality control.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
              {sectionEditors.map((member) => {
                const theme = getDisciplineTheme(member.unit);
                const initials = member.name
                  .split(" ")
                  .slice(-2)
                  .map((w: string) => w[0])
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={member.name}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_8px_24px_rgba(11,18,61,0.04)] transition-all duration-200 hover:border-slate-300 hover:shadow-[0_12px_32px_rgba(11,18,61,0.08)]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${theme.border} ${theme.soft} text-base font-extrabold ${theme.text}`}
                          >
                            {initials}
                          </span>
                          <div>
                            <h3 className="font-academic text-lg font-bold text-[color:var(--color-gb-blue-deep)]">
                              {member.name}
                            </h3>
                            <span className="inline-block mt-1 text-[11px] font-extrabold uppercase tracking-wider text-[color:var(--color-gb-gold-dark)]">
                              {member.role}
                            </span>
                          </div>
                        </div>

                        <a
                          href={`mailto:journal@gonouniversity.edu.bd?subject=Query%20for%20${encodeURIComponent(member.name)}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-soft)] hover:text-[color:var(--color-gb-blue)] focus-ring"
                          title={`Email ${member.name}`}
                          aria-label={`Email ${member.name}`}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{member.unit}</span>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="text-xs font-bold text-slate-700">
                        Domain Focus:
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {member.expertise}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Section 3: Governance Policies & Independence Statement ── */}
          <section aria-labelledby="governance-framework-heading">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] font-extrabold tracking-[0.08em] text-slate-400">
                03
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[color:var(--color-gb-gold-dark)]">
                Governance Framework
              </span>
            </div>
            <h2
              id="governance-framework-heading"
              className="mt-3 font-academic text-3xl font-bold tracking-[-0.03em] text-[color:var(--color-gb-blue-deep)] md:text-4xl"
            >
              Editorial Independence &amp; Ethical Principles
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {governancePrinciples.map(({ icon: Icon, title, description: body }) => (
                <div
                  key={title}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_8px_24px_rgba(11,18,61,0.04)] transition-all duration-200 hover:bg-slate-50/70"
                >
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] shadow-[0_6px_18px_rgba(11,18,61,0.06)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-[15px] font-extrabold tracking-tight leading-snug text-[color:var(--color-gb-blue-deep)]">
                      {title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-6 text-slate-600">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Institutional Independence Statement Banner */}
            <div className="mt-8 relative overflow-hidden rounded-2xl bg-[color:var(--color-gb-blue-deep)] p-7 text-white shadow-[0_20px_50px_rgba(11,18,61,0.14)] md:p-9 lg:p-10">
              <div
                className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.035]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[color:var(--color-gb-gold)]/10 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-amber-300">
                      <Landmark className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-300">
                      Independence Charter
                    </p>
                  </div>

                  <h3 className="mt-4 font-academic text-2xl font-bold leading-snug text-white md:text-3xl">
                    Official Independence Statement
                  </h3>
                  <p className="mt-3.5 text-xs leading-7 text-white/70 md:text-sm md:leading-7">
                    The Editorial Board of Gono Bishwabidyalay Journal of Research operates with full editorial autonomy. Decisions to accept, revise, or reject submitted manuscripts are based strictly on double-blind peer review merit, scientific rigor, and ethical compliance — without influence from commercial, institutional, or political interests. All board members strictly adhere to COPE&rsquo;s Code of Conduct and Best Practice Guidelines.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                  <HeroActionButton
                    href="/policies"
                    variant="white"
                    hasArrow
                  >
                    Read full policies
                  </HeroActionButton>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
