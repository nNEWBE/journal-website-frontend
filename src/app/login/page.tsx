"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck2,
  Globe2,
  GraduationCap,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { CustomSelect } from "@/components/ui/custom-select";
import { authenticate, DEMO_USERS, getSession } from "@/lib/auth";
import { GbJournalLogo } from "@/components/layout/gb-logo";

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

    const userSession = authenticate(email, password);
    if (userSession) {
      window.location.href = redirect;
    } else {
      setError("Invalid credentials. Please verify your email and password.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_70px_rgba(11,18,61,0.14)]">
      <div className="grid lg:grid-cols-12 items-stretch">
        
        {/* Left Column: Institutional Brand Showcase */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0b123d] via-[#111b52] to-[#0b123d] p-8 text-white lg:col-span-5 lg:p-10 flex flex-col justify-between">
          <div className="pointer-events-none absolute inset-0 overflow-hidden hero-pattern opacity-30" />
          
          <div className="relative z-10">
            <div className="[&_p]:text-white">
              <GbJournalLogo />
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="font-academic text-xl font-bold leading-tight text-white">
                Academic Research Portal & Editorial Management
              </h2>
              <p className="text-xs leading-relaxed text-white/60 font-medium">
                Sign in to access your assigned manuscripts, review queues, or editorial oversight dashboards.
              </p>
            </div>

            <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-xs text-white/70">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Double-blind Peer Review</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Crossref & Permanent DOI Indexing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Open Access Academic Dissemination</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 border-t border-white/10 pt-4 text-[10px] font-semibold text-white/40">
            <span>ISSN (Online): 2959-1082 · ISSN (Print): 2959-1074</span>
          </div>
        </div>

        {/* Right Column: Sleek Login Form */}
        <div className="p-7 sm:p-9 lg:col-span-7 flex flex-col justify-center bg-white">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-gb-blue-soft)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[color:var(--color-gb-blue)]">
              <LockKeyhole className="h-3 w-3" />
              <span>Secure Authentication</span>
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              Portal Active
            </span>
          </div>

          <h1 className="mt-4 font-academic text-2xl font-bold tracking-tight text-[color:var(--color-gb-blue-deep)] sm:text-3xl">
            Access Journal Workspace
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium">
            Select your academic role to auto-configure access or enter your credentials.
          </p>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-900 leading-relaxed animate-fade">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Academic Role Selector */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Select Academic Role
              </label>
              <CustomSelect
                options={ROLE_OPTIONS}
                value={selectedRole}
                onChange={handleRoleChange}
                className="w-full"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 transition-all focus-within:border-slate-300">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  placeholder="email@gonouniversity.edu.bd"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 transition-all focus-within:border-slate-300">
                <LockKeyhole className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 focus:outline-none shrink-0"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--color-gb-blue-deep)] hover:bg-[color:var(--color-gb-blue)] py-3.5 text-xs font-extrabold text-white shadow-xs transition-all cursor-pointer mt-3"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">
            <span>
              Need assistance?{" "}
              <a
                href="mailto:journal@gonouniversity.edu.bd"
                className="font-bold text-[color:var(--color-gb-blue-deep)] hover:underline"
              >
                Editorial Desk
              </a>
            </span>
            <Link
              href="/contact"
              className="font-bold text-[color:var(--color-gb-blue)] hover:text-[color:var(--color-gb-blue-deep)] transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PageShell>
      <section className="relative min-h-[calc(100vh-180px)] flex items-center justify-center bg-[#f8f9fc] py-12 md:py-16">
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
