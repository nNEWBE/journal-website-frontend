"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Landmark,
  Mail,
  MapPin,
  PenLine,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { cmsIcon } from "@/lib/cms/icons";
import { useSiteContent } from "@/components/layout/site-content";

type FooterLinkItem = { label: string; href: string };

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 text-[12.5px] text-slate-300/85 hover:text-white transition-colors"
      >
        <ChevronRight className="h-3 w-3 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
          {children}
        </span>
      </Link>
    </li>
  );
}

function FooterLinkColumn({
  title,
  icon,
  fallbackIcon,
  links,
}: {
  title: string;
  icon: unknown;
  fallbackIcon: LucideIcon;
  links: unknown;
}) {
  const Icon = cmsIcon(icon, fallbackIcon);
  const items: FooterLinkItem[] = Array.isArray(links) ? links : [];
  return (
    <div className="lg:col-span-2">
      <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 mb-3.5">
        <span className="flex h-5.5 w-5.5 items-center justify-center bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
          <Icon className="h-3 w-3" />
        </span>
        <span className="text-xs font-bold uppercase tracking-normal text-white">
          {title}
        </span>
      </div>
      <ul className="space-y-2.5 text-xs text-slate-300/90">
        {items.map((link, i) => (
          <FooterLink key={`${link.href}-${link.label}-${i}`} href={link.href}>
            {link.label}
          </FooterLink>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const content = useSiteContent();
  const brand = content["footer-brand"];
  const contact = content["footer-contact"];
  const bottom = content["footer-bottom"];
  const bottomLinks: FooterLinkItem[] = Array.isArray(bottom.meta.links) ? bottom.meta.links : [];

  const columns: Record<string, () => ReactNode> = {
    "footer-brand": () => (
      /* Brand Column (3 cols) */
      <div className="lg:col-span-3 space-y-4">
        <Link href="/" className="inline-flex items-center gap-3.5 group">
          <div className="relative shrink-0 overflow-hidden bg-white p-1.5 shadow-md ring-1 ring-white/15 h-12 w-12 flex items-center justify-center">
            <img
              src={brand.meta.logoImage || "/gb-logo-official.png"}
              alt={brand.meta.logoAlt}
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <span className="font-ui text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors block">
              {brand.title}
            </span>
            {brand.subtitle && (
              <span className="font-bangla text-xs font-semibold text-amber-400/90 block -mt-0.5">
                {brand.subtitle}
              </span>
            )}
          </div>
        </Link>

        {brand.content && (
          <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300/90 max-w-sm">
            {brand.content}
          </p>
        )}
      </div>
    ),
    /* Journals (2 cols) */
    "footer-journals": () => (
      <FooterLinkColumn
        title={content["footer-journals"].title}
        icon={content["footer-journals"].meta.icon}
        fallbackIcon={BookOpen}
        links={content["footer-journals"].meta.links}
      />
    ),
    /* For Authors (2 cols) */
    "footer-authors": () => (
      <FooterLinkColumn
        title={content["footer-authors"].title}
        icon={content["footer-authors"].meta.icon}
        fallbackIcon={PenLine}
        links={content["footer-authors"].meta.links}
      />
    ),
    /* About (2 cols) */
    "footer-about": () => (
      <FooterLinkColumn
        title={content["footer-about"].title}
        icon={content["footer-about"].meta.icon}
        fallbackIcon={Landmark}
        links={content["footer-about"].meta.links}
      />
    ),
    "footer-contact": () => (
      /* Contact (3 cols) */
      <div className="lg:col-span-3">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 mb-3.5">
          <span className="flex h-5.5 w-5.5 items-center justify-center bg-amber-400/10 border border-amber-400/20 text-amber-400 shrink-0">
            <Mail className="h-3 w-3" />
          </span>
          <span className="text-xs font-bold uppercase tracking-normal text-white">
            {contact.title}
          </span>
        </div>
        <div className="space-y-3 text-xs text-slate-300/90">
          {contact.meta.email && (
            <a
              href={`mailto:${contact.meta.email}`}
              className="group flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-white/5 border border-white/10 text-slate-400 group-hover:text-amber-400 group-hover:border-amber-400/30 transition-all">
                <Mail className="h-3 w-3" />
              </span>
              <span className="text-[11.5px] truncate font-medium text-slate-300 group-hover:text-amber-200 transition-colors">
                {contact.meta.email}
              </span>
            </a>
          )}

          {contact.meta.address && (
            <div className="flex items-start gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-white/5 border border-white/10 text-slate-400 mt-0.5">
                <MapPin className="h-3 w-3" />
              </span>
              <span className="text-[11.5px] leading-relaxed text-slate-300">
                {contact.meta.address}
              </span>
            </div>
          )}

          {contact.meta.phone && (
            <a
              href={contact.meta.phoneHref || `tel:${contact.meta.phone.replace(/[^+\d]/g, "")}`}
              className="group flex items-center gap-2.5 hover:text-white transition-colors"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-white/5 border border-white/10 text-slate-400 group-hover:text-amber-400 group-hover:border-amber-400/30 transition-all">
                <Phone className="h-3 w-3" />
              </span>
              <span className="text-[11.5px] font-medium text-slate-300 group-hover:text-amber-200 transition-colors">
                {contact.meta.phone}
              </span>
            </a>
          )}
        </div>
      </div>
    ),
  };

  return (
    <footer className="bg-gb-night text-white border-t border-slate-800/90">
      <div className="container-x py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          {content._order.map((key) => {
            const render = columns[key];
            return render ? <Fragment key={key}>{render()}</Fragment> : null;
          })}
        </div>
      </div>

      {/* Sub-Footer Bottom Bar */}
      {bottom.visible && (
        <div className="border-t border-slate-800/90 py-5 bg-black/25">
          <div className="container-x flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-center md:text-left">
              <span>© {new Date().getFullYear()} {bottom.title}</span>
              {bottom.subtitle && (
                <>
                  <span className="hidden sm:inline text-slate-600">|</span>
                  <span className="text-slate-400">{bottom.subtitle}</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] sm:text-xs text-slate-400">
              {bottomLinks.map((link, i) => (
                <Link
                  key={`${link.href}-${link.label}-${i}`}
                  href={link.href}
                  className="group inline-flex items-center gap-1 hover:text-slate-200 transition-colors"
                >
                  <ChevronRight className="h-2.5 w-2.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
