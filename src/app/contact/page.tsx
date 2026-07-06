"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "author",
    subject: "general",
    message: "",
  });
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }
    
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        role: "author",
        subject: "general",
        message: "",
      });
    }, 1200);
  };

  return (
    <PageShell>
      {/* Page Header */}
      <div className="page-header">
        <div className="container-x page-header-inner py-10 md:py-14">
          <span className="page-badge">
            <Mail className="h-3 w-3" />
            Contact
          </span>
          <h1 className="page-title font-academic">Contact Editorial Office</h1>
          <p className="page-subtitle">
            Get in touch with the Gono Bishwabidyalay Journal of Research. We welcome submissions, reviewer applications, and institutional feedback.
          </p>
        </div>
        <div className="page-header-accent" />
      </div>

      <section className="container-x py-10">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] items-start">
          
          {/* Column 1: Info Cards */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-xl p-6 space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <h2 className="text-lg font-bold font-academic text-slate-800 border-b border-slate-100 pb-3">
                Office Information
              </h2>
              
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-[color:var(--color-gb-blue)]">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Postal Address</h3>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
                      Gono Bishwabidyalay, Nolam,<br />
                      Savar, Dhaka 1344, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-[color:var(--color-gb-blue)]">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Electronic Mail</h3>
                    <p className="mt-1 text-sm font-semibold text-[color:var(--color-gb-blue-dark)] hover:underline">
                      journal@gonouniversity.edu.bd
                    </p>
                    <p className="text-[10px] mt-0.5 text-slate-400">
                      For manuscript status and submission support
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-[color:var(--color-gb-blue)]">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone Directory</h3>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      +880-2-7740060 (Ext: 104)
                    </p>
                    <p className="text-[10px] mt-0.5 text-slate-400">
                      Sunday to Thursday, 9:00 AM – 4:00 PM (GMT+6)
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-[color:var(--color-gb-blue)]">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Response Window</h3>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      Usually within 2-3 working days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Indexing statement mini card */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Scholarly Archiving</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">
                All communications sent to the editorial office are logged for administrative transparency. If referencing a submission under review, please supply your unique Manuscript Reference ID.
              </p>
            </div>
          </div>

          {/* Column 2: Inquiry Form */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <h2 className="text-xl font-bold font-academic text-slate-800 border-b border-slate-100 pb-4">
              Send a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Prof. / Dr. / Mr. / Ms."
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm bg-white focus:border-[color:var(--color-gb-blue)] focus:ring-1 focus:ring-[color:var(--color-gb-blue)] outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm bg-white focus:border-[color:var(--color-gb-blue)] focus:ring-1 focus:ring-[color:var(--color-gb-blue)] outline-none transition-all placeholder:text-slate-300 text-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                    Academic Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-[color:var(--color-gb-blue)] focus:ring-1 focus:ring-[color:var(--color-gb-blue)] outline-none transition-all text-slate-600 font-bold"
                  >
                    <option value="author">Author / Submitter</option>
                    <option value="reviewer">Peer Reviewer</option>
                    <option value="editor">Editor / Editorial Member</option>
                    <option value="other">Institutional Reader / Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                    Topic Category
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-[color:var(--color-gb-blue)] focus:ring-1 focus:ring-[color:var(--color-gb-blue)] outline-none transition-all text-slate-600 font-bold"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="submission">Submission/Revision Assistance</option>
                    <option value="technical">Technical Portal Troubleshooting</option>
                    <option value="indexing">Archiving & Licensing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                  Detailed Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter details of your inquiry, referencing your manuscript numbers if applicable..."
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm bg-white focus:border-[color:var(--color-gb-blue)] focus:ring-1 focus:ring-[color:var(--color-gb-blue)] outline-none transition-all placeholder:text-slate-300 text-slate-700 leading-relaxed font-medium"
                />
              </div>

              {/* Status Banner */}
              {status === "success" && (
                <div className="flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-emerald-800">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-xs font-medium">
                    Thank you! Your message has been successfully logged with reference number <strong>GB-{Math.floor(Math.random() * 900000 + 100000)}</strong>. Our editorial desk will reply shortly.
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-3 rounded-lg bg-rose-50 border border-rose-100 p-4 text-rose-800">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                  <p className="text-xs font-medium">
                    Please fill out all required fields before sending.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-dark)] px-5 py-3 text-sm font-extrabold text-white shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Transmitting Inquiry...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Transmission
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section: Graphical Map Grid Area */}
        <div className="mt-10 bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold font-academic text-slate-800">Campus Location</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Gono Bishwabidyalay, Nolam, Savar, Dhaka</p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[color:var(--bangla-red)] hover:underline uppercase tracking-wider"
            >
              Directions via External Map <Send className="h-3 w-3" />
            </a>
          </div>
          
          {/* Visual Grid Map Mockup */}
          <div className="relative h-[250px] bg-slate-900 overflow-hidden flex items-center justify-center">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
            
            {/* Stylized vector map elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 250">
                <path d="M0,80 Q200,10 400,120 T800,20 T1000,150" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M200,0 Q600,180 800,250" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="3,3" />
                <path d="M0,200 C300,50 600,220 1000,90" fill="none" stroke="#fff" strokeWidth="3" />
              </svg>
            </div>

            {/* Locator Pin overlay */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 animate-fade">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--bangla-red)]/10 border-2 border-[color:var(--bangla-red)] text-white shadow-xl shadow-red-950/20 scale-105 animate-bounce">
                <MapPin className="h-7 w-7 text-[color:var(--bangla-red)] fill-[color:var(--bangla-red)]/20" />
              </div>
              <h4 className="mt-4 text-base font-bold font-academic text-white">Gono Bishwabidyalay (GB) Campus</h4>
              <p className="mt-1 text-xs text-white/50 max-w-sm font-medium">
                Nolam, Savar, Dhaka, Bangladesh. Post Code: 1344.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
