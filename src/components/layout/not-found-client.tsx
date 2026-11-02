"use client";

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
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/site";
import type { ResolvedPage } from "@/lib/cms/page-content";
import { cmsIcon } from "@/lib/cms/icons";
import type defaults from "@/lib/cms/defaults/not-found.json";

export type NotFoundContent = ResolvedPage<typeof defaults>;

const linkIconFallbacks: LucideIcon[] = [BookOpen, FileText, HelpCircle, Users, Mail];

export function NotFoundClient({ content }: { content: NotFoundContent }) {
  const router = useRouter();
  const message = content.message;
  const destinations = content.destinations;
  const quickLinks = Array.isArray(destinations.meta.links) ? destinations.meta.links : [];

  return (
    <PageShell>
      <section className="border-b border-slate-200 bg-white py-14 sm:py-20">
        <div className="container-x max-w-4xl space-y-10 text-center">
          {message.visible && (
            <>
              <div className="space-y-4">
                {message.subtitle && (
                  <div className="inline-flex items-center gap-2 border border-blue-200/80 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-gb-accent">
                    <FileQuestion className="h-4 w-4" aria-hidden="true" />
                    <span>{message.subtitle}</span>
                  </div>
                )}

                <div className="relative">
                  {/* Decorative status code — the message title below is the page heading. */}
                  <p
                    aria-hidden="true"
                    className="select-none font-mono text-7xl font-extrabold tracking-tight text-slate-200/80 sm:text-9xl"
                  >
                    {message.meta.code}
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="font-academic text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                      {message.title}
                    </h1>
                  </div>
                </div>

                {message.content && (
                  <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                    {message.content}
                  </p>
                )}
              </div>

              {/* Plain GET form: the articles page reads `q`. */}
              <form action="/articles" method="get" role="search" className="group relative mx-auto max-w-xl">
                <label htmlFor="not-found-search" className="sr-only">
                  {message.meta.searchPlaceholder}
                </label>
                <input
                  id="not-found-search"
                  type="search"
                  name="q"
                  required
                  placeholder={message.meta.searchPlaceholder}
                  className="h-12 w-full border border-slate-300 bg-white pl-11 pr-28 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-gb-accent focus:outline-hidden focus:ring-2 focus:ring-blue-100 sm:text-sm"
                />
                <Search
                  aria-hidden="true"
                  className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-gb-accent"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-9 cursor-pointer bg-gb-navy px-4 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-gb-navy-hover"
                >
                  {message.meta.searchButtonLabel}
                </button>
              </form>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex cursor-pointer items-center gap-2 border border-slate-300 bg-white px-5 py-3 text-xs font-semibold tracking-wide text-slate-800 transition-colors hover:bg-slate-50"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  <span>{message.meta.backLabel}</span>
                </button>
                <ButtonLink href={message.meta.homeLink?.href || "/"} icon={Home} iconPosition="start">
                  {message.meta.homeLink?.label}
                </ButtonLink>
              </div>
            </>
          )}

          {destinations.visible && quickLinks.length > 0 && (
            <div className="border-t border-slate-200 pt-8 text-left">
              <h2 className="mb-5 text-center font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                {destinations.title}
              </h2>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {quickLinks.map((link, idx) => {
                  const Icon = cmsIcon(link.icon, linkIconFallbacks[idx] ?? FileText);
                  return (
                    <Link
                      key={`${link.href}-${idx}`}
                      href={link.href}
                      className="group flex flex-col justify-between gap-2 border border-slate-200 bg-white p-4 transition-colors hover:border-gb-accent"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-blue-50 text-gb-accent transition-colors group-hover:bg-gb-navy group-hover:text-white">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        {link.badge && (
                          <span className="border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-gb-accent">
                          {link.title}
                        </h3>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-500">{link.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
