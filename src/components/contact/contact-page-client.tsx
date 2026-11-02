"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Globe2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { CustomSelect } from "@/components/ui/custom-select";
import { ContactHero } from "@/components/contact/contact-hero";
import type { ResolvedPage } from "@/lib/cms/page-content";
import { CmsText } from "@/lib/cms/cms-text";
import { cmsIcon } from "@/lib/cms/icons";
import type defaults from "@/lib/cms/defaults/contact.json";

export type ContactContent = ResolvedPage<typeof defaults>;

const INQUIRY_GRID_KEYS = ["office-details", "inquiry-protocol", "contact-form"];

const pillFallbacks: LucideIcon[] = [Clock, Globe2, ShieldCheck];
const pillIconColors = ["text-amber-300", "text-blue-400", "text-emerald-400"];

const ctaStyles = [
  "inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#060e22] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm",
  "inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors",
];

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

export function ContactPageClient({ content }: { content: ContactContent }) {
  const office = content["office-details"];
  const protocol = content["inquiry-protocol"];
  const form = content["contact-form"];
  const departments = content.departments;
  const map = content["campus-map"];
  const cta = content.cta;

  const roleOptions = strings(form.meta.roleOptions);
  const topicOptions = strings(form.meta.topicOptions);
  const defaultRole = roleOptions[0] ?? "";
  const defaultTopic = topicOptions[0] ?? "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: defaultRole,
    subject: defaultTopic,
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [reference, setReference] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setReference(`GB-${Math.floor(Math.random() * 900000 + 100000)}`);
      setFormData({
        name: "",
        email: "",
        role: defaultRole,
        subject: defaultTopic,
        message: "",
      });
    }, 1200);
  };

  const addressLines = strings(office.meta.addressLines);
  const desks = Array.isArray(departments.meta.desks) ? departments.meta.desks : [];
  const pills = Array.isArray(cta.meta.pills) ? cta.meta.pills : [];
  const ctas = Array.isArray(cta.meta.ctas) ? cta.meta.ctas : [];

  const showLeftColumn = office.visible || protocol.visible;
  const gridKey = content._order.find((key) => INQUIRY_GRID_KEYS.includes(key));

  const renderInquiryGrid = () =>
    showLeftColumn || form.visible ? (
      /* ── 2. Directory & Interactive Inquiry Form ── */
      <section
        key="inquiry-form"
        id="inquiry-form"
        aria-label="Editorial Contact Form & Directory"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80 scroll-mt-20"
      >
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-start">
            {/* Left Column: Office Directory Cards */}
            {showLeftColumn && (
              <div className="space-y-6">
                {office.visible && (
                  <div className="bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                          {office.subtitle}
                        </p>
                        <h2 className="font-academic text-xl font-medium text-slate-950 mt-0.5">
                          {office.title}
                        </h2>
                      </div>
                      {office.meta.statusBadge && (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase border border-emerald-200">
                          {office.meta.statusBadge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-5 divide-y divide-slate-100 text-xs">
                      <div className="flex items-start gap-4 pt-1 first:pt-0">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0b1b3d] text-white">
                          <MapPin className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{office.meta.addressLabel}</h3>
                          <p className="mt-1 text-slate-800 font-medium leading-relaxed">
                            {addressLines.map((line, idx) => (
                              <span key={idx}>
                                {idx > 0 && <br />}
                                {line}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 pt-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0b1b3d] text-white">
                          <Mail className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{office.meta.emailLabel}</h3>
                          <a
                            href={`mailto:${office.meta.email}`}
                            className="mt-1 inline-block font-mono font-semibold text-[#1e40af] hover:underline"
                          >
                            {office.meta.email}
                          </a>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {office.meta.emailNote}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 pt-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0b1b3d] text-white">
                          <Phone className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{office.meta.phoneLabel}</h3>
                          <p className="mt-1 font-mono font-semibold text-slate-900">
                            {office.meta.phone}
                            {office.meta.phoneExtension && (
                              <>
                                {" "}
                                <span className="font-normal text-slate-500">{office.meta.phoneExtension}</span>
                              </>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {office.meta.phoneHours}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 pt-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#0b1b3d] text-white">
                          <Clock className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <h3 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{office.meta.responseLabel}</h3>
                          <p className="mt-1 text-slate-700 font-medium">
                            {office.meta.responseText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Manuscript tracking helper */}
                {protocol.visible && (
                  <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1e40af]">
                      <Building2 className="h-4 w-4 text-[#1e40af]" />
                      <span>{protocol.title}</span>
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 font-normal">
                      <CmsText text={protocol.content} strongClassName="text-slate-900 font-semibold" />
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Right Column: Interactive Form */}
            {form.visible && (
              <div className="bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                      {form.subtitle}
                    </p>
                    <h2 className="font-academic text-2xl font-medium text-slate-950 mt-0.5">
                      {form.title}
                    </h2>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center bg-[#0b1b3d] text-white">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        {form.meta.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={form.meta.namePlaceholder}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#1e40af] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        {form.meta.emailLabel}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={form.meta.emailPlaceholder}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#1e40af] focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        {form.meta.roleLabel}
                      </label>
                      <CustomSelect
                        options={roleOptions}
                        value={formData.role}
                        onChange={(val) => setFormData({ ...formData, role: val })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        {form.meta.topicLabel}
                      </label>
                      <CustomSelect
                        options={topicOptions}
                        value={formData.subject}
                        onChange={(val) => setFormData({ ...formData, subject: val })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      {form.meta.messageLabel}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={form.meta.messagePlaceholder}
                      className="w-full bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-800 font-medium leading-relaxed focus:border-[#1e40af] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Status Messages */}
                  {status === "success" && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-xs">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="font-bold">Message Logged Successfully</p>
                        <p className="mt-0.5 text-emerald-800">
                          Your inquiry has been assigned Tracking Reference <strong className="font-mono">{reference}</strong>. Our editorial desk will reply within 24–48 hours.
                        </p>
                      </div>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 p-4 text-rose-900 text-xs">
                      <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                      <p>Please fill out all required fields before transmitting your message.</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{form.meta.submittingLabel}</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>{form.meta.submitLabel}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    ) : null;

  const renderers: Record<string, () => ReactNode> = {
    hero: () => (
      /* ── 1. Hero Header ── */
      <FadeIn key="hero" delay={0.05}>
        <ContactHero section={content.hero} />
      </FadeIn>
    ),

    departments: () => (
      /* ── 3. Departmental Editorial Desks ── */
      <section
        key="departments"
        aria-label="Departmental Desks"
        className="py-14 sm:py-20 bg-white border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-200/80">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                {departments.subtitle}
              </p>
              <h2 className="mt-2 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] text-slate-950">
                {departments.title}
              </h2>
            </div>
            {departments.content && (
              <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                {departments.content}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {desks.map((desk, idx) => (
              <div
                key={`${desk.title}-${idx}`}
                className="bg-slate-50/70 border border-slate-200/90 p-6 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] bg-blue-50 px-2 py-0.5 border border-blue-100">
                    {desk.lead}
                  </span>

                  <h3 className="mt-3 font-academic text-base font-medium text-slate-950 group-hover:text-[#1e40af] transition-colors leading-snug">
                    {desk.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
                    {desk.scope}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-200/80">
                  <a
                    href={`mailto:${desk.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#1e40af] hover:underline break-all"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span>{desk.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),

    "campus-map": () => (
      /* ── 4. Integrated Campus Location Map ── */
      <section
        key="campus-map"
        aria-label="Campus Location Map"
        className="py-14 sm:py-20 bg-[#fbfcff] border-b border-slate-200/80"
      >
        <div className="container-x">
          <div className="bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="bg-slate-50/80 border-b border-slate-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1e40af]">
                  {map.subtitle}
                </p>
                <h3 className="font-academic text-xl font-medium text-slate-950 mt-0.5">
                  {map.title}
                </h3>
                {map.content && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {map.content}
                  </p>
                )}
              </div>
              {map.meta.mapLink?.href && (
                <a
                  href={map.meta.mapLink.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e40af] hover:underline"
                >
                  <span>{map.meta.mapLink.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {map.meta.mapEmbedUrl && (
              <div className="relative h-90 w-full bg-slate-100">
                <iframe
                  title={map.meta.mapTitle}
                  src={map.meta.mapEmbedUrl}
                  className="h-full w-full border-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    ),

    cta: () => (
      /* ── 5. Call for Manuscripts CTA ── */
      <section
        key="cta"
        aria-label="Call for Papers CTA"
        className="py-14 sm:py-20 bg-white"
      >
        <div className="container-x">
          <div className="relative overflow-hidden bg-[#060e22] text-white border border-slate-800 shadow-[0_20px_50px_rgba(3,8,22,0.45)] p-8 sm:p-12 lg:p-14">
            {/* Top gold-to-blue accent line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-amber-400 via-blue-500 to-transparent" />

            {/* Ambient background glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-amber-500/10 blur-[90px]" />

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-10 lg:gap-14 items-center">
              {/* Left Column: Call for Papers */}
              <div>
                {cta.subtitle && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-[0.18em]">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{cta.subtitle}</span>
                  </div>
                )}

                <h2 className="mt-4 font-academic text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-tight text-white leading-[1.15]">
                  {cta.title}
                </h2>

                {cta.content && (
                  <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                    {cta.content}
                  </p>
                )}

                {/* Feature Pill Tags */}
                {pills.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                    {pills.map((pill, idx) => {
                      const Icon = cmsIcon(pill.icon, pillFallbacks[idx % pillFallbacks.length]);
                      return (
                        <span
                          key={`${pill.label}-${idx}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-semibold"
                        >
                          <Icon className={`h-3.5 w-3.5 ${pillIconColors[idx % pillIconColors.length]}`} />
                          {pill.label}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Primary Actions */}
                {ctas.length > 0 && (
                  <div className="mt-8 flex flex-wrap items-center gap-3.5">
                    {ctas.map((link, idx) => (
                      <Link
                        key={`${link.href}-${idx}`}
                        href={link.href}
                        className={ctaStyles[Math.min(idx, ctaStyles.length - 1)]}
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Editorial Secretariat Contact Card */}
              <div className="bg-white/5 border border-white/12 p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-amber-300">
                      {cta.meta.cardEyebrow}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {cta.meta.cardTag}
                    </span>
                  </div>

                  <h3 className="mt-3 font-academic text-xl font-medium text-white">
                    {cta.meta.cardTitle}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {cta.meta.cardText}
                  </p>

                  <div className="mt-5 space-y-3.5 border-t border-white/10 pt-4 text-xs text-slate-200">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{cta.meta.emailLabel}</p>
                        <a
                          href={`mailto:${cta.meta.email}`}
                          className="text-xs text-white hover:text-amber-300 underline mt-0.5 block transition-colors"
                        >
                          {cta.meta.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{cta.meta.locationLabel}</p>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {cta.meta.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {cta.meta.cardLink?.href && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <a
                      href={cta.meta.cardLink.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider transition-colors"
                    >
                      <span>{cta.meta.cardLink.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <PageShell>
      {content._order.map((key) => {
        if (INQUIRY_GRID_KEYS.includes(key)) {
          return key === gridKey ? renderInquiryGrid() : null;
        }
        return renderers[key]?.() ?? null;
      })}
    </PageShell>
  );
}
