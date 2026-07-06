import { Info, Award, BookOpen, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export default function AboutPage() {
  return (
    <PageShell>
      {/* Page Header */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14">
          <span className="page-badge">
            <Info className="h-3 w-3" />
            About
          </span>
          <h1 className="page-title font-academic">About the Journal</h1>
          <p className="page-subtitle">
            The Gono Bishwabidyalay Journal of Research is a peer-reviewed, open-access publication supporting interdisciplinary academic discourse.
          </p>
        </div>
        <div className="page-header-accent" />
      </div>

      <section className="container-x py-10">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] items-start">
          
          {/* Main Scholarly Document Column */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 md:p-8 space-y-10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            
            {/* Mission Statement */}
            <div className="space-y-4">
              <h2 className="font-academic text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                Aims and Scope
              </h2>
              <p className="text-[14px] leading-7 text-slate-500 font-medium">
                The **Gono Bishwabidyalay Journal of Research (GBJR)** is an official, double-blind peer-reviewed, open-access biannual publication of Gono Bishwabidyalay. The journal serves as an international medium for the dissemination of critical research, comprehensive reviews, and empirical studies.
              </p>
              <p className="text-[14px] leading-7 text-slate-500 font-medium">
                Our core mission is to foster scholarly dialogue and elevate the research output of local and global authors. We welcome contributions that provide impactful solutions, advance theoretical models, or analyze policies across interdisciplinary academic domains.
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* Peer Review Life Cycle Chart */}
            <div className="space-y-6">
              <h2 className="font-academic text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                Editorial & Review Process
              </h2>
              <p className="text-[14px] leading-7 text-slate-500 font-medium">
                GBJR maintains a rigorous quality assurance protocol. Every submission undergoes a standard double-blind peer review lifecycle to guarantee scholarly validity and ethical neutrality:
              </p>
              
              {/* Process Flow Diagram */}
              <div className="grid gap-3 sm:grid-cols-5 text-center mt-6">
                {[
                  { step: "01", name: "Submission", desc: "Plagiarism check & compliance assessment." },
                  { step: "02", name: "Desk Review", desc: "Editorial board scope verification." },
                  { step: "03", name: "Peer Review", desc: "Double-blind evaluation by experts." },
                  { step: "04", name: "Revision", desc: "Author refinements based on feedback." },
                  { step: "05", name: "Publication", desc: "Metadata ingestion and DOI assignment." },
                ].map((item, idx) => (
                  <div key={item.step} className="relative flex flex-col items-center bg-slate-50 border border-slate-100/50 rounded-lg p-3.5 group">
                    <span className="text-[9px] font-bold text-[color:var(--color-gb-gold-dark)] uppercase tracking-wider">
                      Step {item.step}
                    </span>
                    <h4 className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-tight">
                      {item.name}
                    </h4>
                    <p className="text-[10px] leading-relaxed text-slate-400 mt-2 font-medium">
                      {item.desc}
                    </p>
                    {idx < 4 && (
                      <ChevronRight className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-200 z-10" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Academic Policies */}
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-academic text-lg font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-[color:var(--color-gb-blue)]" />
                  Open Access Declaration
                </h3>
                <p className="text-xs leading-6 text-slate-500 font-medium">
                  All articles published are immediately available worldwide under an open-access model. Readers are permitted to read, download, share, print, or link to full-texts under the terms of the Creative Commons Attribution-NonCommercial (CC BY-NC 4.0) License.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-academic text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="h-4.5 w-4.5 text-[color:var(--color-gb-blue)]" />
                  Ethical Guidelines
                </h3>
                <p className="text-xs leading-6 text-slate-500 font-medium">
                  GBJR strictly upholds the guidelines of the Committee on Publication Ethics (COPE). Plagiarism, data fabrication, or redundant publications will result in immediate rejection, desk retraction, and institutional notification.
                </p>
              </div>
            </div>

          </div>

          {/* Sticky Academic Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            
            {/* Journal Identity metadata */}
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-50 pb-2">
                Journal Specifications
              </h3>
              
              <div className="space-y-3.5 text-xs font-medium text-slate-600">
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Frequency</span>
                  <span className="text-slate-800 font-bold">Bi-Annual</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Archiving Policy</span>
                  <span className="text-slate-800 font-bold">Portico & CLOCKSS</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="text-slate-400">Average Turnaround</span>
                  <span className="text-slate-800 font-bold">50 Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ISSN (Online)</span>
                  <span className="text-slate-800 font-mono font-bold">2959-1082</span>
                </div>
              </div>
            </div>

            {/* Indexing Directory List */}
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-50 pb-2">
                Indexing & Registries
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {[
                  "CrossRef (DOIs)",
                  "Google Scholar",
                  "BanglaJOL",
                  "Creative Commons",
                  "COPE Compliant",
                  "Open Archives",
                ].map((item) => (
                  <span key={item} className="bg-slate-50 border border-slate-100 rounded p-2 flex items-center justify-center min-h-[36px]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Editorial Desk Queries card */}
            <div className="bg-slate-50 border border-slate-100/60 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Editorial Desk
              </h3>
              <p className="text-xs leading-relaxed text-slate-500 font-medium">
                For copyright enquiries, institutional subscriptions, or specific review questions, please contact our Savar head office.
              </p>
              <div className="pt-2 border-t border-slate-200/50 flex flex-col gap-1.5 text-xs text-slate-600 font-semibold">
                <span>Email: journal@gonouniversity.edu.bd</span>
                <span>Tel: +880-2-7740060 (Ext: 104)</span>
              </div>
            </div>

          </aside>

        </div>
      </section>
    </PageShell>
  );
}
