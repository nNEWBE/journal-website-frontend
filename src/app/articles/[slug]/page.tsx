import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Globe2,
  Library,
  Quote,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { articles, findArticle } from "@/lib/data";
import { ArticleActions } from "@/components/article-actions";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

const getArticleReferences = (slug: string) => {
  if (slug === "community-healthcare-access-savar") {
    return [
      "Rahman, F., Hossain, M. J., & Karim, N. A. (2026). Community healthcare access patterns around Savar: A mixed-method university catchment study. GB Journal, 4(2), 11–28. doi:10.5555/gbj.2026.001",
      "Bangladesh University Research Practice Notes. (2024). Decentralized healthcare systems in rural zones. Savar Public Health Review, 12(1), 104–118.",
      "World Health Organization. (2023). Primary healthcare access and catchment analytics. WHO Technical Report Series, 44(2), 12–29.",
    ];
  }
  if (slug === "pharmacy-practice-antimicrobial-stewardship") {
    return [
      "Islam, S., & Sultana, T. (2026). Pharmacy practice readiness for antimicrobial stewardship in teaching settings. GB Journal, 4(2), 29–44. doi:10.5555/gbj.2026.002",
      "Antimicrobial Stewardship Working Group. (2025). Teaching pharmacy models and curriculum integration. Clinical Pharmacy & Practice, 19(4), 210–224.",
      "Bangladesh Drug Dispensing Governance Guidelines. (2023). Professional practice standards for retail and clinical pharmacies. Ministry of Health & Family Welfare, 88–101.",
    ];
  }
  if (slug === "climate-resilient-agriculture-manifolds") {
    return [
      "Alam, M., & Jahan, S. (2026). Climate-resilient smallholder agriculture: Field observations from central Bangladesh. GB Journal, 4(2), 45–59. doi:10.5555/gbj.2026.003",
      "Central Bangladesh Rainfall & Crop Adaptation Reports. (2025). Climate resilience in deltaic floodplains. Agricultural Adaptation & Development, 31(2), 77–93.",
      "Khan, A. R. (2024). Smallholder farming practices under changing monsoon patterns. South Asian Journal of Agriculture, 14(3), 112–127.",
    ];
  }
  return [
    "Gono Bishwabidyalay Journal demo citation set. 2026.",
    "Bangladesh University Research Practice Notes. 2024.",
    "Community systems and higher education research methods. 2025.",
  ];
};

function sectionId(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const abstractSection = article.sections.find(
    (section) => section.heading.toLowerCase() === "abstract",
  );
  const bodySections = article.sections.filter(
    (section) => section.heading.toLowerCase() !== "abstract",
  );

  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-slate-200 bg-[#f7f8fc]">
        <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.025]" />
        <div className="container-x relative grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
          <div className="max-w-4xl">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 transition-colors hover:text-[color:var(--color-gb-blue)] focus-ring"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Research archive
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--color-gb-blue)]/10 bg-white px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[color:var(--color-gb-blue)]">
                <FileText className="h-3 w-3" />
                {article.type}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-emerald-700">
                <Globe2 className="h-3 w-3" />
                Open access
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                {article.topic}
              </span>
            </div>

            <h1 className="mt-5 max-w-4xl font-academic text-3xl font-bold leading-[1.15] tracking-[-0.03em] text-[color:var(--color-gb-blue-deep)] md:text-[2.65rem]">
              {article.title}
            </h1>
            <p className="mt-5 text-sm font-semibold text-slate-600">
              {article.authors.join(", ")}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200 pt-5 text-[10px] font-semibold text-slate-500">
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                {article.volume}, {article.issue}, pages {article.pages}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
                Published {article.publishedAt}
              </span>
              <span className="font-mono text-slate-400">DOI {article.doi}</span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[340px] lg:ml-auto">
            <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_20px_50px_rgba(17,27,82,0.10)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[13px] bg-slate-900">
                <Image
                  src={article.image || "/covers/medical.png"}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 340px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060b2f]/90 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.13em] text-amber-300">
                    {article.department}
                  </p>
                  <p className="mt-2 font-academic text-lg font-bold leading-snug text-white line-clamp-2">
                    {article.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-1 pb-1 pt-3 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                <span>GB Journal of Research</span>
                <span>{article.publishedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <article className="bg-white py-12 md:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,760px)_290px] lg:justify-center lg:items-start">
          <main>
            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-[#f8f9fc] p-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[color:var(--color-gb-blue)] shadow-sm">
                  <Library className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Academic unit
                  </p>
                  <p className="mt-1 text-[10px] font-extrabold text-slate-700">
                    {article.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[color:var(--color-gb-blue)] shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    Editorial review
                  </p>
                  <p className="mt-1 text-[10px] font-extrabold text-slate-700">
                    Double-blind peer reviewed
                  </p>
                </div>
              </div>
            </div>

            {abstractSection && (
              <section
                id={sectionId(abstractSection.heading)}
                className="mt-8 scroll-mt-24 rounded-2xl border border-[color:var(--color-gb-blue)]/15 bg-[color:var(--color-gb-blue-soft)]/35 p-6 md:p-8"
              >
                <div className="flex items-center gap-2">
                  <Quote className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.16em] text-[color:var(--color-gb-blue)]">
                    Abstract
                  </h2>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {abstractSection.body}
                </p>
              </section>
            )}

            <div className="article-prose mt-8 border-t border-slate-200 pt-1">
              {bodySections.map((section) => (
                <section
                  key={section.heading}
                  id={sectionId(section.heading)}
                  className="scroll-mt-24"
                >
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </section>
              ))}

              <section id="references" className="scroll-mt-24">
                <h2>References</h2>
                <ol className="mt-5 space-y-4 border-t border-slate-200 pt-5 font-sans text-xs leading-6 text-slate-500">
                  {getArticleReferences(article.slug).map((reference, index) => (
                    <li
                      key={reference}
                      className="grid grid-cols-[26px_minmax(0,1fr)] gap-3"
                    >
                      <span className="font-mono text-[9px] font-bold text-slate-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{reference}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </main>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(17,27,82,0.06)]">
              <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[color:var(--color-gb-blue-deep)]">
                Article access
              </h2>
              <ArticleActions article={article} />
              <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 pt-4">
                {[
                  { label: "Views", value: article.metrics.views, icon: Eye },
                  {
                    label: "Downloads",
                    value: article.metrics.downloads,
                    icon: Download,
                  },
                  {
                    label: "Citations",
                    value: article.metrics.citations,
                    icon: Quote,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="px-1 text-center">
                    <Icon className="mx-auto h-3 w-3 text-slate-300" />
                    <p className="mt-1.5 text-sm font-black text-[color:var(--color-gb-blue-deep)]">
                      {value.toLocaleString()}
                    </p>
                    <p className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.08em] text-slate-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[color:var(--color-gb-blue-deep)]">
                In this article
              </h2>
              <nav
                aria-label="Article sections"
                className="mt-4 flex flex-col border-l border-slate-200"
              >
                {article.sections.map((section, index) => (
                  <a
                    key={section.heading}
                    href={`#${sectionId(section.heading)}`}
                    className="group flex items-center gap-3 border-l-2 border-transparent py-2 pl-3 text-[10px] font-bold text-slate-500 transition-colors hover:border-[color:var(--color-gb-blue)] hover:text-[color:var(--color-gb-blue)]"
                  >
                    <span className="font-mono text-[8px] text-slate-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.heading}
                  </a>
                ))}
                <a
                  href="#references"
                  className="group flex items-center gap-3 border-l-2 border-transparent py-2 pl-3 text-[10px] font-bold text-slate-500 transition-colors hover:border-[color:var(--color-gb-blue)] hover:text-[color:var(--color-gb-blue)]"
                >
                  <span className="font-mono text-[8px] text-slate-300">
                    {String(article.sections.length + 1).padStart(2, "0")}
                  </span>
                  References
                </a>
              </nav>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#f8f9fc] p-5">
              <h2 className="text-[10px] font-black uppercase tracking-[0.14em] text-[color:var(--color-gb-blue-deep)]">
                Article record
              </h2>
              <dl className="mt-4 divide-y divide-slate-200">
                {[
                  ["DOI", article.doi],
                  ["Pages", article.pages],
                  ["Published", article.publishedAt],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 py-3 text-[9px]"
                  >
                    <dt className="font-bold uppercase tracking-[0.08em] text-slate-400">
                      {label}
                    </dt>
                    <dd className="max-w-[170px] text-right font-semibold text-slate-600">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {article.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[8px] font-bold text-slate-500"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-4 text-[9px] font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Version of record
              </div>
            </div>
          </aside>
        </div>
      </article>
    </PageShell>
  );
}
