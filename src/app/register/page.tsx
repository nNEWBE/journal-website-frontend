"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Check,
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
  Users,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { CustomSelect } from "@/components/ui/custom-select";
import { registerUser, type User } from "@/lib/auth";
import { FadeIn } from "@/components/layout/page-transition";

const ACCOUNT_ROLE_OPTIONS = [
  "Author / Submitter",
  "Peer Reviewer",
  "Institutional Scholar / Reader",
];

function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [department, setDepartment] = useState("");
  const [accountRole, setAccountRole] = useState(ACCOUNT_ROLE_OPTIONS[0]);
  const [orcid, setOrcid] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeEthics, setAgreeEthics] = useState(true);
  const [agreeOpenAccess, setAgreeOpenAccess] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill out all mandatory registration fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters in length.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your entries.");
      return;
    }

    if (!agreeEthics || !agreeOpenAccess) {
      setError("Please agree to the editorial ethics and open-access declarations to proceed.");
      return;
    }

    setIsLoading(true);

    const roleMapping: Record<string, "author" | "reviewer" | "editor" | "admin" | "super-admin"> = {
      "Author / Submitter": "author",
      "Peer Reviewer": "reviewer",
      "Institutional Scholar / Reader": "author",
    };

    const targetRole = roleMapping[accountRole] || "author";

    const newUser: User = {
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      role: targetRole,
      title: fullName.trim(),
      department: department.trim() || institution.trim() || "Academic Faculty",
      avatar: targetRole === "reviewer"
        ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    };

    setTimeout(() => {
      registerUser(newUser);
      router.push(`/dashboard/${targetRole}`);
    }, 600);
  }

  return (
    <FadeIn delay={0.1} className="mx-auto max-w-5xl w-full border border-slate-300 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.12)]">
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
                Join the Scholarly Research Community
              </h2>
              <p className="text-xs leading-relaxed text-slate-300">
                Create your verified academic profile to submit manuscripts, review groundbreaking investigations, or track disciplinary citations.
              </p>
            </div>

            {/* Membership Value Cards */}
            <div className="mt-8 space-y-2.5 border-t border-white/10 pt-6">
              <div className="bg-white/[0.04] border border-white/10 p-3 flex items-center gap-3.5 shadow-2xs hover:bg-white/[0.07] transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight">
                    Author Submission Workspace
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-normal truncate">
                    14-day turnaround with zero APC fees
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 p-3 flex items-center gap-3.5 shadow-2xs hover:bg-white/[0.07] transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight">
                    Peer Reviewer Network
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-normal truncate">
                    Formal editorial recognition & certificates
                  </p>
                </div>
              </div>

              <div className="bg-white/[0.04] border border-white/10 p-3 flex items-center gap-3.5 shadow-2xs hover:bg-white/[0.07] transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <Globe2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight">
                    Global Open Access Reach
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-normal truncate">
                    CC BY 4.0 with author-retained rights
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

        {/* Right Column: Registration Form */}
        <div className="p-7 sm:p-10 flex flex-col justify-center bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-1.5 text-[#1e40af]">
              <LockKeyhole className="h-3.5 w-3.5" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.16em]">
                NEW ACCOUNT REGISTRATION
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 uppercase tracking-wider">
              System Active
            </span>
          </div>

          <h1 className="font-academic text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-slate-950">
            Create Academic Account
          </h1>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Register your verified scholarly credentials to access manuscript submission, referee dashboards, and publication tools.
          </p>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-900 leading-relaxed animate-fade">
              <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Farhana Rahman or Md. Jamil Hossain"
                className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#1e40af] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Email & Account Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Institutional Email *
                </label>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:border-[#1e40af] focus-within:bg-white transition-all">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu.bd"
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Primary Role
                </label>
                <CustomSelect
                  options={ACCOUNT_ROLE_OPTIONS}
                  value={accountRole}
                  onChange={setAccountRole}
                  className="w-full"
                />
              </div>
            </div>

            {/* Affiliation & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  University / Institution *
                </label>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:border-[#1e40af] focus-within:bg-white transition-all">
                  <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Gono Bishwabidyalay / University"
                    className="w-full bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Department / Faculty
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Department of Public Health"
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:border-[#1e40af] focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* ORCID ID (Optional) */}
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                ORCID Identifier <span className="text-slate-400 font-normal font-mono">(Optional)</span>
              </label>
              <input
                type="text"
                value={orcid}
                onChange={(e) => setOrcid(e.target.value)}
                placeholder="0000-0002-1825-0097"
                className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:border-[#1e40af] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Confirm Password *
                </label>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:border-[#1e40af] focus-within:bg-white transition-all">
                  <LockKeyhole className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0 font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Declarations Checkboxes */}
            <div className="space-y-3 pt-2 text-xs text-slate-600">
              <button
                type="button"
                onClick={() => setAgreeEthics(!agreeEthics)}
                className="flex items-start gap-3 text-left group cursor-pointer"
              >
                <div
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-all ${
                    agreeEthics
                      ? "bg-[#0b1b3d] border-[#0b1b3d] text-white shadow-2xs"
                      : "bg-white border-slate-300 group-hover:border-slate-400"
                  }`}
                >
                  {agreeEthics && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <span className="leading-snug">
                  I agree to abide by the <strong className="text-slate-900 font-semibold">COPE Publishing Ethics</strong>, author transparency standards, and double-blind peer-review guidelines.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAgreeOpenAccess(!agreeOpenAccess)}
                className="flex items-start gap-3 text-left group cursor-pointer"
              >
                <div
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-all ${
                    agreeOpenAccess
                      ? "bg-[#0b1b3d] border-[#0b1b3d] text-white shadow-2xs"
                      : "bg-white border-slate-300 group-hover:border-slate-400"
                  }`}
                >
                  {agreeOpenAccess && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <span className="leading-snug">
                  I consent to open-access dissemination under the <strong className="text-slate-900 font-semibold">Creative Commons CC BY 4.0</strong> license with author copyright retention.
                </span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating Academic Profile...</span>
                </>
              ) : (
                <>
                  <span>Create Workspace Account</span>
                  <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Callout */}
          <div className="mt-6 bg-slate-50 border border-slate-200/80 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-600 font-medium">
              Already have an academic account?
            </span>
            <Link
              href="/login"
              className="font-bold text-[#1e40af] hover:underline inline-flex items-center gap-1"
            >
              <span>Sign In to Workspace</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span>
              Need registration assistance?{" "}
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

export default function RegisterPage() {
  return (
    <PageShell>
      <section className="relative min-h-[calc(100vh-180px)] flex items-center justify-center bg-[#fbfcff] py-14 sm:py-20 border-b border-slate-200/80">
        <div className="container-x relative z-10">
          <Suspense
            fallback={
              <div className="text-slate-500 text-xs font-bold text-center">
                Loading registration workspace...
              </div>
            }
          >
            <RegisterForm />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
