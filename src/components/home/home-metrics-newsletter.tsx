"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  Globe,
  Lock,
  Mail,
  Users,
} from "lucide-react";
import { FadeIn } from "@/components/layout/page-transition";

export function HomeMetricsNewsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section
      aria-label="Research Metrics and Newsletter"
      className="py-14 sm:py-20 bg-slate-50/50 border-b border-slate-200/80"
    >
      <div className="container-x">
        <FadeIn>
          <div className="bg-white border border-slate-200/90 p-8 sm:p-10 lg:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_390px] gap-10 lg:gap-14">
              
              {/* Left Column: Research Metrics */}
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                    RESEARCH METRICS
                  </p>
                  <h2 className="mt-2 font-academic text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-slate-950">
                    Advancing knowledge. Driving impact.
                  </h2>
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Key highlights from the Nexus Journal Press community.
                  </p>
                </div>

                {/* 4 Metric Items Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 mt-8 pt-8 border-t border-slate-100">
                  {/* Metric 1 */}
                  <div className="flex flex-col items-start">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-[#1e40af] border border-slate-200/80 mb-4">
                      <FileText className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <p className="font-academic lining-nums text-2xl sm:text-[26px] font-medium text-slate-950">
                      12,486+
                    </p>
                    <p className="mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                      ARTICLES PUBLISHED
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                      Rigorous research across diverse disciplines
                    </p>
                  </div>

                  {/* Metric 2 */}
                  <div className="flex flex-col items-start">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-[#1e40af] border border-slate-200/80 mb-4">
                      <BookOpen className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <p className="font-academic lining-nums text-2xl sm:text-[26px] font-medium text-slate-950">
                      36+
                    </p>
                    <p className="mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                      ACTIVE JOURNALS
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                      High-quality, peer-reviewed publications
                    </p>
                  </div>

                  {/* Metric 3 */}
                  <div className="flex flex-col items-start">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-[#1e40af] border border-slate-200/80 mb-4">
                      <Users className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <p className="font-academic lining-nums text-2xl sm:text-[26px] font-medium text-slate-950">
                      18,750+
                    </p>
                    <p className="mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                      RESEARCHERS
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                      Contributing to global scientific progress
                    </p>
                  </div>

                  {/* Metric 4 */}
                  <div className="flex flex-col items-start">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-[#1e40af] border border-slate-200/80 mb-4">
                      <Globe className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <p className="font-academic lining-nums text-2xl sm:text-[26px] font-medium text-slate-950">
                      142
                    </p>
                    <p className="mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-[#1e40af]">
                      COUNTRIES REACHED
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                      Research with a worldwide impact
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Stay Updated Newsletter */}
              <div className="lg:border-l lg:border-slate-200/80 lg:pl-10 xl:pl-12 flex flex-col justify-between pt-8 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                    STAY CONNECTED
                  </p>
                  <h3 className="mt-1.5 font-academic text-2xl sm:text-[26px] font-medium text-slate-950">
                    Stay Updated
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    Subscribe to our newsletter for the latest research
                    highlights, journal updates, and open access content.
                  </p>

                  {/* Subscribe Form */}
                  <form onSubmit={handleSubmit} className="mt-5">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-slate-50/50 border border-slate-300 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1e40af] focus:outline-hidden transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={subscribed}
                      className="mt-3 w-full bg-[#0b1b3d] hover:bg-[#162c60] text-white py-3 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      {subscribed ? "Subscribed Successfully!" : "Subscribe Now"}
                    </button>
                  </form>
                </div>

                {/* Privacy Guarantee */}
                <div className="mt-4 flex items-center gap-1.5 text-[10.5px] text-slate-500">
                  <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>We respect your privacy. Unsubscribe anytime.</span>
                </div>
              </div>

            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
