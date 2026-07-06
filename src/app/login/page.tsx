"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, LockKeyhole, Mail, ShieldAlert, Sparkles, UserCheck } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { authenticate, DEMO_USERS, getSession } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("superadmin@gonouniversity.edu.bd");
  const [password, setPassword] = useState("demopass");
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (getSession()) {
      router.push(redirect);
    }
  }, [router, redirect]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const userSession = authenticate(email, password);
    if (userSession) {
      // Force reload to update headers, then navigate
      window.location.href = redirect;
    } else {
      setError("Invalid email or password. Password is 'demopass'. Use a listed university email.");
    }
  }

  function handleQuickLogin(demoEmail: string) {
    setError(null);
    setEmail(demoEmail);
    setPassword("demopass");
    
    const userSession = authenticate(demoEmail, "demopass");
    if (userSession) {
      window.location.href = redirect;
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 items-start max-w-5xl w-full">
      {/* Left Column: Form Card */}
      <div className="lg:col-span-7 rounded-xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-white">
        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[color:var(--color-gb-blue)] via-[color:var(--color-gb-gold)] to-[color:var(--color-gb-red)]" />
        
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-gb-blue-soft)] border border-[color:var(--color-gb-border)] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[color:var(--color-gb-blue-dark)]">
          <LockKeyhole className="h-3 w-3" />
          Secure Workspace
        </span>
        <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-[color:var(--color-gb-blue-dark)] font-academic">
          Access Journal Workspace
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-[color:var(--ink-muted)]">
          Log in with your academic credentials to manage submissions, coordinate review workflows, or edit published issues.
        </p>

        {error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-800 leading-normal">
            <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div className="grid gap-2">
            <span className="text-xs font-black text-[color:var(--color-gb-blue-dark)]">Email Address</span>
            <div className="flex items-center gap-3 rounded-lg border border-[color:var(--border)] bg-white px-3 py-2.5 transition-all focus-within:border-[color:var(--color-gb-blue)] focus-within:ring-1 focus-within:ring-[color:var(--color-gb-blue)]">
              <Mail className="h-4 w-4 text-[color:var(--ink-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-[color:var(--foreground)]"
                placeholder="email@gonouniversity.edu.bd"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <span className="text-xs font-black text-[color:var(--color-gb-blue-dark)]">Password</span>
            <div className="flex items-center gap-3 rounded-lg border border-[color:var(--border)] bg-white px-3 py-2.5 transition-all focus-within:border-[color:var(--color-gb-blue)] focus-within:ring-1 focus-within:ring-[color:var(--color-gb-blue)]">
              <LockKeyhole className="h-4 w-4 text-[color:var(--ink-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm outline-none text-[color:var(--foreground)]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--color-gb-blue)] hover:bg-[color:var(--color-gb-blue-dark)] py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-900/20 transition-all cursor-pointer mt-2"
          >
            Sign In to Account
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-bold text-[color:var(--ink-muted)] border-t border-[color:var(--border)] pt-4">
          Need a workspace? Contact <a href="mailto:admin@gonouniversity.edu.bd" className="text-[color:var(--color-gb-blue)] hover:underline">Journal Operations</a>.
        </div>
      </div>

      {/* Right Column: Demo Accounts Quick Select */}
      <div className="lg:col-span-5 rounded-xl p-5 md:p-6 bg-white/[0.06] border border-white/10 backdrop-blur-sm">
        <h3 className="font-academic text-sm font-extrabold text-white flex items-center gap-1.5 border-b border-white/10 pb-2.5">
          <Sparkles className="h-4 w-4 text-[color:var(--color-gb-gold)] animate-pulse" />
          Developer Quick-Login
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-white/50">
          Click any pre-configured role account below to auto-fill and log in instantly:
        </p>

        <div className="mt-4 space-y-2.5">
          {DEMO_USERS.map((demo) => (
            <button
              key={demo.role}
              type="button"
              onClick={() => handleQuickLogin(demo.email)}
              className="w-full flex items-center justify-between gap-3 text-left border border-white/10 rounded-lg p-3 bg-white/[0.04] hover:border-[color:var(--color-gb-gold)]/40 hover:bg-white/[0.08] transition-all cursor-pointer group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white truncate">{demo.name}</span>
                  <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-white/10 text-[color:var(--color-gb-gold)] border border-white/10 shrink-0">
                    {demo.role}
                  </span>
                </div>
                <p className="text-[10px] text-white/40 truncate mt-0.5">{demo.title}</p>
                <p className="text-[10px] text-white/25 font-mono truncate mt-0.5">{demo.email}</p>
              </div>
              <UserCheck className="h-4 w-4 text-white/20 group-hover:text-[color:var(--color-gb-gold)] shrink-0 transition-colors" />
            </button>
          ))}
        </div>
        
        <div className="mt-4 rounded-lg bg-white/[0.04] border border-white/[0.06] p-3 text-[10px] leading-relaxed text-white/40 font-medium flex gap-2">
          <KeyRound className="h-4 w-4 text-[color:var(--color-gb-gold)] shrink-0 mt-0.5" />
          <span><strong className="text-white/60">Note</strong>: The global password for all accounts is <code className="font-mono bg-white/10 px-1 py-0.5 rounded font-black text-[color:var(--color-gb-gold)]">demopass</code>. Changes persist for testing.</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <PageShell>
      {/* Full dark background login page */}
      <section className="relative min-h-[calc(100vh-200px)] flex items-center justify-center overflow-hidden">
        {/* Dark background */}
        <div className="absolute inset-0 bg-[color:var(--color-gb-blue-deep)]" />
        <div className="absolute inset-0 hero-pattern opacity-[0.03]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-gb-blue-deep)] via-[color:var(--color-gb-blue-dark)] to-[color:var(--color-gb-blue-deep)]" />

        <div className="container-x relative z-10 py-12 md:py-16">
          <Suspense fallback={<div className="text-white/50 text-sm font-bold text-center">Loading login workspace...</div>}>
            <div className="flex justify-center">
              <LoginForm />
            </div>
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
