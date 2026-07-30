"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import { CustomSelect } from "@/components/ui/custom-select";

const roleOptions = [
  "Author / Submitter",
  "Peer Reviewer",
  "Editor / Editorial Member",
  "Institutional Reader / Other",
];

const topicOptions = [
  "General Inquiry",
  "Submission Assistance",
  "Portal Troubleshooting",
  "Archiving & Licensing",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Author / Submitter",
    subject: "General Inquiry",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [reference, setReference] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
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
        role: "Author / Submitter",
        subject: "General Inquiry",
        message: "",
      });
    }, 1200);
  };

  return (
    <PageShell>
      {/* Dark Navy Glass Hero Header */}
      <section className="hero-masthead relative z-20 bg-gradient-to-br from-[#0b123d] via-[#111b52] to-[#0b123d] text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden hero-pattern" />
        <div className="container-x relative py-10 md:py-14">
          <FadeIn delay={0.1} className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/70 backdrop-blur-md">
              <Mail className="h-3.5 w-3.5 text-white/60" />
              <span>Editorial Desk</span>
            </span>
            <h1 className="mt-4 font-academic text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl md:text-[42px]">
              Contact Editorial Office
            </h1>
            <p className="mt-3.5 max-w-xl text-xs leading-6 text-white/60 md:text-sm">
              Get in touch with the Gono Bishwabidyalay Journal of Research. We welcome manuscript inquiries, reviewer applications, and institutional feedback.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container-x py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] items-start">
          
          {/* Column 1: Info Cards */}
          <FadeIn delay={0.15} className="space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-6 shadow-xs hover-glow transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold font-academic text-[color:var(--color-gb-blue-deep)]">
                  Office Directory
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Desk Active Today
                </span>
              </div>
              
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Postal Address</h3>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">
                      Gono Bishwabidyalay, Nolam,<br />
                      Savar, Dhaka 1344, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Electronic Mail</h3>
                    <a
                      href="mailto:journal@gonouniversity.edu.bd"
                      className="mt-1 inline-block text-sm font-bold text-[color:var(--color-gb-blue-deep)] hover:text-[color:var(--color-gb-blue)] transition-colors"
                    >
                      journal@gonouniversity.edu.bd
                    </a>
                    <p className="text-[11px] mt-0.5 text-slate-500">
                      For manuscript status and submission support
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Phone Directory</h3>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      +880-2-7740060 <span className="font-normal text-slate-500">(Ext: 104)</span>
                    </p>
                    <p className="text-[11px] mt-0.5 text-slate-500">
                      Sunday to Thursday, 9:00 AM – 4:00 PM (GMT+6)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Response Window</h3>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      Usually within 2–3 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Indexing & Manuscript ID helper */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5">
              <h3 className="flex items-center gap-2 text-xs font-bold text-[color:var(--color-gb-blue-deep)]">
                <Building2 className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                <span>Scholarly Archiving Note</span>
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 font-medium">
                All communications sent to the editorial office are logged for administrative transparency. When inquiring about a submission under review, please include your unique <strong>Manuscript ID</strong>.
              </p>
            </div>
          </FadeIn>

          {/* Column 2: Inquiry Form */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)]">
                <MessageSquare className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-lg font-bold font-academic text-[color:var(--color-gb-blue-deep)]">
                  Send a Message
                </h2>
                <p className="text-xs text-slate-500">
                  Fill out the form below to reach the appropriate editorial desk.
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Prof. / Dr. / Mr. / Ms."
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs bg-white text-slate-800 font-medium outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs bg-white text-slate-800 font-medium outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    Academic Role
                  </label>
                  <CustomSelect
                    options={roleOptions}
                    value={formData.role}
                    onChange={(val) => setFormData({ ...formData, role: val })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    Topic Category
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
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Detailed Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter details of your inquiry, referencing your manuscript numbers if applicable..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs bg-white text-slate-800 font-medium leading-relaxed outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Status Banner */}
              {status === "success" && (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 animate-fade">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-xs font-medium">
                    Thank you! Your message has been successfully logged with reference number <strong>{reference}</strong>. Our editorial desk will reply shortly.
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-900 animate-fade">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                  <p className="text-xs font-medium">
                    Please fill out all required fields before sending.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--color-gb-blue-deep)] hover:bg-[color:var(--color-gb-blue)] px-6 py-3 text-xs font-extrabold text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section: Integrated Google Map Container */}
        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
          <div className="bg-slate-50/80 border-b border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold font-academic text-[color:var(--color-gb-blue-deep)]">Campus Location Map</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Gono Bishwabidyalay, Nolam, Savar, Dhaka 1344, Bangladesh</p>
            </div>
            <a
              href="https://maps.google.com/?q=Gono+Bishwabidyalay,+Nolam,+Savar,+Dhaka"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[color:var(--color-gb-blue)] hover:text-[color:var(--color-gb-blue-deep)] uppercase tracking-wider transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          
          {/* Embedded Google Map Iframe */}
          <div className="relative h-[340px] w-full bg-slate-100">
            <iframe
              title="Gono Bishwabidyalay Location Map"
              src="https://maps.google.com/maps?q=Gono+Bishwabidyalay,+Nolam,+Savar,+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="h-full w-full border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
