"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  Save,
  Send,
  Upload,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { articleTypes, topics, submissions as seedSubmissions } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { CustomSelect } from "@/components/ui/custom-select";
import { PremiumLoader } from "@/components/ui/loader";

const steps = [
  "Article type",
  "Manuscript details",
  "Authors",
  "Files",
  "Declarations",
  "Review",
];

export function SubmissionWizard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [newSubId, setNewSubId] = useState("");
  const [form, setForm] = useState({
    type: "Research Article",
    topic: "Public Health",
    title: "Community nutrition confidence among university households",
    abstract:
      "This demo submission examines public health communication, household nutrition decisions, and university-led outreach opportunities.",
    authors: "Ayesha Siddique, Md. Arif Hasan",
    files: "manuscript-main.docx, title-page.docx, ethics-approval.pdf",
    declarations: "No conflict of interest. No external funding. AI tools used for language polishing and disclosed.",
  });

  // Auth Guard checking
  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login?redirect=/dashboard/submissions/new");
    } else {
      setCurrentUser(session);
      setLoading(false);
    }
  }, [router]);

  const completeness = useMemo(() => {
    const filled = Object.values(form).filter(Boolean).length;
    return Math.round((filled / Object.keys(form).length) * 100);
  }, [form]);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit() {
    const generatedId = `GBJ-2026-${Math.floor(100 + Math.random() * 900)}`;
    setNewSubId(generatedId);

    const newSubmission = {
      id: generatedId,
      title: form.title,
      type: form.type,
      author: currentUser?.name || "Ayesha Siddique",
      status: "Awaiting Editor",
      editor: "Unassigned",
      reviewers: [],
      updated: "Just now",
      due: "2026-07-20",
      score: 60,
    };

    // Load current submissions database from localStorage
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

    // Append to decision logs in localStorage
    const localLogs = localStorage.getItem("gb_journal_decision_log");
    let currentLogs = [];
    if (localLogs) {
      try {
        currentLogs = JSON.parse(localLogs);
      } catch (e) {
        currentLogs = [];
      }
    }
    const logMsg = `[New Submission] ${generatedId}: "${form.title}" submitted by Author ${currentUser?.name || "Ayesha Siddique"}`;
    localStorage.setItem("gb_journal_decision_log", JSON.stringify([logMsg, ...currentLogs]));

    toast.success(`Manuscript ${generatedId} submitted successfully!`);
    setSubmitted(true);
  }

  if (loading) {
    return (
      <PremiumLoader text="Verifying author credentials..." className="journal-shell min-h-screen flex items-center justify-center" />
    );
  }

  return (
    <div className="journal-shell min-h-screen py-8">
      <div className="container-x">
        <div className="glass-panel rounded-xl p-5 border border-[color:var(--border)]">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <span className="badge badge-red uppercase font-black tracking-wide text-[9px]">
                Author Submission
              </span>
              <h1 className="mt-3 text-3xl font-extrabold text-[color:var(--green-dark)] font-academic">
                New Manuscript Wizard
              </h1>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[color:var(--ink-muted)]">
                Please complete the following six steps to index your research in Gono Bishwabidyalay Journal. All inputs are validated and saved dynamically.
              </p>
            </div>
            <div className="rounded-xl border border-[color:var(--border)] bg-white p-4 text-center shadow-sm min-w-24">
              <p className="text-3xl font-black text-[color:var(--green-dark)]">
                {completeness}%
              </p>
              <p className="text-[10px] font-bold text-[color:var(--ink-muted)] uppercase tracking-wider mt-0.5">
                Complete
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="surface h-fit rounded-xl p-4 bg-white border border-[color:var(--border)]">
            <div className="grid gap-1">
              {steps.map((item, index) => (
                <button
                  key={item}
                  onClick={() => setStep(index)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-black transition-all ${
                    step === index
                      ? "bg-[color:var(--university-green)] text-white shadow"
                      : "text-[color:var(--green-dark)] hover:bg-[color:var(--green-soft)]"
                  }`}
                >
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold font-mono border ${
                    step === index ? "bg-white/20 border-white/20" : "bg-slate-50 border-slate-200"
                  }`}>
                    {index + 1}
                  </span>
                  {item}
                </button>
              ))}
            </div>
            <button
              onClick={() => toast.success("Draft saved successfully. Auto-save is active.")}
              className="btn-secondary mt-4 w-full py-2.5 text-xs font-bold gap-1.5"
            >
              <Save className="h-4 w-4" />
              Autosaved Draft
            </button>
          </aside>

          <section className="surface rounded-xl p-6 bg-white border border-[color:var(--border)] shadow-sm">
            {submitted ? (
              <div className="grid min-h-[380px] place-items-center text-center">
                <div className="max-w-md">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-[color:var(--university-green)] animate-bounce" />
                  <h2 className="mt-5 text-2xl font-black text-[color:var(--green-dark)] font-academic">
                    Manuscript Received Successfully
                  </h2>
                  <p className="mt-3 text-xs leading-relaxed text-[color:var(--ink-muted)]">
                    Your manuscript has been logged under accession number <strong className="font-mono text-red-600 font-extrabold">{newSubId}</strong> and routed to the editorial triage desk.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => {
                        window.location.href = "/dashboard";
                      }}
                      className="btn-primary py-2.5 px-5 rounded-lg text-xs"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setStep(0);
                        setSubmitted(false);
                      }}
                      className="btn-secondary py-2.5 px-5 rounded-lg text-xs"
                    >
                      Submit Another
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <WizardStep step={step} form={form} update={update} />
                <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-[color:var(--border)] pt-5">
                  <button
                    onClick={() => setStep((current) => Math.max(0, current - 1))}
                    disabled={step === 0}
                    className="btn-secondary text-xs disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Back
                  </button>
                  {step < steps.length - 1 ? (
                    <button
                      onClick={() =>
                        setStep((current) =>
                          Math.min(steps.length - 1, current + 1),
                        )
                      }
                      className="btn-primary text-xs"
                    >
                      Save and Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="btn-primary text-xs shadow-md"
                    >
                      <Send className="h-4 w-4 animate-pulse" />
                      Submit Manuscript
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function WizardStep({
  step,
  form,
  update,
}: {
  step: number;
  form: {
    type: string;
    topic: string;
    title: string;
    abstract: string;
    authors: string;
    files: string;
    declarations: string;
  };
  update: (key: keyof typeof form, value: string) => void;
}) {
  if (step === 0) {
    return (
      <div>
        <h2 className="text-xl font-extrabold text-[color:var(--green-dark)] font-academic border-b border-[color:var(--border)] pb-3">
          Choose Article Type
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {articleTypes.map((type) => (
            <button
              key={type}
              onClick={() => update("type", type)}
              className={`rounded-lg border p-4 text-left transition-all ${
                form.type === type
                  ? "border-[color:var(--university-green)] bg-[color:var(--green-soft)] ring-1 ring-[color:var(--university-green)]"
                  : "border-[color:var(--border)] bg-white hover:border-slate-300"
              }`}
            >
              <FileText className="h-5 w-5 text-[color:var(--university-green)]" />
              <p className="mt-3 font-extrabold text-xs text-[color:var(--green-dark)]">
                {type}
              </p>
              <p className="mt-2 text-[10px] leading-relaxed text-[color:var(--ink-muted)]">
                Includes structured abstract, conflict of interest declarations, reference indexing, and source uploads.
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <FormBlock title="Manuscript Details">
        <Field
          label="Manuscript Title"
          value={form.title}
          onChange={(value) => update("title", value)}
        />
        <div className="grid gap-2">
          <span className="text-xs font-black text-[color:var(--green-dark)]">
            Primary Subject Topic
          </span>
          <CustomSelect
            options={topics}
            value={form.topic}
            onChange={(val) => update("topic", val)}
          />
        </div>
        <TextArea
          label="Abstract Summary"
          value={form.abstract}
          onChange={(value) => update("abstract", value)}
        />
      </FormBlock>
    );
  }

  if (step === 2) {
    return (
      <FormBlock title="Authors & Affiliations">
        <TextArea
          label="Author List & Institutional Affiliations"
          value={form.authors}
          onChange={(value) => update("authors", value)}
        />
        <button
          type="button"
          onClick={() => toast.info("Affiliation manager workspace is simulated.")}
          className="btn-secondary w-fit text-xs px-3.5 py-2 font-bold"
        >
          <UserPlus className="h-4 w-4" />
          Add Co-Author
        </button>
      </FormBlock>
    );
  }

  if (step === 3) {
    return (
      <FormBlock title="Manuscript Files Upload">
        <div className="rounded-lg border-2 border-dashed border-[color:var(--border)] bg-slate-50 p-8 text-center">
          <Upload className="mx-auto h-10 w-10 text-[color:var(--university-green)]" />
          <p className="mt-3 font-extrabold text-sm text-[color:var(--green-dark)]">
            Drag files here or click to browse
          </p>
          <p className="mt-2 text-xs text-[color:var(--ink-muted)]">
            Supported formats: .docx, .pdf, .zip (Max size: 30MB)
          </p>
          <p className="mt-3 text-xs font-mono font-bold text-[color:var(--university-green)] bg-white inline-block border border-[color:var(--border)] px-3 py-1.5 rounded">
            Uploaded: {form.files}
          </p>
        </div>
      </FormBlock>
    );
  }

  if (step === 4) {
    return (
      <FormBlock title="Declarations & Ethical Disclosures">
        <TextArea
          label="Declaration of Conflict, Funding, Bio-Ethics approvals, and AI usage"
          value={form.declarations}
          onChange={(value) => update("declarations", value)}
        />
      </FormBlock>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold text-[color:var(--green-dark)] font-academic border-b border-[color:var(--border)] pb-3">
        Review & Submit Manuscript
      </h2>
      <p className="mt-2 text-xs text-[color:var(--ink-muted)]">
        Please review your answers before submitting your manuscript for editorial check.
      </p>
      <div className="mt-5 grid gap-3">
        {Object.entries(form).map(([key, value]) => (
          <div
            key={key}
            className="rounded-lg border border-[color:var(--border)] bg-slate-50/50 p-4"
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-[color:var(--ink-muted)]">
              {key}
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-800 leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-[color:var(--green-dark)] font-academic border-b border-[color:var(--border)] pb-3">
        {title}
      </h2>
      <div className="mt-5 grid gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black text-[color:var(--green-dark)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-[color:var(--border)] bg-white px-3 py-3 text-xs outline-none focus:border-[color:var(--university-green)]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black text-[color:var(--green-dark)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="rounded-lg border border-[color:var(--border)] bg-white px-3 py-3 text-xs outline-none focus:border-[color:var(--university-green)]"
      />
    </label>
  );
}
