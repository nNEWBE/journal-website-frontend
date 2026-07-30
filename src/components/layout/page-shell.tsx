import type { ReactNode } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/header/site-header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="journal-shell flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
    </div>
  );
}
