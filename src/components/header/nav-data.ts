import {
  BookOpen,
  FileText,
  Library,
  PenLine,
  Scale,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";

export type NavSubItem = {
  label: string;
  href: string;
  description: string;
  icon: typeof BookOpen;
};

export type NavItem = {
  label: string;
  href: string;
  dropdownHeader?: string;
  footerHref?: string;
  footerLabel?: string;
  dropdown?: NavSubItem[];
};

export const mainNav: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About & Governance",
    href: "/about",
    dropdownHeader: "Learn about our institution, leadership & ethics",
    footerHref: "/about",
    footerLabel: "View full journal overview",
    dropdown: [
      {
        label: "About the Journal",
        href: "/about",
        description: "Scope, open access mandate & editorial vision",
        icon: BookOpen,
      },
      {
        label: "Editorial Board",
        href: "/editorial-board",
        description: "Academic leadership & discipline chairs",
        icon: Users,
      },
      {
        label: "Reviewer Guidelines",
        href: "/reviewers",
        description: "Peer-review standards & reviewer panel",
        icon: ShieldCheck,
      },
      {
        label: "Ethics & Policies",
        href: "/policies",
        description: "COPE compliance, copyright & retractions",
        icon: Scale,
      },
    ],
  },
  {
    label: "Issues & Articles",
    href: "/issues",
    dropdownHeader: "Browse published volumes, editions & indexed papers",
    footerHref: "/articles",
    footerLabel: "Search all articles",
    dropdown: [
      {
        label: "All Issues & Archive",
        href: "/issues",
        description: "Browse complete publication record by year",
        icon: Library,
      },
      {
        label: "Search Articles",
        href: "/articles",
        description: "Filter indexed papers by topic, DOI & keywords",
        icon: FileText,
      },
    ],
  },
  {
    label: "For Authors",
    href: "/authors",
    dropdownHeader: "Guidelines & submission portal",
    footerHref: "/dashboard/submissions/new",
    footerLabel: "Submit your manuscript",
    dropdown: [
      {
        label: "Author Guidelines",
        href: "/authors",
        description: "Manuscript structure, formatting & checklist",
        icon: PenLine,
      },
      {
        label: "Submit Manuscript",
        href: "/dashboard/submissions/new",
        description: "Online manuscript submission portal",
        icon: Send,
      },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export function getIsRouteActive(pathname: string, label: string): boolean {
  if (label === "Home") return pathname === "/";
  if (
    pathname.startsWith("/about") ||
    pathname.startsWith("/policies") ||
    pathname.startsWith("/editorial-board") ||
    pathname.startsWith("/reviewers")
  ) {
    return label === "About & Governance";
  }
  if (pathname.startsWith("/issues") || pathname.startsWith("/articles")) {
    return label === "Issues & Articles";
  }
  if (
    pathname.startsWith("/authors") ||
    pathname.startsWith("/submit") ||
    pathname.startsWith("/dashboard")
  ) {
    return label === "For Authors";
  }
  if (pathname.startsWith("/contact")) {
    return label === "Contact";
  }
  return false;
}
