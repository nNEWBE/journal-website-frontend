"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  FileText,
  Save,
  Send,
  UploadCloud,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Globe2,
  Library,
  BookOpen,
  FlaskConical,
  ClipboardCheck,
  MessageSquareText,
  PenLine,
  Mail,
  Eye,
  Trash2,
  Check,
  Building2,
  FileCheck2,
  HelpCircle,
  AlertCircle,
  FileCode,
  Info,
  Clock,
  Plus,
  Lock,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { articleTypes, topics, submissions as seedSubmissions } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { CustomSelect } from "@/components/ui/custom-select";
import { PremiumLoader } from "@/components/ui/loader";
import { HeroActionButton } from "@/components/ui/hero-action-button";

const wizardSteps = [
  { id: "type", title: "Article Type", short: "Type", description: "Format & methodology" },
  { id: "details", title: "Manuscript Details", short: "Details", description: "Title, topic & abstract" },
  { id: "authors", title: "Authors & Roles", short: "Authors", description: "Contributors & ORCID" },
  { id: "files", title: "Manuscript Files", short: "Files", description: "Blinded copy & data" },
  { id: "declarations", title: "Ethical Declarations", short: "Ethics", description: "COI & AI disclosures" },
  { id: "review", title: "Final Review", short: "Review", description: "Confirm & submit" },
];

const formatIcons: Record<string, any> = {
  "Research Article": FlaskConical,
  "Review Article": Library,
  "Case Study": ClipboardCheck,
  "Short Communication": MessageSquareText,
  Perspective: Eye,
  Editorial: PenLine,
  Letter: Mail,
};

const formatDescriptions: Record<string, string> = {
  "Research Article": "Original empirical findings, novel methodology, and comprehensive scholarly analysis. (4,000–8,000 words)",
  "Review Article": "Systematic synthesis, critical evaluation, and emerging insights across published literature. (5,000–9,000 words)",
  "Case Study": "In-depth investigation of a specific institutional, clinical, or field intervention. (2,500–5,000 words)",
  "Short Communication": "Timely reporting of high-impact preliminary findings or urgent methodological advances. (1,500–3,000 words)",
  Perspective: "Evidence-informed commentary on important academic, policy, or research trends. (2,000–4,000 words)",
  Editorial: "Authoritative editorial commentary commissioned or written on scholarly directions. (1,000–2,500 words)",
  Letter: "Focused scholarly correspondence responding to recently published articles or debates. (800–1,500 words)",
};

interface AuthorItem {
  id: string;
  name: string;
  email: string;
  institution: string;
  orcid?: string;
  isCorresponding: boolean;
}

export function SubmissionWizard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [newSubId, setNewSubId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State initialized empty so completeness reflects actual author input
  const [form, setForm] = useState({
    type: "Research Article",
    topic: "Public Health",
    title: "",
    abstract: "",
    keywords: "",
    files: [] as { name: string; size: string; type: string; date: string }[],
    declarations: {
      noConflict: false,
      ethicsApproved: false,
      fundingDisclosed: false,
      aiDisclosed: false,
      originalWork: false,
      customNotes: "",
    },
  });

  // Authors State
  const [authors, setAuthors] = useState<AuthorItem[]>([]);

  // Co-author modal / form fields
  const [newAuthor, setNewAuthor] = useState({ name: "", email: "", institution: "", orcid: "" });
  const [showAuthorForm, setShowAuthorForm] = useState(false);

  // Auth Guard
  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login?redirect=/dashboard/submissions/new");
    } else {
      setCurrentUser(session);
      setAuthors([
        {
          id: "auth-1",
          name: session.name || "Author",
          email: session.email || "author@gonobishwabidyalay.edu.bd",
          institution: "Faculty of Health Sciences, Gono Bishwabidyalay",
          orcid: "0000-0002-1823-4591",
          isCorresponding: true,
        },
      ]);
      setLoading(false);
    }
  }, [router]);

  // Dynamic Completeness Calculation based on filled fields
  const completeness = useMemo(() => {
    let score = 0;
    if (form.type) score += 15;
    if (form.title.trim().length >= 10) score += 20;
    if (form.abstract.trim().length >= 30) score += 20;
    if (authors.length > 0) score += 15;
    if (form.files.length > 0) score += 15;

    // Ethics declarations scoring
    const decs = form.declarations;
    const checkedCount = [decs.noConflict, decs.ethicsApproved, decs.fundingDisclosed, decs.aiDisclosed, decs.originalWork].filter(Boolean).length;
    score += Math.round((checkedCount / 5) * 15);

    return Math.min(100, score);
  }, [form, authors]);

  function loadSampleData() {
    setForm({
      type: "Research Article",
      topic: "Public Health",
      title: "Community healthcare access patterns around Savar: A mixed-method study",
      abstract: "This study examines primary healthcare access, referral barriers, and household service confidence across communities surrounding Savar. Structured surveys and qualitative interviews were conducted to identify key transport, literacy, and continuity bottlenecks.",
      keywords: "Public Health, Primary Care, Savar, Community Health, Bangladesh",
      files: [
        { name: "main-manuscript-blinded.docx", size: "2.4 MB", type: "Blinded Copy", date: "Just now" },
        { name: "title-page-authors.docx", size: "420 KB", type: "Title Page", date: "Just now" },
        { name: "ethics-approval-certificate.pdf", size: "1.1 MB", type: "Ethics Certificate", date: "Just now" },
      ],
      declarations: {
        noConflict: true,
        ethicsApproved: true,
        fundingDisclosed: true,
        aiDisclosed: true,
        originalWork: true,
        customNotes: "No commercial funding received. Ethical approval granted by GB IRB (Protocol #2026-PH-04). Generative AI was used strictly for English language refinement.",
      },
    });
    setAuthors([
      {
        id: "auth-1",
        name: currentUser?.name || "Dr. Farhana Rahman",
        email: currentUser?.email || "farhana.rahman@gonobishwabidyalay.edu.bd",
        institution: "Faculty of Health Sciences, Gono Bishwabidyalay",
        orcid: "0000-0002-1823-4591",
        isCorresponding: true,
      },
      {
        id: "auth-2",
        name: "Md. Jamil Hossain",
        email: "jamil.hossain@gonobishwabidyalay.edu.bd",
        institution: "Department of Public Health, Gono Bishwabidyalay",
        orcid: "0000-0001-9482-3021",
        isCorresponding: false,
      },
    ]);
    toast.success("Sample manuscript data loaded into wizard!");
  }

  const [isDragging, setIsDragging] = useState(false);

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  function handleFilesAdded(fileList: FileList | File[]) {
    const addedFiles = Array.from(fileList);
    if (addedFiles.length === 0) return;

    const newFiles = addedFiles.map((f) => {
      let fileDocType = "Blinded Manuscript";
      const nameLower = f.name.toLowerCase();
      if (nameLower.includes("title") || nameLower.includes("author")) {
        fileDocType = "Title Page";
      } else if (nameLower.includes("ethics") || nameLower.includes("cert") || nameLower.includes("irb")) {
        fileDocType = "Ethics Certificate";
      } else if (nameLower.includes("supp") || nameLower.includes("data") || nameLower.includes("fig")) {
        fileDocType = "Supplementary File";
      }

      return {
        name: f.name,
        size: formatBytes(f.size),
        type: fileDocType,
        date: "Just now",
      };
    });

    setForm((prev) => {
      const existingNames = new Set(prev.files.map((item) => item.name));
      const filtered = newFiles.filter((item) => !existingNames.has(item.name));
      return { ...prev, files: [...prev.files, ...filtered] };
    });

    toast.success(`Uploaded ${addedFiles.length} manuscript file(s)!`);
  }

  function removeFile(fileName: string) {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.name !== fileName),
    }));
    toast.info("File removed from upload package.");
  }

  function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addCoAuthor() {
    if (!newAuthor.name.trim() || !newAuthor.email.trim()) {
      toast.error("Please enter author name and email.");
      return;
    }
    const created: AuthorItem = {
      id: `auth-${Date.now()}`,
      name: newAuthor.name.trim(),
      email: newAuthor.email.trim(),
      institution: newAuthor.institution.trim() || "Gono Bishwabidyalay",
      orcid: newAuthor.orcid.trim() || undefined,
      isCorresponding: false,
    };
    setAuthors((prev) => [...prev, created]);
    setNewAuthor({ name: "", email: "", institution: "", orcid: "" });
    setShowAuthorForm(false);
    toast.success(`Added co-author ${created.name}`);
  }

  function removeAuthor(id: string) {
    if (authors.length === 1) {
      toast.error("At least one author is required.");
      return;
    }
    setAuthors((prev) => prev.filter((a) => a.id !== id));
    toast.info("Author removed.");
  }

  function toggleCorresponding(id: string) {
    setAuthors((prev) =>
      prev.map((a) => ({ ...a, isCorresponding: a.id === id }))
    );
  }

  function handleSubmit() {
    if (!form.declarations.originalWork) {
      toast.error("You must confirm that the manuscript is original work.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `GBJ-2026-${Math.floor(100 + Math.random() * 900)}`;
      setNewSubId(generatedId);

      const mainAuthor = authors.find((a) => a.isCorresponding)?.name || authors[0]?.name || currentUser?.name || "Author";

      const newSubmission = {
        id: generatedId,
        title: form.title,
        type: form.type,
        author: mainAuthor,
        status: "Awaiting Editor",
        editor: "Unassigned",
        reviewers: [],
        updated: "Just now",
        due: "2026-08-15",
        score: 75,
      };

      // Update LocalStorage database
      const localSubs = localStorage.getItem("gb_journal_submissions");
      let currentSubs = seedSubmissions;
      if (localSubs) {
        try {
          currentSubs = JSON.parse(localSubs);
        } catch (e) {
          currentSubs = seedSubmissions;
        }
      }

      const updatedSubs = [newSubmission, ...currentSubs];
      localStorage.setItem("gb_journal_submissions", JSON.stringify(updatedSubs));

      // Append to audit logs
      const localLogs = localStorage.getItem("gb_journal_decision_log");
      let currentLogs = [];
      if (localLogs) {
        try {
          currentLogs = JSON.parse(localLogs);
        } catch (e) {
          currentLogs = [];
        }
      }
      const logMsg = `[New Submission] ${generatedId}: "${form.title}" submitted by ${mainAuthor}`;
      localStorage.setItem("gb_journal_decision_log", JSON.stringify([logMsg, ...currentLogs]));

      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(`Manuscript ${generatedId} submitted successfully!`);
    }, 1200);
  }

  if (loading) {
    return (
      <PremiumLoader text="Verifying author session..." className="journal-shell min-h-screen flex items-center justify-center" />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 py-8 md:py-12">
      <div className="container-x">
        {/* Header Breadcrumb & Masthead */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
            <Link href="/dashboard" className="hover:text-[color:var(--color-gb-blue)] transition-colors">
              Author Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-800">New Submission</span>
          </div>

          {!submitted && (
            <div className="relative overflow-hidden rounded-2xl bg-[color:var(--color-gb-blue-deep)] p-6 md:p-8 text-white shadow-lg">
              <div className="pointer-events-none absolute inset-0 hero-pattern opacity-[0.04]" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[color:var(--color-gb-gold)]/10 blur-3xl" aria-hidden="true" />

              <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300 backdrop-blur-md">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Peer-Reviewed Portal
                  </span>
                  <h1 className="mt-3 font-academic text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
                    Manuscript Submission Wizard
                  </h1>
                  <p className="mt-2 text-xs leading-relaxed text-white/65 md:text-sm">
                    Complete the 6-step author workflow to register your research in Gono Bishwabidyalay Journal. All progress is autosaved.
                  </p>
                </div>

                {/* Progress Chip */}
                <div className="shrink-0 rounded-xl border border-white/15 bg-white/10 p-4 text-center backdrop-blur-md min-w-[140px]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-3xl font-black text-amber-300">{completeness}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[9.5px] font-extrabold uppercase tracking-wider text-white/60">
                    Completeness
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stepper Progress Bar (Desktop Grid) */}
        {!submitted && (
          <div className="mb-8 hidden md:block">
            <div className="grid grid-cols-6 gap-2 rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs">
              {wizardSteps.map((s, index) => {
                const isCompleted = index < step;
                const isActive = index === step;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStep(index)}
                    className={`group flex items-center gap-2.5 rounded-lg p-2 text-left transition-all ${isActive
                        ? "bg-[color:var(--color-gb-blue-deep)] text-white shadow-xs"
                        : isCompleted
                          ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                          : "text-slate-400 hover:bg-slate-50"
                      }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-black transition-colors ${isActive
                          ? "bg-amber-400 text-[color:var(--color-gb-blue-deep)]"
                          : isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-400"
                        }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : `0${index + 1}`}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold leading-tight">{s.short}</p>
                      <p className={`truncate text-[9.5px] ${isActive ? "text-white/60" : "text-slate-400"}`}>
                        {s.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Layout */}
        {submitted ? (
          /* Full Width Centered Success Receipt View */
          <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-10">
            <div className="py-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>

              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                Accession ID: {newSubId}
              </span>

              <h2 className="mt-4 font-academic text-3xl font-bold text-[color:var(--color-gb-blue-deep)]">
                Manuscript Received Successfully
              </h2>

              <p className="mx-auto mt-2.5 max-w-lg text-xs leading-relaxed text-slate-600 md:text-sm">
                Your paper <strong className="text-slate-900">&quot;{form.title}&quot;</strong> has been logged into the Gono Bishwabidyalay Editorial Management System.
              </p>

              {/* Receipt Card Details */}
              <div className="mx-auto mt-6 max-w-md rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Article Type:</span>
                  <span className="font-bold text-slate-900">{form.type}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Primary Topic:</span>
                  <span className="font-bold text-slate-900">{form.topic}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Corresponding Author:</span>
                  <span className="font-bold text-slate-900">{authors.find((a) => a.isCorresponding)?.name || authors[0]?.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Submitted Files:</span>
                  <span className="font-bold text-slate-900">{form.files.length} Files</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Next Stage:</span>
                  <span className="font-bold text-amber-700">Editorial Desk Triage & Screening</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <HeroActionButton
                  href="/dashboard"
                  variant="dark"
                  hasArrow
                >
                  Go to Author Dashboard
                </HeroActionButton>
                <HeroActionButton
                  variant="outline"
                  onClick={() => {
                    setStep(0);
                    setSubmitted(false);
                  }}
                >
                  Submit Another Manuscript
                </HeroActionButton>
              </div>
            </div>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr] items-start">
            {/* Left Sidebar Steps Navigator */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3 px-1">
                  Workflow Progress
                </p>
                <div className="space-y-1.5">
                  {wizardSteps.map((s, index) => {
                    const isCompleted = index < step;
                    const isActive = index === step;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setStep(index)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl p-3 text-left transition-all ${isActive
                            ? "bg-[color:var(--color-gb-blue-deep)] text-white shadow-sm"
                            : isCompleted
                              ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                              : "text-slate-500 hover:bg-slate-50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-[10px] font-black ${isActive
                                ? "bg-amber-400 text-[color:var(--color-gb-blue-deep)]"
                                : isCompleted
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                          >
                            {isCompleted ? <Check className="h-3.5 w-3.5" /> : index + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold">{s.title}</p>
                            <p className={`text-[10px] ${isActive ? "text-white/60" : "text-slate-400"}`}>
                              {s.description}
                            </p>
                          </div>
                        </div>
                        {isCompleted && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => toast.success("Draft saved successfully. Auto-save is active.")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Save className="h-3.5 w-3.5 text-slate-500" />
                    Autosaved Draft
                  </button>
                  <button
                    type="button"
                    onClick={loadSampleData}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors"
                  >
                    <PenLine className="h-3.5 w-3.5 text-amber-700" />
                    Auto-fill Sample Data
                  </button>
                </div>
              </div>

              {/* Author Support Card */}
              <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-amber-100/50 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">Need Submission Help?</h4>
                    <p className="mt-1 text-[11px] leading-relaxed text-amber-800/80">
                      Ensure your main manuscript file has all author identities removed for double-blind peer review.
                    </p>
                    <Link
                      href="/authors"
                      target="_blank"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:underline"
                    >
                      Author guidelines <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Form Step Workspace */}
            <section className="h-fit rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8">
              {/* Step 0: Article Type */}
              {step === 0 && (
                <div>
                  <div className="border-b border-slate-200/90 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[color:var(--color-gb-gold-dark)]">
                      Step 1 of 6
                    </span>
                    <h2 className="font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                      Select Article Type
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Choose the format that matches the evidence, length, and scope of your manuscript.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {articleTypes.map((type) => {
                      const FormatIcon = formatIcons[type] || FileText;
                      const isSelected = form.type === type;

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => updateField("type", type)}
                          className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 ${isSelected
                              ? "border-[color:var(--color-gb-blue)] bg-blue-50/30 ring-2 ring-[color:var(--color-gb-blue)]/20 shadow-xs"
                              : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                            }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${isSelected
                                    ? "bg-[color:var(--color-gb-blue-deep)] text-amber-300"
                                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                                  }`}
                              >
                                <FormatIcon className="h-5 w-5" />
                              </div>
                              {isSelected && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-gb-blue)] text-white">
                                  <Check className="h-3 w-3" />
                                </span>
                              )}
                            </div>

                            <h3 className="mt-3.5 font-academic text-base font-bold text-[color:var(--color-gb-blue-deep)]">
                              {type}
                            </h3>

                            <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                              {formatDescriptions[type] || "Standard peer-reviewed journal submission format."}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-2.5 text-[10px] font-bold text-slate-400">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                            <span>Double-blind Peer Reviewed</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 1: Manuscript Details */}
              {step === 1 && (
                <div>
                  <div className="border-b border-slate-200/90 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[color:var(--color-gb-gold-dark)]">
                      Step 2 of 6
                    </span>
                    <h2 className="font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                      Manuscript Details
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Provide the official title, primary subject area, abstract summary, and discovery keywords.
                    </p>
                  </div>

                  <div className="mt-6 space-y-5">
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold text-[color:var(--color-gb-blue-deep)] mb-1.5">
                        Full Manuscript Title <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={form.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="e.g. Community healthcare access patterns around Savar..."
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[color:var(--color-gb-blue)] focus:outline-none"
                      />
                      <p className="mt-1 text-[10.5px] text-slate-400 text-right">
                        {form.title.length} characters
                      </p>
                    </div>

                    {/* Subject Topic */}
                    <div>
                      <label className="block text-xs font-bold text-[color:var(--color-gb-blue-deep)] mb-1.5">
                        Primary Subject Category <span className="text-red-500">*</span>
                      </label>
                      <CustomSelect
                        options={topics}
                        value={form.topic}
                        onChange={(val) => updateField("topic", val)}
                      />
                    </div>

                    {/* Abstract */}
                    <div>
                      <label className="block text-xs font-bold text-[color:var(--color-gb-blue-deep)] mb-1.5">
                        Structured Abstract Summary <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        value={form.abstract}
                        onChange={(e) => updateField("abstract", e.target.value)}
                        placeholder="Provide a concise summary covering Background, Methods, Key Findings, and Conclusion..."
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-[color:var(--color-gb-blue)] focus:outline-none"
                      />
                      <div className="mt-1 flex justify-between text-[10.5px] text-slate-400">
                        <span>Recommended length: 150–300 words</span>
                        <span>{form.abstract.trim().split(/\s+/).filter(Boolean).length} words</span>
                      </div>
                    </div>

                    {/* Keywords */}
                    <div>
                      <label className="block text-xs font-bold text-[color:var(--color-gb-blue-deep)] mb-1.5">
                        Keywords (comma separated)
                      </label>
                      <input
                        type="text"
                        value={form.keywords}
                        onChange={(e) => updateField("keywords", e.target.value)}
                        placeholder="e.g. Public Health, Primary Care, Savar, Bangladesh"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-[color:var(--color-gb-blue)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Authors & Roles */}
              {step === 2 && (
                <div>
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200/90 pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[color:var(--color-gb-gold-dark)]">
                        Step 3 of 6
                      </span>
                      <h2 className="font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                        Authors & Contributor Roles
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Register all co-authors, institutional affiliations, and designate the corresponding author.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAuthorForm(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-gb-blue-deep)] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[color:var(--color-gb-blue)] transition-colors"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Add Co-Author
                    </button>
                  </div>

                  {/* Author List Cards */}
                  <div className="mt-6 space-y-3">
                    {authors.map((auth, idx) => (
                      <div
                        key={auth.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-mono text-xs font-black text-slate-700">
                            0{idx + 1}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{auth.name}</h4>
                              {auth.isCorresponding ? (
                                <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono text-[9.5px] font-extrabold uppercase text-amber-900">
                                  Corresponding Author
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => toggleCorresponding(auth.id)}
                                  className="text-[10px] font-bold text-slate-400 hover:text-[color:var(--color-gb-blue)] underline"
                                >
                                  Set as Corresponding
                                </button>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-slate-600 flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              {auth.institution}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400 font-mono">
                              {auth.email} {auth.orcid && `· ORCID: ${auth.orcid}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 justify-end border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => removeAuthor(auth.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Remove author"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Co-Author Form Modal / Inline Box */}
                  {showAuthorForm && (
                    <div className="mt-5 rounded-2xl border border-amber-300/80 bg-amber-50/40 p-4 sm:p-5">
                      <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                        <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                          Add New Co-Author
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowAuthorForm(false)}
                          className="text-amber-800 hover:text-amber-950 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Author Full Name *
                          </label>
                          <input
                            type="text"
                            value={newAuthor.name}
                            onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                            placeholder="e.g. Prof. Saiful Islam"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={newAuthor.email}
                            onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
                            placeholder="e.g. saiful@gonobishwabidyalay.edu.bd"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Institutional Affiliation
                          </label>
                          <input
                            type="text"
                            value={newAuthor.institution}
                            onChange={(e) => setNewAuthor({ ...newAuthor, institution: e.target.value })}
                            placeholder="e.g. Department of Pharmacy, Gono Bishwabidyalay"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            ORCID iD (Optional)
                          </label>
                          <input
                            type="text"
                            value={newAuthor.orcid}
                            onChange={(e) => setNewAuthor({ ...newAuthor, orcid: e.target.value })}
                            placeholder="e.g. 0000-0002-1823-4591"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={addCoAuthor}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-gb-blue-deep)] px-4 py-2 text-xs font-bold text-white hover:bg-[color:var(--color-gb-blue)]"
                        >
                          Save Co-Author
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Files Upload */}
              {step === 3 && (
                <div>
                  <div className="border-b border-slate-200/90 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[color:var(--color-gb-gold-dark)]">
                      Step 4 of 6
                    </span>
                    <h2 className="font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                      Manuscript Files Upload
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Upload your anonymized review document, title page, and optional ethics or supplementary datasets.
                    </p>
                  </div>

                  {/* Hidden Native File Input */}
                  <input
                    id="manuscript-file-picker"
                    type="file"
                    multiple
                    accept=".docx,.doc,.pdf,.zip"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFilesAdded(e.target.files);
                        e.target.value = "";
                      }
                    }}
                    className="hidden"
                  />

                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleFilesAdded(e.dataTransfer.files);
                      }
                    }}
                    onClick={() => {
                      document.getElementById("manuscript-file-picker")?.click();
                    }}
                    className={`mt-6 rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${isDragging
                        ? "border-[color:var(--color-gb-blue)] bg-blue-50/60 scale-[1.01] shadow-xs"
                        : "border-slate-300 bg-slate-50/70 hover:border-[color:var(--color-gb-blue)]/50 hover:bg-slate-50"
                      }`}
                  >
                    <UploadCloud className={`mx-auto h-10 w-10 transition-transform ${isDragging ? "scale-110 text-[color:var(--color-gb-blue)]" : "text-[color:var(--color-gb-blue)]"}`} />
                    <h3 className="mt-3 text-sm font-bold text-slate-900">
                      Drag & Drop manuscript files here
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Accepted file extensions: <strong className="text-slate-700">.docx, .pdf, .zip</strong> (Max size: 30MB)
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById("manuscript-file-picker")?.click();
                      }}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors"
                    >
                      Browse Local Files
                    </button>
                  </div>

                  {/* Uploaded Files Table */}
                  <div className="mt-6 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-700">
                        Uploaded Files Package ({form.files.length}):
                      </p>
                      {form.files.length > 0 && (
                        <button
                          type="button"
                          onClick={() => document.getElementById("manuscript-file-picker")?.click()}
                          className="text-[11px] font-bold text-[color:var(--color-gb-blue)] hover:underline"
                        >
                          + Add more files
                        </button>
                      )}
                    </div>

                    {form.files.length === 0 ? (
                      <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-6 text-center text-xs text-slate-500">
                        No files uploaded yet. Click above or drag & drop your manuscript file (.docx / .pdf).
                      </div>
                    ) : (
                      form.files.map((file) => (
                        <div
                          key={file.name}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 text-xs shadow-2xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-gb-blue-soft)] text-[color:var(--color-gb-blue)] font-bold">
                              <FileCode className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">{file.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                {file.type} · {file.size} · Uploaded {file.date}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <Check className="h-3 w-3" /> Validated
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(file.name)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Remove file"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Ethical Declarations */}
              {step === 4 && (
                <div>
                  <div className="border-b border-slate-200/90 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[color:var(--color-gb-gold-dark)]">
                      Step 5 of 6
                    </span>
                    <h2 className="font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                      Ethical Declarations & Compliance
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Confirm editorial declarations regarding COI, funding, institutional ethics, and AI tool usage.
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {[
                      {
                        key: "noConflict",
                        title: "Conflict of Interest Declaration",
                        desc: "Authors declare no financial, personal, or institutional conflicts of interest.",
                      },
                      {
                        key: "ethicsApproved",
                        title: "Institutional Ethics & Consent",
                        desc: "Human or animal subjects involved in this study received ethics committee approval and informed consent.",
                      },
                      {
                        key: "fundingDisclosed",
                        title: "Funding & Grant Acknowledgement",
                        desc: "All financial support, grants, or institutional sponsorship details have been disclosed.",
                      },
                      {
                        key: "aiDisclosed",
                        title: "Responsible Generative AI Disclosure",
                        desc: "AI tools (if used) were restricted to language polishing and disclosed according to COPE guidelines.",
                      },
                      {
                        key: "originalWork",
                        title: "Originality & Non-Duplicate Submission",
                        desc: "This manuscript is original work and is not currently under peer review elsewhere.",
                      },
                    ].map(({ key, title, desc }) => {
                      const val = form.declarations[key as keyof typeof form.declarations] as boolean;

                      return (
                        <label
                          key={key}
                          className={`group flex items-start gap-3.5 rounded-xl border p-4 cursor-pointer transition-colors duration-200 select-none ${val
                              ? "border-emerald-300/90 bg-emerald-50/40 shadow-2xs"
                              : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                            }`}
                        >
                          <div className="relative flex items-center pt-0.5">
                            <input
                              type="checkbox"
                              checked={val}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  declarations: { ...prev.declarations, [key]: e.target.checked },
                                }))
                              }
                              className="sr-only"
                            />
                            <motion.div
                              initial={false}
                              animate={
                                val
                                  ? { backgroundColor: "#059669", borderColor: "#059669" }
                                  : { backgroundColor: "#ffffff", borderColor: "#cbd5e1" }
                              }
                              transition={{ duration: 0.18 }}
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border shadow-2xs"
                            >
                              <AnimatePresence>
                                {val && (
                                  <motion.div
                                    key="check-icon"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                  >
                                    <Check className="h-3.5 w-3.5 text-white stroke-[3.5]" aria-hidden="true" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{title}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
                          </div>
                        </label>
                      );
                    })}

                    {/* Custom Notes */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-[color:var(--color-gb-blue-deep)] mb-1.5">
                        Ethics Protocol & Custom Disclosure Notes
                      </label>
                      <textarea
                        rows={3}
                        value={form.declarations.customNotes}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            declarations: { ...prev.declarations, customNotes: e.target.value },
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Final Review */}
              {step === 5 && (
                <div>
                  <div className="border-b border-slate-200/90 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[color:var(--color-gb-gold-dark)]">
                      Step 6 of 6
                    </span>
                    <h2 className="font-academic text-2xl font-bold text-[color:var(--color-gb-blue-deep)]">
                      Final Review & Confirmation
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Review all manuscript metadata and declarations before submitting to the editorial desk.
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* Summary Block 1 */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                        <span className="font-mono text-[10px] font-black text-slate-400 uppercase">
                          Article Info
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep(0)}
                          className="text-[11px] font-bold text-[color:var(--color-gb-blue)] hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <h4 className="mt-2.5 font-academic text-base font-bold text-slate-900">
                        {form.title}
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                          {form.type}
                        </span>
                        <span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-900">
                          {form.topic}
                        </span>
                      </div>
                      <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {form.abstract}
                      </p>
                    </div>

                    {/* Summary Block 2: Authors */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                        <span className="font-mono text-[10px] font-black text-slate-400 uppercase">
                          Authors ({authors.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-[11px] font-bold text-[color:var(--color-gb-blue)] hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="mt-2.5 space-y-1 text-xs">
                        {authors.map((a) => (
                          <p key={a.id} className="text-slate-800 font-medium">
                            <strong>{a.name}</strong> ({a.institution}) {a.isCorresponding && "— Corresponding"}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Summary Block 3: Declarations Check */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                        <ShieldCheck className="h-4 w-4 text-emerald-700" />
                        <span>All Ethical Declarations Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Controls */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/90 pt-5">
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.max(0, current - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back Step
                </button>

                {step < wizardSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((current) => Math.min(wizardSteps.length - 1, current + 1))}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-gb-blue-deep)] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[color:var(--color-gb-blue)]"
                  >
                    <span>Save & Continue</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700 transition-all"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Manuscript</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

