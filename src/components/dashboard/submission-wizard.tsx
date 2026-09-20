"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  Save,
  Send,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getSession } from "@/lib/auth";
import { submissionsApi } from "@/lib/api";
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
    if (form.type) score += 10;
    if (form.title.trim().length >= 10) score += 15;
    if (form.abstract.trim().length >= 30) score += 15;
    if (form.keywords.trim().length >= 3) score += 15;
    if (authors.length > 0 && authors.every((a) => a.name.trim() && a.email.trim())) score += 15;
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

  function validateCurrentStep(currentStep: number): boolean {
    if (currentStep === 0) {
      if (!form.title.trim()) {
        toast.error("Manuscript Title Required", {
          description: "Please provide a descriptive title for your manuscript.",
        });
        return false;
      }
      if (!form.abstract.trim()) {
        toast.error("Abstract Required", {
          description: "Please provide a structured abstract (150-300 words).",
        });
        return false;
      }
      if (!form.keywords.trim()) {
        toast.error("Keywords are Mandatory", {
          description: "Please enter at least 1-3 comma-separated keywords for manuscript indexing.",
        });
        return false;
      }
    }

    if (currentStep === 1) {
      if (authors.length === 0) {
        toast.error("Author Required", {
          description: "Please add at least one contributing author.",
        });
        return false;
      }
      const missingEmailOrName = authors.find((a) => !a.name.trim() || !a.email.trim());
      if (missingEmailOrName) {
        toast.error("Incomplete Author Details", {
          description: "Every author must have a valid full name and academic email.",
        });
        return false;
      }
    }

    return true;
  }

  function handleNextStep() {
    if (validateCurrentStep(step)) {
      setStep((prev) => Math.min(wizardSteps.length - 1, prev + 1));
    }
  }

  function handleStepClick(idx: number) {
    if (idx <= step) {
      setStep(idx);
    } else {
      if (validateCurrentStep(step)) {
        setStep(idx);
      }
    }
  }

  async function handleSubmit() {
    if (!validateCurrentStep(0) || !validateCurrentStep(1)) {
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting manuscript...", {
      description: "Creating submission draft and registering metadata...",
    });

    try {
      const draft = await submissionsApi.createDraft({
        title: form.title || "Untitled Manuscript",
        type: form.type || "Research Article",
        abstractText: form.abstract || "",
        keywords: form.keywords || "",
        topic: form.topic || "General Medicine",
        copyrightAgreed: true,
        authors: authors.map((a, idx) => ({
          name: a.name.trim(),
          email: a.email.trim(),
          affiliation: a.institution?.trim() || "Gono Bishwabidyalay",
          orcid: a.orcid?.trim() || undefined,
          authorOrder: idx + 1,
          corresponding: !!a.isCorresponding,
          bankName: a.bankName?.trim() || undefined,
          accountNumber: a.accountNumber?.trim() || undefined,
          accountHolderName: a.accountHolderName?.trim() || undefined,
          branchName: a.branchName?.trim() || undefined,
          routingNumber: a.routingNumber?.trim() || undefined,
        })),
      });

      // Upload attached files to Supabase Storage via backend
      if (form.files && form.files.length > 0) {
        for (const item of form.files) {
          if (item.file) {
            toast.loading(`Uploading ${item.name} to secure storage...`, { id: toastId });
            try {
              await submissionsApi.uploadFile(draft.id, item.file, "MANUSCRIPT");
            } catch (uploadErr: any) {
              console.error("Failed to upload file:", item.name, uploadErr);
            }
          }
        }
      }

      toast.loading("Finalizing submission and notifying editorial office...", { id: toastId });
      const result = await submissionsApi.submit(draft.id);
      const generatedId = String(
        (result as any)?.submissionId ||
        result?.id ||
        (draft as any)?.submissionId ||
        draft?.id ||
        "SUB-NEW"
      );
      setNewSubId(generatedId);
      setSubmitted(true);
      toast.success(`Manuscript ${generatedId} submitted successfully!`, {
        id: toastId,
        description: "Your manuscript is now in the editorial screening queue.",
        duration: 5000,
      });
    } catch (err: any) {
      console.error("Backend submission error:", err);
      toast.error("Submission Failed", {
        id: toastId,
        description: err?.message || "Failed to submit manuscript. Please try again.",
        duration: 6000,
      });
    } finally {
      setIsSubmitting(false);
    }
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
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gb-blue px-6 text-xs font-extrabold text-white shadow-xs hover:bg-gb-blue-dark transition-colors"
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
                onClick={() => handleStepClick(idx)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isActive
                  ? "bg-gb-blue text-white shadow-xs"
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
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gb-blue px-5 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-gb-blue-dark transition-colors cursor-pointer"
            >
              Next Step
              <ArrowUpRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
