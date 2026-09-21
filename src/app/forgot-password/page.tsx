"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Globe2,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  RotateCw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await authApi.forgotPassword(email.trim().toLowerCase());
      setIsSubmitted(true);
      toast.success("Password reset link sent", {
        description: "If an account exists with this email, instructions have been sent.",
      });
    } catch (err: any) {
      const msg = err?.message || "Failed to process password reset request. Please try again.";
      setErrorMessage(msg);
      toast.error("Request Failed", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleResend() {
    setIsSubmitted(false);
  }

  return (
    <PageShell>
      <section className="relative min-h-[calc(100vh-180px)] flex items-center justify-center bg-[#fbfcff] py-14 sm:py-20 border-b border-slate-200/80">
        <div className="container-x relative z-10">
          <FadeIn delay={0.1} className="mx-auto max-w-4xl w-full border border-slate-300 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.12)]">
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] items-stretch">

              {/* Left Column: Institutional Brand Showcase */}
              <div className="relative overflow-hidden bg-[#060e22] p-8 sm:p-10 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
                {/* Top gold accent line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-amber-400 via-blue-500 to-transparent" />

                {/* Ambient background glows */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/10 blur-[80px]" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-amber-500/10 blur-[70px]" />

                <div className="relative z-10">
                  {/* University Emblem Header */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-12 w-12 shrink-0 bg-white/5 border border-white/15 p-1">
                      <Image
                        src="/gb-logo-official.png"
                        alt="Gono Bishwabidyalay Official Emblem"
                        fill
                        sizes="48px"
                        className="object-contain p-0.5"
                        priority
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
                        গণ বিশ্ববিদ্যালয়
                      </p>
                      <p className="font-ui text-sm font-bold text-white leading-tight">
                        Gono Bishwabidyalay
                      </p>
                      <p className="text-[10.5px] text-slate-400 font-mono">
                        Journal of Research Portal
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <h2 className="font-academic text-xl sm:text-2xl font-medium leading-tight text-white">
                      Account Recovery & Security Desk
                    </h2>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Recover access to your academic workspace, peer review queues, or editorial roles through verified institutional email dispatch.
                    </p>
                  </div>

                  {/* Security Points */}
                  <div className="mt-8 space-y-2.5 border-t border-white/10 pt-6">
                    <div className="bg-white/4 border border-white/10 p-3 flex items-center gap-3.5 shadow-2xs">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white leading-tight">
                          Signed One-Time Token
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-normal truncate">
                          Single-use 30-minute validity link
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/4 border border-white/10 p-3 flex items-center gap-3.5 shadow-2xs">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white leading-tight">
                          Session Revocation
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-normal truncate">
                          Immediate invalidation of old sessions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-10 border-t border-white/10 pt-4 text-[10.5px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
                  <span>ISSN: 2959-1082 (Online)</span>
                  <span>ISSN: 2959-1074 (Print)</span>
                </div>
              </div>

              {/* Right Column: Reset Request Form / Confirmation */}
              <div className="p-7 sm:p-10 flex flex-col justify-center bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-1.5 text-[#1e40af]">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.16em]">
                      CREDENTIALS RECOVERY
                    </span>
                  </div>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#1e40af] transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>

                {!isSubmitted ? (
                  <>
                    <h1 className="font-academic text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-slate-950">
                      Forgot Password?
                    </h1>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      Enter the institutional email address registered with your account. We will dispatch a secure link to reset your credentials.
                    </p>

                    {errorMessage && (
                      <div className="mt-5 flex items-start gap-2.5 bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-900 leading-relaxed animate-fade">
                        <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div>
                        <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Institutional Email Address *
                        </label>
                        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:border-[#1e40af] focus-within:bg-white transition-all">
                          <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0 font-mono"
                            placeholder="scholar@gonobishwabidyalay.edu.bd"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || !email.trim()}
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer mt-4 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Dispatching Reset Link...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Recovery Link</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>

                    <div>
                      <h1 className="font-academic text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-slate-950">
                        Check Your Inbox
                      </h1>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        If an account exists for <strong className="text-slate-900 font-mono">{email}</strong>, we have sent a secure password reset link to that email address.
                      </p>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-blue-900 space-y-1 leading-relaxed">
                      <p className="font-bold text-[11px] uppercase tracking-wider text-blue-950">
                        Important Instructions:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800 text-[11.5px]">
                        <li>The reset link will expire in <strong>30 minutes</strong>.</li>
                        <li>Check your spam or junk folder if the message does not appear shortly.</li>
                        <li>For security, only the most recently requested reset link is valid.</li>
                      </ul>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                      <Link
                        href="/login"
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs text-center"
                      >
                        <span>Return to Sign In</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={handleResend}
                        className="inline-flex items-center justify-center gap-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                        <span>Try Another Email</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Help Note */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
                  <span>
                    Need editorial assistance?{" "}
                    <a
                      href="mailto:editorial@gonobishwabidyalay.edu.bd"
                      className="font-bold text-[#1e40af] hover:underline"
                    >
                      Editorial Desk
                    </a>
                  </span>
                  <Link
                    href="/contact"
                    className="font-semibold text-slate-700 hover:text-[#1e40af] transition-colors"
                  >
                    Contact Secretariat
                  </Link>
                </div>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>
    </PageShell>
  );
}
