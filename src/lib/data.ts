import {
  Archive,
  BookOpen,
  ClipboardCheck,
  Crown,
  FileCheck2,
  LayoutDashboard,
  PenLine,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export type Role = "author" | "reviewer" | "editor" | "admin" | "super-admin";

export type Article = {
  id: string;
  slug: string;
  title: string;
  type: string;
  topic: string;
  department: string;
  authors: string[];
  abstract: string;
  issue: string;
  volume: string;
  pages: string;
  doi: string;
  publishedAt: string;
  metrics: { views: number; downloads: number; citations: number };
  keywords: string[];
  sections: { heading: string; body: string }[];
  image?: string;
  pdf?: string;
};

export type SubmissionFile = {
  id?: number;
  fileType?: string;
  originalFilename?: string;
  contentType?: string;
  sizeBytes?: number;
  downloadUrl?: string;
  uploadedAt?: string;
};

export type SubmissionReview = {
  id?: number;
  reviewerName?: string;
  reviewerEmail?: string;
  status?: string;
  recommendation?: string;
  score?: number;
  reviewComments?: string;
  confidentialComments?: string;
  dueDate?: string;
  reviewSubmittedAt?: string;
};

export type SubmissionAuthor = {
  id?: number;
  name: string;
  email: string;
  affiliation?: string;
  orcid?: string;
  authorOrder?: number;
  corresponding?: boolean;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  branchName?: string;
  routingNumber?: string;
};

export type Submission = {
  id: string;
  rawId?: number;
  submissionId?: string;
  title: string;
  runningTitle?: string;
  type: string;
  topic?: string;
  abstractText?: string;
  keywords?: string;
  coverLetter?: string;
  author: string;
  status: string;
  editor: string;
  reviewers: string[];
  updated: string;
  due: string;
  score: number;
  files?: SubmissionFile[];
  reviews?: SubmissionReview[];
  authors?: SubmissionAuthor[];
  submittingAuthor?: {
    id?: number;
    fullName?: string;
    email?: string;
    department?: string;
    institution?: string;
  };
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/issues/current", label: "Current Issue" },
  { href: "/articles", label: "Articles" },
  { href: "/issues", label: "Issues" },
  { href: "/authors", label: "For Authors" },
  { href: "/contact", label: "Contact" },
];

export const roles: { id: Role; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "author", label: "Author", icon: PenLine },
  { id: "reviewer", label: "Reviewer", icon: UserCheck },
  { id: "editor", label: "Editor", icon: ClipboardCheck },
  { id: "admin", label: "Admin", icon: ShieldCheck },
  { id: "super-admin", label: "Super Admin", icon: Crown },
];

export const topics = [
  "Public Health",
  "Pharmacy",
  "Medical Sciences",
  "Veterinary Sciences",
  "Social Sciences",
  "Law and Governance",
  "Agriculture",
  "Technology",
];

export const articleTypes = [
  "Research Article",
  "Review Article",
  "Case Study",
  "Short Communication",
  "Perspective",
  "Editorial",
  "Letter",
  "Policy Brief",
];

export const articles: Article[] = [];

export type Issue = {
  id: string;
  volume: string;
  issue: string;
  year: string;
  month: string;
  theme: string;
  coverImage?: string;
  articleCount: number;
  articles: Article[];
  editorNote?: string;
};

export const issues: Issue[] = [];

export const submissions: Submission[] = [];

export const dashboardStats = [
  { label: "Live submissions", value: "128", icon: LayoutDashboard },
  { label: "Under review", value: "43", icon: ClipboardCheck },
  { label: "Accepted this issue", value: "16", icon: FileCheck2 },
  { label: "Archive articles", value: "286", icon: Archive },
  { label: "Active reviewers", value: "74", icon: UserCheck },
  { label: "Published issues", value: "22", icon: BookOpen },
];

export type BoardMember = {
  id?: string | number;
  userId?: string | number;
  email?: string;
  name: string;
  role: string;
  unit?: string;
  title?: string;
  designation?: string;
  affiliation?: string;
  institution?: string;
  expertise?: string;
  bio?: string;
  image?: string;
  avatarUrl?: string;
};

export const boardMembers: BoardMember[] = [];
export const advisoryCouncil: any[] = [];

export const policies = [
  "Double-blind peer review for research and review articles",
  "Mandatory conflict of interest, funding, ethics, and AI-use declarations",
  "Plagiarism screening before editorial assignment",
  "Transparent correction, retraction, and expression-of-concern workflow",
  "Open access publication model with author-retained copyright",
  "Reviewer confidentiality and conflict disclosure requirements",
];

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function filterArticles(query: string, type: string, topic: string) {
  const normalized = query.toLowerCase();
  return articles.filter((article) => {
    const matchesQuery =
      !normalized ||
      article.title.toLowerCase().includes(normalized) ||
      article.abstract.toLowerCase().includes(normalized) ||
      article.authors.join(" ").toLowerCase().includes(normalized) ||
      article.keywords.join(" ").toLowerCase().includes(normalized);
    const matchesType = !type || article.type === type;
    const matchesTopic = !topic || article.topic === topic;
    return matchesQuery && matchesType && matchesTopic;
  });
}
