"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  ArrowLeft,
  BookOpen,
  FileText,
  Users,
  Mail,
  HelpCircle,
  FileQuestion,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/articles?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickLinks = [
    {
      title: "Current Issue",
      desc: "Explore active volume papers & open-access editorial notes",
      href: "/issues/current",
      icon: BookOpen,
      badge: "Latest Release",
    },
    {
      title: "Articles Archive",
      desc: "Search through published peer-reviewed research repository",
      href: "/articles",
      icon: FileText,
      badge: "Indexed",
    },
    {
      title: "Author Guidelines",
      desc: "Manuscript preparation, submission portal & ethics guidelines",
      href: "/authors",
      icon: HelpCircle,
      badge: "Submissions",
    },
    {
      title: "Editorial Board",
      desc: "Faculty governance, section editors & international council",
      href: "/editorial-board",
      icon: Users,
      badge: "Faculty",
    },
    {
      title: "Contact Desk",
      desc: "Get in touch with the managing editorial office for inquiries",
      href: "/contact",
      icon: Mail,
      badge: "Support",
    },
  ];

  return (
    <PageShell>
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50">
        <div className="w-full max-w-4xl mx-auto space-y-10 text-center">
          {/* Top Status & 404 Badge */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-bold shadow-2xs">
              <FileQuestion className="h-4 w-4 text-blue-600" />
              <span>Academic Resource Not Found • Error 404</span>
            </div>

            <div className="relative">
              <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tight text-slate-200/80 font-mono select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-academic font-bold text-slate-900 tracking-tight">
                  Manuscript or Page Not Found
                </h2>
              </div>
            </div>

            <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
              The requested academic paper, editorial guideline, volume issue, or administrative URL
              could not be located. It may have been relocated, archived, or unpublished.
            </p>
          </div>

          {/* Quick Interactive Search Bar */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search manuscripts, DOIs, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-28 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-hidden focus:border-blue-500 focus:ring-4 focus:ring-blue-100/70 transition-all font-sans"
              />
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-9 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Primary Recovery Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-slate-500" />
              <span>Return to Previous Page</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[color:var(--color-gb-blue)] text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Home className="h-4 w-4" />
              <span>Journal Homepage</span>
            </Link>
          </div>

          {/* Curated Scholarly Destinations Grid */}
          <div className="pt-4 border-t border-slate-200/70 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-5 font-mono">
              Recommended Scholarly Destinations
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60 font-mono">
                        {link.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {link.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                        {link.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
