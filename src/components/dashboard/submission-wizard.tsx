"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  LayoutDashboard,
  Save,
  Send,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getSession } from "@/lib/auth";
import { submissionsApi } from "@/lib/api";
import { PremiumLoader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { addNotification, sendBrowserNotification } from "@/lib/notifications";

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

  const abstractWordCount = useMemo(() => {
    return form.abstract.trim()
      ? form.abstract.trim().split(/\s+/).filter(Boolean).length
      : 0;
  }, [form.abstract]);

  const authorsMissingBank = useMemo(() => {
    return authors.filter(
      (a) => !a.bankName?.trim() || !a.accountNumber?.trim() || !a.accountHolderName?.trim()
    );
  }, [authors]);

  const completeness = useMemo(() => {
    let score = 0;
    if (form.type) score += 10;
    if (form.title.trim().length >= 10) score += 15;
    if (abstractWordCount >= 150) score += 15;
    else if (abstractWordCount > 0) score += Math.round((abstractWordCount / 150) * 15);
    if (form.keywords.trim().length >= 3) score += 15;

    // All authors must have name, academic email, and mandatory bank details
    const allAuthorsValid =
      authors.length > 0 &&
      authors.every(
        (a) =>
          a.name.trim() &&
          a.email.trim() &&
          a.bankName?.trim() &&
          a.accountNumber?.trim() &&
          a.accountHolderName?.trim()
      );
    if (allAuthorsValid) {
      score += 15;
    } else if (authors.length > 0 && authors.every((a) => a.name.trim() && a.email.trim())) {
      score += 7; // partial score if authors exist but bank details incomplete
    }

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
  }, [form, authors, abstractWordCount]);

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
        toast.error("Structured Abstract Required", {
          description: "Please provide a structured abstract of at least 150 words.",
        });
        return false;
      }
      if (abstractWordCount < 150) {
        toast.error("Abstract Under Minimum Word Count", {
          description: `Structured abstract must contain at least 150 words to proceed to the next section. Current count: ${abstractWordCount} words (${150 - abstractWordCount} more needed).`,
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
      const missingBankAuthor = authors.find(
        (a) => !a.bankName?.trim() || !a.accountNumber?.trim() || !a.accountHolderName?.trim()
      );
      if (missingBankAuthor) {
        toast.error("Mandatory Bank Details Missing", {
          description: `Author "${missingBankAuthor.name}" is missing required bank account details. University policy mandates honorarium disbursement information for all contributing authors.`,
        });
        return false;
      }
    }

    if (currentStep === 2) {
      if (!form.files || form.files.length === 0) {
        toast.error("Manuscript File Required", {
          description: "Please upload at least one blinded manuscript file (PDF or DOCX) before proceeding to the next step.",
        });
        return false;
      }
    }

    if (currentStep === 3) {
      if (!form.declarations.originalWork) {
        toast.error("Original Work Declaration Required", {
          description: "You must confirm that this manuscript is original work and not under review elsewhere.",
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
      for (let s = step; s < idx; s++) {
        if (!validateCurrentStep(s)) {
          return;
        }
      }
      setStep(idx);
    }
  }

  async function handleSubmit() {
    if (
      !validateCurrentStep(0) ||
      !validateCurrentStep(1) ||
      !validateCurrentStep(2) ||
      !validateCurrentStep(3)
    ) {
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

      // 1. Author In-App Notification
      addNotification({
        title: "Manuscript Submitted Successfully",
        message: `Manuscript ${generatedId} ("${form.title || "Untitled Manuscript"}") has been submitted and entered editorial desk screening.`,
        type: "submission",
        link: "/dashboard/author",
        targetRoles: ["author"],
      });

      // 2. Admin & Super Admin In-App Notification
      addNotification({
        title: `New Manuscript: ${generatedId}`,
        message: `${currentUser?.name || "Author"} submitted "${form.title || "Untitled Manuscript"}" (${form.type} · ${form.topic}). Awaiting desk review.`,
        type: "editorial",
        link: "/dashboard/pipeline",
        targetRoles: ["admin", "super_admin", "editor"],
      });

      // 3. Desktop Browser Notification
      sendBrowserNotification(`Manuscript ${generatedId} Submitted!`, {
        body: `"${form.title || "Untitled Manuscript"}" has been successfully submitted to GB Journal.`,
        tag: `submission-${generatedId}`,
      });

      toast.success(`Manuscript ${generatedId} submitted successfully!`, {
        id: toastId,
        description: "Your manuscript is now in the editorial screening queue. Confirmation emails and alerts have been sent.",
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
              <LayoutDashboard className="h-4 w-4" />
              <span>Go to Author Dashboard</span>
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
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-3">
            {step === 0 && abstractWordCount < 150 && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg hidden sm:inline-flex items-center gap-1.5 shadow-2xs">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                {abstractWordCount === 0
                  ? "Abstract requires at least 150 words to proceed"
                  : `Need ${150 - abstractWordCount} more words to unlock next step`}
              </span>
            )}

            {step === 1 && authorsMissingBank.length > 0 && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg hidden sm:inline-flex items-center gap-1.5 shadow-2xs">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                {authorsMissingBank.length === 1
                  ? `Bank details required for ${authorsMissingBank[0].name}`
                  : `Bank details required for all ${authorsMissingBank.length} authors`}
              </span>
            )}

            {step === 2 && form.files.length === 0 && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg hidden sm:inline-flex items-center gap-1.5 shadow-2xs">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                Manuscript file upload required to proceed
              </span>
            )}

            {step === 3 && !form.declarations.originalWork && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg hidden sm:inline-flex items-center gap-1.5 shadow-2xs">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                Original work confirmation required to proceed
              </span>
            )}

            {step === 4 &&
              (authorsMissingBank.length > 0 ||
                form.files.length === 0 ||
                !form.declarations.originalWork) && (
                <span className="text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg hidden sm:inline-flex items-center gap-1.5 shadow-2xs">
                  <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                  Resolve highlighted issues to submit
                </span>
              )}

            {step < wizardSteps.length - 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-extrabold transition-all cursor-pointer shadow-xs",
                  (step === 0 && abstractWordCount < 150) ||
                    (step === 1 && authorsMissingBank.length > 0) ||
                    (step === 2 && form.files.length === 0) ||
                    (step === 3 && !form.declarations.originalWork)
                    ? "bg-slate-100 text-slate-400 border border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300"
                    : "bg-gb-blue text-white hover:bg-gb-blue-dark"
                )}
                title={
                  step === 0 && abstractWordCount < 150
                    ? `Minimum 150 words required for abstract (${150 - abstractWordCount} more needed)`
                    : step === 1 && authorsMissingBank.length > 0
                      ? `Mandatory bank details required for all authors before proceeding (${authorsMissingBank.map((a) => a.name).join(", ")})`
                      : step === 2 && form.files.length === 0
                        ? "Please upload your blinded manuscript file (PDF or DOCX) to proceed"
                        : step === 3 && !form.declarations.originalWork
                          ? "Please confirm the original work declaration to proceed"
                          : "Proceed to next step"
                }
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  !form.keywords.trim() ||
                  authorsMissingBank.length > 0 ||
                  form.files.length === 0 ||
                  !form.declarations.originalWork
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gb-blue-deep px-6 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-gb-blue transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting Manuscript...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Finalize & Submit Manuscript
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
