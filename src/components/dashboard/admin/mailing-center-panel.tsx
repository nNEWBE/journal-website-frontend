"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Sparkles,
  Users,
  UserCheck,
  PenLine,
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, MailTemplateItem } from "@/lib/api";
import { cn } from "@/lib/utils";

const AUDIENCE_OPTIONS = [
  { id: "ALL_USERS", label: "All Registered Scholars", icon: Users, desc: "Broadcast to every registered user account" },
  { id: "ALL_AUTHORS", label: "All Authors", icon: PenLine, desc: "Send notice to all submitting researchers" },
  { id: "ALL_REVIEWERS", label: "All Reviewers", icon: UserCheck, desc: "Target all peer reviewers in the database" },
  { id: "ALL_EDITORS", label: "Editorial Board & Admins", icon: Shield, desc: "Notify editors and administrators" },
  { id: "INDIVIDUAL", label: "Specific Recipient Email", icon: Mail, desc: "Send to one or multiple specific email addresses" },
];

export function MailingCenterPanel() {
  const [templates, setTemplates] = useState<MailTemplateItem[]>([]);
  const [selectedAudience, setSelectedAudience] = useState("ALL_USERS");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [outboxLogs, setOutboxLogs] = useState<Array<{ id: string; subject: string; audience: string; time: string; count: number }>>([
    {
      id: "LOG-101",
      subject: "Call for Papers: Volume 4, Issue 2",
      audience: "ALL_AUTHORS",
      time: "2 hours ago",
      count: 42,
    },
    {
      id: "LOG-102",
      subject: "Peer Review Reminder Notice",
      audience: "ALL_REVIEWERS",
      time: "Yesterday",
      count: 18,
    },
  ]);

  // Load templates
  useEffect(() => {
    async function loadTemplates() {
      try {
        const data = await adminApi.getMailTemplates();
        if (Array.isArray(data) && data.length > 0) {
          setTemplates(data);
          // Set default template
          setSubject(data[0].subject);
          setMessageBody(data[0].body);
        }
      } catch {
        // Fallback default templates
        setSubject("Call for Papers: Gono Bishwabidyalay Journal of Science & Technology");
        setMessageBody("Dear Scholars,\n\nWe are pleased to invite original research papers and review articles for our upcoming volume. Authors are encouraged to submit manuscripts covering Multidisciplinary Sciences, Health & Pharmacy, Engineering, and Social Sciences.\n\nBest regards,\nEditorial Board\nGono Bishwabidyalay Journal");
      }
    }
    loadTemplates();
  }, []);

  const handleApplyTemplate = (tmpl: MailTemplateItem) => {
    setSubject(tmpl.subject);
    setMessageBody(tmpl.body);
    toast.success(`Loaded template: ${tmpl.name}`);
  };

  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !messageBody.trim()) {
      toast.error("Subject and message body cannot be empty");
      return;
    }
    if (selectedAudience === "INDIVIDUAL" && !recipientEmail.trim()) {
      toast.error("Please enter a recipient email address");
      return;
    }

    try {
      setIsSending(true);
      const res = await adminApi.sendMail({
        audience: selectedAudience,
        recipientEmail: selectedAudience === "INDIVIDUAL" ? recipientEmail.trim() : undefined,
        subject: subject.trim(),
        messageBody: messageBody.trim(),
      });

      toast.success("Email dispatched successfully!", {
        description: `Sent to ${res.sentCount} recipient(s) via background mail queue.`,
      });

      // Add to outbox log
      setOutboxLogs((prev) => [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          subject: subject.trim(),
          audience: selectedAudience,
          time: "Just now",
          count: res.sentCount || 1,
        },
        ...prev,
      ]);

      if (selectedAudience === "INDIVIDUAL") {
        setRecipientEmail("");
      }
    } catch (err: any) {
      toast.error("Failed to send mail", {
        description: err.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-[color:var(--color-gb-border)] pb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-purple-300 bg-purple-50 text-purple-800 font-sans">
            Communications & Automation
          </span>
        </div>
        <h2 className="text-lg font-black text-[color:var(--color-gb-ink)] font-academic tracking-tight mt-1">
          Mailing & Academic Broadcast Center
        </h2>
        <p className="text-xs text-[color:var(--color-gb-muted)]">
          Dispatch announcements, call for papers, and automated review reminders to scholars.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Email Composer */}
        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={handleSendMail} className="rounded-xl border border-[color:var(--color-gb-border)] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
                Compose Message
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Async Background Delivery</span>
            </div>

            {/* Target Audience Selectors */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Target Audience</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AUDIENCE_OPTIONS.map((aud) => {
                  const Icon = aud.icon;
                  const isSelected = selectedAudience === aud.id;
                  return (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => setSelectedAudience(aud.id)}
                      className={cn(
                        "flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-[color:var(--color-gb-blue)] bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", isSelected ? "text-[color:var(--color-gb-blue)]" : "text-slate-400")} />
                      <div className="min-w-0">
                        <p className={cn("text-xs font-bold truncate", isSelected ? "text-[color:var(--color-gb-blue)]" : "text-slate-800")}>
                          {aud.label}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">{aud.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Individual Email Input */}
            {selectedAudience === "INDIVIDUAL" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Email Address(es) *</label>
                <input
                  type="text"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g. reviewer@university.edu, scholar@domain.org"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Subject Line */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject Line *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Call for Papers: Upcoming Volume 4"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 font-sans"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message Content (HTML & Plaintext supported) *</label>
              <textarea
                required
                rows={8}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Compose your message..."
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 font-mono leading-relaxed overflow-y-auto overscroll-contain resize-y min-h-[160px]"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                HTML formatted email header & footer automatically applied.
              </span>

              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue)] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] transition-all hover:shadow hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {isSending ? "Dispatching..." : "Dispatch Broadcast"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Templates & Outbox Stream */}
        <div className="space-y-4">
          {/* Preset Templates */}
          <div className="rounded-xl border border-[color:var(--color-gb-border)] bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Quick Email Templates
            </h3>
            <div className="space-y-2">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.key}
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
                >
                  <p className="text-xs font-bold text-slate-800 group-hover:text-[color:var(--color-gb-blue)]">{tmpl.name}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{tmpl.subject}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Outbox Activity */}
          <div className="rounded-xl border border-[color:var(--color-gb-border)] bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[color:var(--color-gb-blue)]" />
              Recent Outbox Activity
            </h3>
            <div className="space-y-2">
              {outboxLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg border border-slate-100 bg-[#f9fafc] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 truncate max-w-[170px]">{log.subject}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      {log.count} sent
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{log.audience.replace("ALL_", "All ").toLowerCase()}</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
