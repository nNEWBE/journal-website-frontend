"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Home, LogIn, Mail } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

export default function Forbidden() {
  return (
    <PageShell>
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/40 via-white to-slate-50/50">
        <div className="w-full max-w-xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold shadow-2xs">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <span>Academic Clearance Required • Error 403</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-academic font-bold text-slate-900 tracking-tight">
            Access Restricted to Authorized Personnel
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-md mx-auto">
            This manuscript, peer-review assignment, or editorial management tool requires specific academic credentials (Peer Reviewer, Section Editor, or Chief Editor).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
            >
              <LogIn className="h-4 w-4" />
              <span>Log In with Authorized Account</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Home className="h-4 w-4 text-slate-500" />
              <span>Journal Home</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>Request Editorial Clearance</span>
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
