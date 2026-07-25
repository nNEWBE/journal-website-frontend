"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  Save,
  Send,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { submissions as seedSubmissions } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { PremiumLoader } from "@/components/ui/loader";

import { StepArticleInfo } from "./submission/step-article-info";
import { StepAuthorsList, type AuthorItem } from "./submission/step-authors-list";
import { StepFileUpload, type ManuscriptFile } from "./submission/step-file-upload";
import { StepDeclarations, type DeclarationsState } from "./submission/step-declarations";
import { StepReviewSubmit } from "./submission/step-review-submit";

const wizardSteps = [
  { id: "details", title: "Manuscript Details", short: "Details", description: "Title, topic & abstract" },
  { id: "authors", title: "Authors & Roles", short: "Authors", description: "Contributors & ORCID" },
  { id: "files", title: "Manuscript Files", short: "Files", description: "Blinded copy & data" },
  { id: "declarations", title: "Ethical Declarations", short: "Ethics", description: "COI & AI disclosures" },
  { id: "review", title: "Final Review", short: "Review", description: "Confirm & submit" },
];

export function SubmissionWizard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [newSubId, setNewSubId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    type: "Research Article",
    topic: "Public Health",
    title: "",
    abstract: "",
    keywords: "",
    files: [] as ManuscriptFile[],
    declarations: {
      noConflict: false,
      ethicsApproved: false,
      fundingDisclosed: false,
      aiDisclosed: false,
      originalWork: false,
      customNotes: "",
    } as DeclarationsState,
  });

  const [authors, setAuthors] = useState<AuthorItem[]>([]);

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

  const completeness = useMemo(() => {
    let score = 0;
    if (form.type) score += 15;
    if (form.title.trim().length >= 10) score += 20;
    if (form.abstract.trim().length >= 30) score += 20;
    if (authors.length > 0) score += 15;
    if (form.files.length > 0) score += 15;

    const decs = form.declarations;
    const checkedCount = [
      decs.noConflict,
      decs.ethicsApproved,
      decs.fundingDisclosed,
      decs.aiDisclosed,
      decs.originalWork,
    ].filter(Boolean).length;
    score += Math.round((checkedCount / 5) * 15);

    return Math.min(100, score);
  }, [form, authors]);

  function handleFormChange(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleDeclarationChange(field: keyof DeclarationsState, value: any) {
    setForm((prev) => ({
      ...prev,
      declarations: { ...prev.declarations, [field]: value },
    }));
  }

  function handleSubmit() {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `GBJ-2026-${Math.floor(100 + Math.random() * 900)}`;
      setNewSubId(generatedId);

      const newSubmission = {
        id: generatedId,
        title: form.title || "Untitled Manuscript",
        track: form.topic,
        author: authors.find((a) => a.isCorresponding)?.name || authors[0]?.name || "Author",
        status: "Submitted",
        score: 85,
        submittedDate: "Today",
        due: "14 Days",
        reviewers: [],
        editor: "Section Editor",
        type: form.type,
        abstract: form.abstract,
        updated: "Just now",
      };

      const localSubsStr = localStorage.getItem("gb_journal_submissions");
      let currentSubs = seedSubmissions;
      if (localSubsStr) {
        try {
          currentSubs = JSON.parse(localSubsStr);
        } catch (e) {
          console.error(e);
        }
      }
      const updated = [newSubmission, ...currentSubs];
      localStorage.setItem("gb_journal_submissions", JSON.stringify(updated));

      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(`Manuscript ${generatedId} submitted successfully!`);
    }, 1200);
  }

  if (loading) {
    return <PremiumLoader text="Loading Submission Portal..." />;
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl py-12 px-4 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl space-y-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <span className="font-mono text-xs font-black uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              ID: {newSubId}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
              Manuscript Successfully Submitted!
            </h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              Your manuscript has been logged into the Gono Bishwabidyalay publication portal and routed for initial desk screening.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard/author"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[color:var(--color-gb-blue)] px-6 text-xs font-extrabold text-white shadow-xs hover:bg-[color:var(--color-gb-blue-dark)] transition-colors"
            >
              Go to Author Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Step Stepper Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-900">
              Online Manuscript Submission
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {wizardSteps[step].title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              Step {step + 1} of {wizardSteps.length}
            </span>
          </div>
        </div>

        {/* Stepper pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {wizardSteps.map((s, idx) => {
            const isActive = step === idx;
            const isCompleted = step > idx;

            return (
              <button
                key={s.id}
                onClick={() => setStep(idx)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[color:var(--color-gb-blue)] text-white shadow-xs"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <span>{s.short}</span>
                {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <StepArticleInfo form={form} onChange={handleFormChange} />
            )}
            {step === 1 && (
              <StepAuthorsList authors={authors} setAuthors={setAuthors} />
            )}
            {step === 2 && (
              <StepFileUpload
                files={form.files}
                setFiles={(f) => handleFormChange("files", typeof f === "function" ? f(form.files) : f)}
              />
            )}
            {step === 3 && (
              <StepDeclarations
                declarations={form.declarations}
                onChange={handleDeclarationChange}
              />
            )}
            {step === 4 && (
              <StepReviewSubmit
                form={form}
                authors={authors}
                completeness={completeness}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Wizard Controls */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          {step < wizardSteps.length - 1 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-gb-blue)] px-5 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-[color:var(--color-gb-blue-dark)] transition-colors cursor-pointer"
            >
              Next Step
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
