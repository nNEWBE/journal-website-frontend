"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck2,
  Globe2,
  GraduationCap,
  KeyRound,
  Landmark,
  Library,
  Loader2,
  LockKeyhole,
  Mail,
  Scale,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { CustomSelect } from "@/components/ui/custom-select";
import { authenticate, getSession } from "@/lib/auth";
import { FadeIn } from "@/components/layout/page-transition";

const ROLE_OPTIONS = [
  "Super Admin — Prof. Dr. Laila Rahman",
  "System Administrator — Md. Jamil Hossain",
  "Managing Editor — Prof. Saiful Islam",
  "Peer Reviewer — Dr. Salma Khatun",
  "Author / Submitter — Ayesha Siddique",
];

const ROLE_EMAIL_MAP: Record<string, string> = {
  "Super Admin — Prof. Dr. Laila Rahman": "superadmin@gonouniversity.edu.bd",
  "System Administrator — Md. Jamil Hossain": "admin@gonouniversity.edu.bd",
  "Managing Editor — Prof. Saiful Islam": "editor@gonouniversity.edu.bd",
  "Peer Reviewer — Dr. Salma Khatun": "reviewer@gonouniversity.edu.bd",
  "Author / Submitter — Ayesha Siddique": "author@gonouniversity.edu.bd",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [selectedRole, setSelectedRole] = useState(ROLE_OPTIONS[0]);
  const [email, setEmail] = useState(ROLE_EMAIL_MAP[ROLE_OPTIONS[0]]);
  const [password, setPassword] = useState("demopass");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (getSession()) {
      router.push(redirect);
    }
  }, [router, redirect]);

  function handleRoleChange(role: string) {
    setSelectedRole(role);
    const mappedEmail = ROLE_EMAIL_MAP[role];
    if (mappedEmail) {
      setEmail(mappedEmail);
      setPassword("demopass");
    }
    setError(null);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const userSession = authenticate(email, password);
      if (userSession) {
        window.location.href = redirect;
      } else {
        setIsLoading(false);
        setError("Invalid credentials. Please verify your email and password.");
      }
    }, 400);
  }

  return (
    <FadeIn delay={0.1} className="mx-auto max-w-4xl w-full border border-slate-300 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.12)]">
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] items-stretch">
        
        {/* Left Column: Institutional Brand Showcase */}
        <div className="relative overflow-hidden bg-[#060e22] p-8 sm:p-10 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Top gold accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400 via-blue-500 to-transparent" />
          
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
                Scholarly Portal & Editorial Workspace
              </h2>
              <p className="text-xs leading-relaxed text-slate-300">
                Authenticate to access your designated manuscripts, review queues, editorial decision workflows, or author tracking dashboards.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 space-y-2.5 border-t border-white/10 pt-6">
              <div className="bg-white/[0.04] border border-white/10 p-3 flex items-center gap-3.5 shadow-2xs hover:bg-white/[0.07] transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight">
                    Double-Blind Peer Review
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-normal truncate">
                    COPE-aligned anonymous evaluation
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 p-3 flex items-center gap-3.5 shadow-2xs hover:bg-white/[0.07] transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Globe2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight">
                    CrossRef DOI & Persistent Archiving
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-normal truncate">
                    Universal Open Access preservation
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 p-3 flex items-center gap-3.5 shadow-2xs hover:bg-white/[0.07] transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight">
                    256-Bit Encrypted Session Security
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-normal truncate">
                    Role-isolated cryptographic access
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

        {/* Right Column: Sleek Authentication Form */}
        <div className="p-7 sm:p-10 flex flex-col justify-center bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-1.5 text-[#1e40af]">
              <LockKeyhole className="h-3.5 w-3.5" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.16em]">
                SECURE WORKSPACE
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 uppercase tracking-wider">
              System Active
            </span>
          </div>

          <h1 className="font-academic text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-slate-950">
            Sign In to Workspace
          </h1>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Select an academic role to auto-populate test credentials, or enter your registered university email.
          </p>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-900 leading-relaxed animate-fade">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Academic Role Selector */}
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Quick Role Auto-Fill
              </label>
              <CustomSelect
                options={ROLE_OPTIONS}
                value={selectedRole}
                onChange={handleRoleChange}
                className="w-full"
              />
            </div>

            {/* Email Field */}
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
                  placeholder="author@gonobishwabidyalay.edu.bd"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password *
              </label>
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:border-[#1e40af] focus-within:bg-white transition-all">
                <LockKeyhole className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0 font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 focus:outline-none shrink-0 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Register Callout */}
          <div className="mt-5 bg-slate-50 border border-slate-200/80 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-600 font-medium">
              Don&apos;t have an academic account?
            </span>
            <Link
              href="/register"
              className="font-bold text-[#1e40af] hover:underline inline-flex items-center gap-1"
            >
              <span>Register New Profile</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

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

export default function LoginPage() {
  return (
    <PageShell>
      <section className="relative min-h-[calc(100vh-180px)] flex items-center justify-center bg-[#fbfcff] py-14 sm:py-20 border-b border-slate-200/80">
        <div className="container-x relative z-10">
          <Suspense
            fallback={
              <div className="text-slate-500 text-xs font-bold text-center">
                Loading login workspace...
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
