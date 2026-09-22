import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { getBackendUrl } from "@/lib/backend-url";
import type { BoardMember, Article } from "@/lib/data";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

function getMemberFallbackImage(member: Partial<BoardMember>): string {
  if (member.imageUrl) return member.imageUrl;
  if (member.image) return member.image;
  if (member.role === "Editor-in-Chief") return "/images/avatars/dr_fatima.jpg";
  if (member.role === "Managing Editor") return "/images/avatars/prof_tariq.jpg";
  if (member.name?.includes("Rehana")) return "/images/avatars/dr_rehana.jpg";
  if (member.name?.includes("Mahbub")) return "/images/avatars/prof_mahmud.jpg";
  if (member.name?.includes("Nasima")) return "/images/avatars/dr_ayesha.jpg";
  return "/images/avatars/dr_fatima.jpg";
}

async function fetchMember(id: string): Promise<BoardMember | null> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/editorial-board/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.name) {
        return {
          ...data,
          image: getMemberFallbackImage(data),
          imageUrl: getMemberFallbackImage(data),
          institution: data.institution || "Gono Bishwabidyalay",
        };
      }
    }

    // Fallback to searching the full editorial board list
    const listRes = await fetch(`${backendUrl}/api/v1/editorial-board`, {
      cache: "no-store",
    });
    if (listRes.ok) {
      const list: any[] = await listRes.json();
      const match = list.find(
        (m) => String(m.id) === id || m.slug === id || m.name?.toLowerCase().includes(id.toLowerCase())
      );
      if (match) {
        return {
          ...match,
          image: getMemberFallbackImage(match),
          imageUrl: getMemberFallbackImage(match),
          institution: match.institution || "Gono Bishwabidyalay",
        };
      }
    }
  } catch (err) {
    console.error("Failed to fetch board member detail:", err);
  }

  return null;
}

async function fetchRelatedArticles(): Promise<Article[]> {
  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/articles?size=3`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const items = data.content || [];
      return items.slice(0, 3).map((item: any) => ({
        id: item.articleId || String(item.id || item.slug),
        slug: item.slug,
        title: item.title,
        type: item.type || "Research Article",
        topic: item.topic || "General",
        department: item.department || "Academic Research",
        authors: Array.isArray(item.authors) ? item.authors : [item.authors || ""],
        abstract: item.abstract || item.abstractText || "",
        issue: item.issue || item.issueLabel || "Current Issue",
        volume: item.volume || item.volumeLabel || "Volume 4",
        pages: item.pages || "1-10",
        doi: item.doi || "10.5555/gbj.2026.001",
        publishedAt: item.publishedAt || "2026",
        metrics: {
          views: item.metrics?.views ?? 0,
          downloads: item.metrics?.downloads ?? 0,
          citations: item.metrics?.citations ?? 0,
        },
        keywords: item.keywords || [],
        sections: [],
        image: item.image || item.imageUrl || "/covers/medical.png",
        pdf: item.pdf || item.pdfUrl || "",
      }));
    }
  } catch (err) {
    console.error("Failed to fetch related articles:", err);
  }
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const member = await fetchMember(id);

  if (!member) {
    return {
      title: "Editorial Board Member Not Found | GB Journal of Research",
    };
  }

  return {
    title: `${member.name} — ${member.role} | GB Journal of Research`,
    description: `${member.name}, ${member.role} at Gono Bishwabidyalay Journal of Research. Academic profile, editorial governance responsibilities, and research specialization.`,
  };
}

export default async function BoardMemberDetailPage({ params }: PageProps) {
  const { id } = await params;
  const member = await fetchMember(id);

  if (!member) {
    notFound();
  }

  const relatedArticles = await fetchRelatedArticles();
  const isChief = member.role === "Editor-in-Chief";
  const isManaging = member.role === "Managing Editor";
  const imageSrc = getMemberFallbackImage(member);

  const specializations = member.expertise
    ? member.expertise.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Peer Review Oversight", "Academic Integrity", "Interdisciplinary Scholarship"];

  return (
    <PageShell>
      {/* ── 1. Top Breadcrumb & Return Link ── */}
      <div className="bg-[#030819] border-b border-slate-800/80 text-white">
        <div className="container-x py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-400">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <Link href="/editorial-board" className="hover:text-amber-400 transition-colors">
              Editorial Board
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium truncate max-w-50 sm:max-w-none">
              {member.name}
            </span>
          </nav>

          <Link
            href="/editorial-board"
            className="group inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 shrink-0" />
            <span>Back to Full Board</span>
          </Link>
        </div>
      </div>

      {/* ── 2. Executive Hero Banner ── */}
      <section className="bg-linear-to-b from-[#060e22] via-[#091534] to-[#0d1d47] text-white py-12 sm:py-16 border-b border-slate-800/90 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container-x relative">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 lg:gap-12">
            {/* ── Prominent Portrait ── */}
            <div className="relative w-44 sm:w-56 md:w-64 aspect-3/4 shrink-0 overflow-hidden rounded-xs border-2 border-white/20 shadow-2xl bg-slate-900">
              <Image
                src={imageSrc}
                alt={member.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 256px"
                priority
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>

            {/* ── Member Profile Highlights ── */}
            <div className="flex-1 min-w-0">
              {/* Role badge */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                {isChief ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-xs">
                    <Award className="h-3.5 w-3.5 text-amber-400" />
                    <span>{member.role}</span>
                  </span>
                ) : isManaging ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-400/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider rounded-xs">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                    <span>{member.role}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xs">
                    <Users className="h-3.5 w-3.5 text-slate-300" />
                    <span>{member.role}</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-semibold rounded-xs">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>Active Mandate (2024–2028)</span>
                </span>
              </div>

              {/* Full Name */}
              <h1 className="font-academic text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                {member.name}
              </h1>

              {/* Department & Institution */}
              <p className="mt-2 text-sm sm:text-base font-medium text-amber-300/90">
                {member.unit}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{member.institution || "Gono Bishwabidyalay, Savar, Dhaka, Bangladesh"}</span>
              </p>

              {/* Actions & Identifiers Bar */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-3">
                {member.orcid && (
                  <a
                    href={`https://orcid.org/${member.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#a6ce39]/10 border border-[#a6ce39]/30 text-[#b5dd43] text-xs font-mono font-semibold rounded-xs hover:bg-[#a6ce39]/20 transition-colors"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#a6ce39]" />
                    <span>ORCID: {member.orcid}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                )}

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Contact Editorial Office</span>
                </Link>

                <Link
                  href="/dashboard/submissions/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Submit Manuscript</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Content Details Grid ── */}
      <div className="bg-[#fbfcff] py-12 sm:py-16 border-b border-slate-200/80">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* ── Left Column: Biography, Responsibilities, Research ── */}
            <div className="lg:col-span-8 space-y-10">
              {/* 3.1 Biography / Leadership Statement */}
              <section className="bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <BookOpen className="h-4 w-4 text-[#1e40af]" />
                  <h2 className="font-academic text-lg font-bold text-slate-950">
                    Academic Biography & Editorial Statement
                  </h2>
                </div>
                <p className="text-sm sm:text-[15px] leading-relaxed text-slate-700">
                  {member.bio ||
                    `${member.name} provides scholarly stewardship and operational leadership for the Gono Bishwabidyalay Journal of Research. Working under strict adherence to the Committee on Publication Ethics (COPE) core practices, their mandate encompasses peer appraisal rigor, referee track integrity, and the publication of high-impact research originating from both national and global academic communities.`}
                </p>
                <div className="mt-6 p-4 bg-slate-50 border-l-3 border-[#1e40af] text-xs leading-relaxed text-slate-600 italic">
                  &ldquo;Our editorial responsibility is rooted in transparent scholarly standards, ensuring that every submission is appraised strictly on research rigor, methodology, and intellectual contribution to society.&rdquo;
                </div>
              </section>

              {/* 3.2 Research Specializations */}
              <section className="bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <Tag className="h-4 w-4 text-[#1e40af]" />
                  <h2 className="font-academic text-lg font-bold text-slate-950">
                    Research Specializations & Editorial Tracks
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Areas of doctoral inquiry, clinical expertise, and referee evaluation tracks overseen by {member.name}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              </section>

              {/* 3.3 Governance Mandate & Ethics */}
              <section className="bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <Scale className="h-4 w-4 text-[#1e40af]" />
                  <h2 className="font-academic text-lg font-bold text-slate-950">
                    Governance Mandate & Ethics Compliance
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50/80 border border-slate-200/70">
                    <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#1e40af]" />
                      Double-Blind Review Integrity
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Ensures author and reviewer anonymization throughout evaluation cycles, eliminating institutional and personal bias.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50/80 border border-slate-200/70">
                    <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <FileCheck2 className="h-3.5 w-3.5 text-[#1e40af]" />
                      COPE Standard Adherence
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Maintains protocols for authorship dispute resolution, data verification, plagiarism screening, and ethical retractment standards.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3.4 Recent Track Publications */}
              {relatedArticles.length > 0 && (
                <section className="bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#1e40af]" />
                      <h2 className="font-academic text-lg font-bold text-slate-950">
                        Recent Published Articles in This Track
                      </h2>
                    </div>
                    <Link
                      href="/articles"
                      className="text-xs font-semibold text-[#1e40af] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Browse All</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {relatedArticles.map((art) => (
                      <Link
                        key={art.id}
                        href={`/articles/${art.slug}`}
                        className="group block p-3.5 sm:p-4 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af]">
                          {art.type} · {art.topic}
                        </span>
                        <h3 className="font-academic text-sm sm:text-base font-medium text-slate-900 group-hover:text-[#1e40af] transition-colors mt-0.5 line-clamp-2">
                          {art.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {art.authors.join(", ")}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* ── Right Column: Secretariat & Affiliation Sidebar ── */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Meta Card */}
              <div className="bg-white border border-slate-200/90 p-6 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2.5 border-b border-slate-100 mb-4">
                  Editorial Appointment
                </h3>
                <dl className="space-y-3.5 text-xs">
                  <div>
                    <dt className="text-slate-500 font-medium">Official Role</dt>
                    <dd className="font-bold text-slate-900 mt-0.5">{member.role}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 font-medium">Department / Faculty</dt>
                    <dd className="font-semibold text-slate-900 mt-0.5">{member.unit}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 font-medium">Institutional Home</dt>
                    <dd className="text-slate-800 mt-0.5">{member.institution || "Gono Bishwabidyalay"}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 font-medium">Editorial Term</dt>
                    <dd className="text-slate-800 mt-0.5">2024 – 2028 (Quadrennial Mandate)</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 font-medium">Review Governance</dt>
                    <dd className="text-emerald-700 font-semibold mt-0.5">COPE Member Track</dd>
                  </div>
                </dl>
              </div>

              {/* Secretariat Office Contact */}
              <div className="bg-[#050d21] text-white p-6 border border-slate-800 shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-4 w-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Editorial Secretariat
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Inquiries regarding referee track assignment, desk appraisal status, or ethical questions should be directed to the journal office.
                </p>

                <div className="space-y-2.5 text-xs text-slate-300 border-t border-white/10 pt-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>Gono Bishwabidyalay, Nolam, Savar, Dhaka 1344, Bangladesh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <a
                      href="mailto:editorial@gonobishwabidyalay.edu.bd"
                      className="hover:text-amber-300 transition-colors truncate"
                    >
                      editorial@gonobishwabidyalay.edu.bd
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>+880 (2) 779-2220</span>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="mt-5 block text-center w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-[#060e22] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Contact Secretariat Desk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
