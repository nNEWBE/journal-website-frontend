"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { FadeIn } from "@/components/layout/page-transition";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isValidating, setIsValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validate token on mount
  useEffect(() => {
    async function validate() {
      if (!token) {
        setIsValidating(false);
        setTokenValid(false);
        setValidationError("No password reset token was provided. Please check the link from your email.");
        return;
      }

      try {
        const res = await authApi.validateResetToken(token);
        if (res.valid) {
          setTokenValid(true);
          setUserEmail(res.email || "");
        } else {
          setTokenValid(false);
          setValidationError(res.message || "This password reset link is invalid or has expired.");
        }
      } catch (err: any) {
        setTokenValid(false);
        setValidationError(err?.message || "Failed to validate reset token. Please request a new one.");
      } finally {
        setIsValidating(false);
      }
    }

    validate();
  }, [token]);

  // Password rules validation
  const hasMinLength = newPassword.length >= 8;
  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenValid || !token) return;

    if (newPassword.length < 8) {
      setSubmitError("Password must be at least 8 characters in length.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSubmitError("Passwords do not match. Please re-enter both fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await authApi.resetPassword(token, newPassword);
      setIsSuccess(true);
      toast.success("Password Reset Successful", {
        description: "Your password has been changed. You can now sign in with your new credentials.",
      });
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      const msg = err?.message || "Failed to reset password. Please request a new recovery link.";
      setSubmitError(msg);
      toast.error("Reset Failed", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FadeIn delay={0.1} className="mx-auto max-w-4xl w-full border border-slate-300 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.12)]">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] items-stretch">

        {/* Left Column: Institutional Brand Showcase */}
        <div className="relative overflow-hidden bg-[#060e22] p-8 sm:p-10 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-amber-400 via-blue-500 to-transparent" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-amber-500/10 blur-[70px]" />

          <div className="relative z-10">
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
                Cryptographic Password Reset
              </h2>
              <p className="text-xs leading-relaxed text-slate-300">
                Set a strong, fresh passphrase to secure your academic profile, peer evaluations, and publication tracking.
              </p>
            </div>

            <div className="mt-8 space-y-2.5 border-t border-white/10 pt-6">
              <div className="bg-white/4 border border-white/10 p-3 flex items-center gap-3.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight">
                    BCrypt 12-Round Hashing
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-normal truncate">
                    Military-grade key derivation
                  </p>
                </div>
              </div>

              <div className="bg-white/4 border border-white/10 p-3 flex items-center gap-3.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight">
                    Active Session Termination
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-normal truncate">
                    Old refresh tokens revoked immediately
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

        {/* Right Column: Reset Form */}
        <div className="p-7 sm:p-10 flex flex-col justify-center bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-1.5 text-[#1e40af]">
              <LockKeyhole className="h-3.5 w-3.5" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.16em]">
                PASSWORD RESET
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

          {/* State 1: Validating Token */}
          {isValidating && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#1e40af]" />
              <p className="text-xs font-bold text-slate-700">Verifying Security Token...</p>
              <p className="text-[11px] text-slate-400">Authenticating token signature with the editorial backend.</p>
            </div>
          )}

          {/* State 2: Invalid / Expired Token */}
          {!isValidating && !tokenValid && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
                <XCircle className="h-6 w-6" />
              </div>

              <div>
                <h1 className="font-academic text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-slate-950">
                  Invalid or Expired Link
                </h1>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {validationError || "This password reset link is invalid or has expired after 30 minutes of issuance."}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed space-y-2">
                <p className="font-bold text-slate-900">Why does this happen?</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11.5px]">
                  <li>Password reset links expire automatically after 30 minutes.</li>
                  <li>Each link can only be used once.</li>
                  <li>Requesting a new link invalidates any previous links.</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/forgot-password"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs text-center"
                >
                  <span>Request New Link</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors text-center"
                >
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          )}

          {/* State 3: Password Form (Token is Valid) */}
          {!isValidating && tokenValid && !isSuccess && (
            <>
              <h1 className="font-academic text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-slate-950">
                Set New Password
              </h1>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                {userEmail ? (
                  <>Resetting password for account <strong className="text-slate-900 font-mono">{userEmail}</strong>.</>
                ) : (
                  <>Enter your new password below to regain full workspace access.</>
                )}
              </p>

              {submitError && (
                <div className="mt-5 flex items-start gap-2.5 bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-900 leading-relaxed animate-fade">
                  <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleReset} className="mt-6 space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    New Password *
                  </label>
                  <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:border-[#1e40af] focus-within:bg-white transition-all">
                    <LockKeyhole className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0 font-mono"
                      placeholder="••••••••"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 focus:outline-none shrink-0 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Confirm New Password *
                  </label>
                  <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:border-[#1e40af] focus-within:bg-white transition-all">
                    <LockKeyhole className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0 font-mono"
                      placeholder="••••••••"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 focus:outline-none shrink-0 cursor-pointer"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-lg space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className={hasMinLength ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {hasMinLength ? <Check className="h-3.5 w-3.5 inline" /> : "•"}
                    </span>
                    <span className={hasMinLength ? "text-slate-800 font-semibold" : "text-slate-500"}>
                      At least 8 characters in length
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={passwordsMatch ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {passwordsMatch ? <Check className="h-3.5 w-3.5 inline" /> : "•"}
                    </span>
                    <span className={passwordsMatch ? "text-slate-800 font-semibold" : "text-slate-500"}>
                      Passwords match
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !hasMinLength || !passwordsMatch}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving New Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* State 4: Success Message */}
          {!isValidating && isSuccess && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div>
                <h1 className="font-academic text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-slate-950">
                  Password Reset Complete
                </h1>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Your academic account password has been successfully updated. All previous active sessions have been revoked for your security.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-700 shrink-0" />
                <span>Redirecting you to the Sign In workspace...</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs text-center"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Footer Assistance */}
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
  );
}

export default function ResetPasswordPage() {
  return (
    <PageShell>
      <section className="relative min-h-[calc(100vh-180px)] flex items-center justify-center bg-[#fbfcff] py-14 sm:py-20 border-b border-slate-200/80">
        <div className="container-x relative z-10">
          <Suspense
            fallback={
              <div className="text-slate-500 text-xs font-bold text-center">
                Loading password reset...
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
