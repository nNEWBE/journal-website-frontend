import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Landmark,
  Library,
  Mail,
  MapPin,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { boardMembers, type BoardMember } from "@/lib/data";
import { PageHero, JournalCtaPanel } from "@/components/site";
import { EditorInChiefCard } from "@/components/editorial/editor-in-chief-card";
import { SectionEditorsGrid } from "@/components/editorial/section-editors-grid";
import { getBackendUrl } from "@/lib/backend-url";
import { getPageContent } from "@/lib/cms/page-content";
import editorialDefaults from "@/lib/cms/defaults/editorial-board.json";
import { EditorialGovernanceCharter } from "@/components/editorial/editorial-governance-charter";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Editorial Board & Governance | GB Journal of Research",
  description:
    "Meet the academic leadership and section editors of the Gono Bishwabidyalay Journal of Research. Discover our COPE-aligned governance charter and double-blind peer review oversight.",
};

async function fetchBoardMembersFromDb(): Promise<BoardMember[]> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/editorial-board`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const items = await res.json();
    return items.map((m: any) => {
      const defaultImage =
        m.role === "Editor-in-Chief"
          ? "/images/avatars/dr_fatima.jpg"
          : m.role === "Managing Editor"
            ? "/images/avatars/prof_tariq.jpg"
            : m.name?.includes("Rehana")
              ? "/images/avatars/dr_rehana.jpg"
              : m.name?.includes("Mahbub")
                ? "/images/avatars/prof_mahmud.jpg"
                : m.name?.includes("Nasima")
                  ? "/images/avatars/dr_ayesha.jpg"
                  : "/images/avatars/dr_fatima.jpg";

      return {
        ...m,
        image: m.imageUrl || m.image || defaultImage,
        imageUrl: m.imageUrl || m.image || defaultImage,
        institution: m.institution || "Gono Bishwabidyalay",
      };
    });
  } catch (err) {
    console.error("Failed to fetch board members from DB:", err);
    return [];
  }
}

export default async function EditorialBoardPage() {
  const contentPromise = getPageContent(editorialDefaults);
  const dbMembers = await fetchBoardMembersFromDb();
  const members = dbMembers.length > 0 ? dbMembers : boardMembers;
  const chief =
    members.find((m) => m.role === "Editor-in-Chief") || members[0];
  const managing =
    members.find((m) => m.role === "Managing Editor") || members[1];
  const sectionEditors = members.filter(
    (m) => m.role !== "Editor-in-Chief" && m.role !== "Managing Editor"
  );
  const content = await contentPromise;
  const leadership = content.leadership;
  const sectionEditorsCopy = content["section-editors"];

  return (
    <PageShell>
      {/* ── 1. Hero Header ── */}
      {content.hero.visible && (
        <FadeIn delay={0.05}>
          <PageHero
            section={content.hero}
            ariaLabel="Editorial Board Hero"
            eyebrowIcon={Users}
            highlightIcons={[ShieldCheck, Scale, GraduationCap]}
          />
        </FadeIn>
      )}

      {(leadership.visible || sectionEditorsCopy.visible) && (
        <div className="bg-gb-tint py-14 sm:py-20 border-b border-slate-200/80">
          <div className="container-x space-y-16 sm:space-y-20">
            {/* ── 2. Executive Leadership ── */}
            {leadership.visible && (
              <FadeIn delay={0.1}>
                <EditorInChiefCard
                  chief={chief}
                  managing={managing}
                  copy={{ ...leadership.meta, eyebrow: leadership.subtitle, title: leadership.title }}
                />
              </FadeIn>
            )}

            {/* ── 3. Section Editors Grid ── */}
            {sectionEditorsCopy.visible && (
              <FadeIn delay={0.15}>
                <SectionEditorsGrid
                  editors={sectionEditors}
                  copy={{
                    ...sectionEditorsCopy.meta,
                    eyebrow: sectionEditorsCopy.subtitle,
                    title: sectionEditorsCopy.title,
                  }}
                />
              </FadeIn>
            )}

          </div>
        </div>
      )}

      {/* ── 5. Editorial Governance Charter ── */}
      {content.governance.visible && (
        <EditorialGovernanceCharter section={content.governance} />
      )}

      {/* ── 6. Join the Peer Review Panel & Contact Desk ── */}
      {content.cta.visible && (
        <JournalCtaPanel
          section={content.cta}
          ariaLabel="Join Reviewer Panel and Contact"
          badgeFallbackIcon={Users}
          pillFallbackIcons={[ShieldCheck, Award, Clock]}
        />
      )}
    </PageShell>
  );
}
