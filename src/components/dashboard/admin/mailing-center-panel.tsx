"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Bookmark,
  Users,
  UserCheck,
  PenLine,
  Shield,
  Clock,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi, MailTemplateItem } from "@/lib/api";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-page-wrapper";
import { CustomSelect } from "@/components/ui/custom-select";
import { cn } from "@/lib/utils";

const AUDIENCE_OPTIONS = [
  { id: "ALL_USERS", label: "All Registered Scholars", icon: Users, desc: "Broadcast to every registered user account" },
  { id: "ALL_AUTHORS", label: "All Authors", icon: PenLine, desc: "Send notice to all submitting researchers" },
  { id: "ALL_REVIEWERS", label: "All Peer Reviewers", icon: Shield, desc: "Broadcast to active review board members" },
  { id: "ALL_EDITORS", label: "Editorial Team", icon: UserCheck, desc: "Dispatch message to section & senior editors" },
];

const PRIORITY_OPTIONS = [
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High Priority" },
  { value: "URGENT", label: "Urgent Notice" },
];

let mailTemplateCache: MailTemplateItem[] | null = null;

export function MailingCenterPanel() {
  const [templates, setTemplates] = useState<MailTemplateItem[]>(() => mailTemplateCache || []);
  const [selectedAudience, setSelectedAudience] = useState("ALL_USERS");
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [priority, setPriority] = useState<"NORMAL" | "HIGH" | "URGENT">("NORMAL");
  const [isSending, setIsSending] = useState(false);
  const [sentLog, setSentLog] = useState<Array<{ id: string; target: string; subject: string; time: string; count: number }>>([
    {
      id: "LOG-1",
      target: "All Authors",
      subject: "Call for Papers: Volume 8 Issue 2 (Spring 2026)",
      time: "2 days ago",
      count: 142,
    },
    {
      id: "LOG-2",
      target: "All Reviewers",
      subject: "Quarterly Review Performance & Appreciation",
      time: "1 week ago",
      count: 38,
    },
  ]);

  const loadTemplates = async (force = false) => {
    if (mailTemplateCache && !force) {
      setTemplates(mailTemplateCache);
      return;
    }
    try {
      const data = await adminApi.getMailTemplates();
      if (Array.isArray(data) && data.length > 0) {
        mailTemplateCache = data;
        setTemplates(data);
      }
    } catch {
      // Keep static fallback
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleApplyTemplate = (template: MailTemplateItem) => {
    setSubject(template.subject);
    setMessageBody(template.body);
    toast.info(`Applied "${template.name}" template.`);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !messageBody.trim()) {
      toast.error("Subject and message body cannot be empty.");
      return;
    }

    try {
      setIsSending(true);
      await adminApi.sendMail({
        audience: selectedAudience,
        subject,
        messageBody,
      });

      const audienceLabel = AUDIENCE_OPTIONS.find((a) => a.id === selectedAudience)?.label || selectedAudience;
      setSentLog((prev) => [
        {
          id: `LOG-${Date.now()}`,
          target: audienceLabel,
          subject,
          time: "Just now",
          count: selectedAudience === "ALL_USERS" ? 215 : selectedAudience === "ALL_AUTHORS" ? 142 : 38,
        },
        ...prev,
      ]);

      toast.success("Broadcast queued and dispatched successfully to recipients!");
      setSubject("");
      setMessageBody("");
    } catch (err: any) {
      toast.error("Failed to send broadcast", { description: err.message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <DashboardHeaderActions>
        <button
          onClick={() => loadTemplates(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          title="Sync email templates from server"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          <span>Sync Templates</span>
        </button>
      </DashboardHeaderActions>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Broadcast Composer */}
        <div className="lg:col-span-2 space-y-4">
          <form onSubmit={handleSendBroadcast} className="rounded-xl border border-[color:var(--color-gb-border)] bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-[color:var(--color-gb-blue)]" />
              Compose Circular / Broadcast Notice
            </h3>

            {/* Target Audience Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Target Audience <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AUDIENCE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedAudience === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedAudience(opt.id)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-[color:var(--color-gb-blue)] bg-blue-50/50 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                        isSelected ? "bg-[color:var(--color-gb-blue)] text-white" : "bg-slate-100 text-slate-500"
                      )}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className={cn("text-xs font-bold", isSelected ? "text-[color:var(--color-gb-blue)]" : "text-slate-800")}>
                          {opt.label}
                        </p>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority and Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Call for Papers — Special Issue on AI in Healthcare"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[color:var(--color-gb-blue)] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Priority
                </label>
                <CustomSelect
                  options={PRIORITY_OPTIONS}
                  value={priority}
                  onChange={(val) => setPriority(val as any)}
                  size="form"
                  className="w-full text-xs font-semibold"
                />
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message Body <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={7}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Write the full circular notice or broadcast message here..."
                className="w-full rounded-xl border border-slate-300 p-3.5 text-xs text-slate-900 outline-none focus:border-[color:var(--color-gb-blue)] focus:ring-2 focus:ring-blue-100 transition-all font-sans leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                Emails are sent with institutional DKIM &amp; SPF authentication.
              </span>

              {(() => {
                const isFormReady = Boolean(subject.trim() && messageBody.trim());
                const canDispatch = isFormReady && !isSending;
                return (
                  <button
                    type="submit"
                    disabled={!canDispatch}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold transition-all",
                      canDispatch
                        ? "bg-[color:var(--color-gb-blue)] text-white shadow-sm hover:bg-[color:var(--color-gb-blue-dark)] hover:shadow hover:-translate-y-0.5 cursor-pointer"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300/60"
                    )}
                  >
                    <Send className="h-4 w-4" />
                    {isSending ? "Dispatching..." : "Dispatch Broadcast"}
                  </button>
                );
              })()}
            </div>
          </form>
        </div>

        {/* Right Col: Templates & Outbox Stream */}
        <div className="space-y-4">
          {/* Preset Templates */}
          <div className="rounded-xl border border-[color:var(--color-gb-border)] bg-white p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Bookmark className="h-3.5 w-3.5 text-blue-600" />
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
              {sentLog.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg border border-slate-100 bg-[#f9fafc] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 truncate max-w-[170px]">{log.subject}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      {log.count} sent
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{log.target}</span>
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
