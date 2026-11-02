"use client";

import { useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  ButtonLink,
  FeatureCard,
  FeatureGrid,
  JournalCtaPanel,
  PageHero,
  PageSection,
  SectionHeader,
} from "@/components/site";
import type { ResolvedPage } from "@/lib/cms/page-content";
import { CmsText } from "@/lib/cms/cms-text";
import type defaults from "@/lib/cms/defaults/contact.json";

export type ContactContent = ResolvedPage<typeof defaults>;

const INQUIRY_GRID_KEYS = ["office-details", "inquiry-protocol", "contact-form"];

const FIELD_LABEL_CLASS = "block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5";
const FIELD_INPUT_CLASS =
  "w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-gb-accent focus:bg-white focus:outline-none transition-all";

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

/** One labelled row of the office directory card. */
function OfficeRow({ icon: Icon, label, children }: { icon: LucideIcon; label?: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 pt-4 first:pt-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-gb-navy text-white">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <div>
        {label && <dt className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>}
        <dd className="mt-1">{children}</dd>
      </div>
    </div>
  );
}

export function ContactPageClient({ content }: { content: ContactContent }) {
  const office = content["office-details"];
  const protocol = content["inquiry-protocol"];
  const form = content["contact-form"];
  const departments = content.departments;
  const map = content["campus-map"];

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

  const showLeftColumn = office.visible || protocol.visible;
  const gridKey = content._order.find((key) => INQUIRY_GRID_KEYS.includes(key));
  /** The band's h2 comes from the form section; the office card takes it over when the form is hidden. */
  const bandHeading = form.visible ? form : office;

  const renderInquiryGrid = () =>
    showLeftColumn || form.visible ? (
      <PageSection key="inquiry-form" id="inquiry-form" tone="tint" ariaLabel="Editorial contact form and directory">
        <SectionHeader eyebrow={bandHeading.subtitle} title={bandHeading.title} />

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-start">
          {showLeftColumn && (
            <div className="space-y-6">
              {office.visible && (
                <div className="bg-white border border-slate-200/90 p-6 sm:p-7 shadow-2xs">
                  {bandHeading !== office && (
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
                      <div>
                        {office.subtitle && (
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gb-accent">
                            {office.subtitle}
                          </p>
                        )}
                        <h3 className="font-academic text-xl font-medium text-slate-950 mt-0.5">{office.title}</h3>
                      </div>
                      {office.meta.statusBadge && (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase border border-emerald-200">
                          {office.meta.statusBadge}
                        </span>
                      )}
                    </div>
                  )}

                  <dl className="space-y-4 divide-y divide-slate-100 text-xs">
                    {addressLines.length > 0 && (
                      <OfficeRow icon={MapPin} label={office.meta.addressLabel}>
                        <p className="text-slate-800 font-medium leading-relaxed">
                          {addressLines.map((line, idx) => (
                            <span key={idx}>
                              {idx > 0 && <br />}
                              {line}
                            </span>
                          ))}
                        </p>
                      </OfficeRow>
                    )}

                    {office.meta.email && (
                      <OfficeRow icon={Mail} label={office.meta.emailLabel}>
                        <a
                          href={`mailto:${office.meta.email}`}
                          className="inline-block font-mono font-semibold text-gb-accent hover:underline break-all"
                        >
                          {office.meta.email}
                        </a>
                        {office.meta.emailNote && (
                          <p className="text-[11px] text-slate-500 mt-0.5">{office.meta.emailNote}</p>
                        )}
                      </OfficeRow>
                    )}

                    {office.meta.phone && (
                      <OfficeRow icon={Phone} label={office.meta.phoneLabel}>
                        <a
                          href={`tel:${office.meta.phone.replace(/[^+\d]/g, "")}`}
                          className="font-mono font-semibold text-slate-900 hover:text-gb-accent"
                        >
                          {office.meta.phone}
                        </a>
                        {office.meta.phoneHours && (
                          <p className="text-[11px] text-slate-500 mt-0.5">{office.meta.phoneHours}</p>
                        )}
                      </OfficeRow>
                    )}

                    {office.meta.responseText && (
                      <OfficeRow icon={Clock} label={office.meta.responseLabel}>
                        <p className="text-slate-700 font-medium">{office.meta.responseText}</p>
                      </OfficeRow>
                    )}
                  </dl>
                </div>
              )}

              {protocol.visible && (
                <div className="bg-white border border-slate-200/90 p-5 shadow-2xs">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gb-accent">
                    <Building2 className="h-4 w-4" />
                    <span>{protocol.title}</span>
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    <CmsText text={protocol.content} strongClassName="text-slate-900 font-semibold" />
                  </p>
                </div>
              )}
            </div>
          )}

          {form.visible && (
            <div className="bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className={FIELD_LABEL_CLASS}>
                      {form.meta.nameLabel}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={form.meta.namePlaceholder}
                      className={FIELD_INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={FIELD_LABEL_CLASS}>
                      {form.meta.emailLabel}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={form.meta.emailPlaceholder}
                      className={FIELD_INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={FIELD_LABEL_CLASS}>{form.meta.roleLabel}</label>
                    <CustomSelect
                      options={roleOptions}
                      value={formData.role}
                      onChange={(val) => setFormData({ ...formData, role: val })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className={FIELD_LABEL_CLASS}>{form.meta.topicLabel}</label>
                    <CustomSelect
                      options={topicOptions}
                      value={formData.subject}
                      onChange={(val) => setFormData({ ...formData, subject: val })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className={FIELD_LABEL_CLASS}>
                    {form.meta.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={form.meta.messagePlaceholder}
                    className={`${FIELD_INPUT_CLASS} leading-relaxed`}
                  />
                </div>

                {status === "success" && (
                  <div role="status" className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-xs">
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
                  <div role="alert" className="flex items-center gap-3 bg-rose-50 border border-rose-200 p-4 text-rose-900 text-xs">
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                    <p>Please fill out all required fields before transmitting your message.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gb-navy hover:bg-gb-navy-hover text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent animate-spin" />
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
      </PageSection>
    ) : null;

  const renderers: Record<string, () => ReactNode> = {
    hero: () => (
      <FadeIn key="hero" delay={0.05}>
        <PageHero section={content.hero} ariaLabel="Contact the editorial office" eyebrowIcon={Building2} />
      </FadeIn>
    ),

    departments: () => (
      <PageSection key="departments" ariaLabel="Departmental desks">
        <SectionHeader eyebrow={departments.subtitle} title={departments.title} intro={departments.content} />
        <FeatureGrid columns={4}>
          {desks.map((desk, idx) => (
            <FeatureCard
              key={`${desk.title}-${idx}`}
              tag={desk.lead}
              title={desk.title}
              description={desk.scope}
              muted
              footer={
                desk.email && (
                  <a
                    href={`mailto:${desk.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-gb-accent hover:underline break-all"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span>{desk.email}</span>
                  </a>
                )
              }
            />
          ))}
        </FeatureGrid>
      </PageSection>
    ),

    "campus-map": () => (
      <PageSection key="campus-map" tone="tint" ariaLabel="Campus location map">
        <SectionHeader
          eyebrow={map.subtitle}
          title={map.title}
          intro={map.content}
          aside={
            map.meta.mapLink?.href ? (
              <ButtonLink href={map.meta.mapLink.href} variant="secondary" icon={ArrowUpRight} iconPosition="end">
                {map.meta.mapLink.label}
              </ButtonLink>
            ) : undefined
          }
        />
        {map.meta.mapEmbedUrl && (
          <div className="relative h-90 w-full bg-slate-100 border border-slate-200/90 shadow-2xs overflow-hidden">
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
      </PageSection>
    ),

    cta: () => <JournalCtaPanel key="cta" section={content.cta} badgeFallbackIcon={FileText} />,
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
