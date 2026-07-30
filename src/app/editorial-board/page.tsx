import {
  Award,
  BookOpen,
  GraduationCap,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import { EditorialPageHeader } from "@/components/editorial/editorial-page-header";
import { SupportingTag } from "@/components/ui/badge";
import { boardMembers } from "@/lib/data";

import { EditorInChiefCard } from "@/components/editorial/editor-in-chief-card";
import { SectionEditorsGrid } from "@/components/editorial/section-editors-grid";

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
      {/* Editorial Header */}
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

      <div className="bg-[#fbfcff] py-12 md:py-16">
        <div className="container-x space-y-16">
          {/* Executive Leadership */}
          <FadeIn delay={0.1}>
            <EditorInChiefCard chief={chief} managing={managing} />
          </FadeIn>

          {/* Section Editors */}
          <FadeIn delay={0.15}>
            <SectionEditorsGrid editors={sectionEditors} />
          </FadeIn>

          {/* Governance Principles */}
          <FadeIn delay={0.2}>
            <section className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xs hover-glow transition-all">
              <h2 className="text-lg font-extrabold text-slate-900">
                Editorial Governance & Publication Ethics
              </h2>
              <StaggerContainer className="mt-6 grid gap-6 md:grid-cols-3">
                {governancePrinciples.map((item) => {
                  const Icon = item.icon;
                  return (
                    <StaggerItem key={item.title} className="space-y-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </section>
          </FadeIn>
        </div>
      </div>
    </PageShell>
  );
}
