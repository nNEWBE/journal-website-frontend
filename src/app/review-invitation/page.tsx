"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Calendar,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  Loader2,
  BookOpen,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { reviewerApi } from "@/lib/api";
import { addNotification } from "@/lib/notifications";
import { cn } from "@/lib/utils";

interface InvitationData {
  assignmentId: number;
  status: string;
  submissionId: string;
  title: string;
  type: string;
  topic: string;
  abstractText: string;
  reviewerName: string;
  reviewerEmail: string;
  dueDate: string;
}

function ReviewInvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const initialAction = searchParams.get("action"); // "accept" | "decline"

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultState, setResultState] = useState<"accepted" | "declined" | null>(null);
  const [alreadyResponded, setAlreadyResponded] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Missing invitation security token. Please check the link from your email.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadAndMaybeRespond() {
      try {
        const data = await reviewerApi.getInvitationByToken(token as string);
        if (!isMounted) return;
        setInvitation(data);

        if (data.status === "ACCEPTED") {
          setResultState("accepted");
          setAlreadyResponded(true);
          setLoading(false);
          return;
        }
        if (data.status === "DECLINED") {
          setResultState("declined");
          setAlreadyResponded(true);
          setLoading(false);
          return;
        }

        // Auto-trigger if direct action link from email
        if (initialAction === "accept" || initialAction === "decline") {
          const isAccept = initialAction === "accept";
          setSubmitting(true);
          const res = await reviewerApi.respondToInvitationByToken(token as string, isAccept);
          if (!isMounted) return;

          setResultState(isAccept ? "accepted" : "declined");

          // Dispatch in-app site notification
          addNotification({
            title: isAccept ? "Review Invitation Accepted" : "Review Invitation Declined",
            message: isAccept
              ? `${data.reviewerName} accepted review invitation for ${data.submissionId} ("${data.title}").`
              : `${data.reviewerName} declined review invitation for ${data.submissionId} ("${data.title}"). Manuscript is now unassigned.`,
            type: "review",
            targetRoles: ["editor", "admin", "super_admin"],
            link: "/dashboard/pipeline",
          });
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || "Invalid or expired invitation token.");
      } finally {
        if (isMounted) {
          setLoading(false);
          setSubmitting(false);
        }
      }
    }

    loadAndMaybeRespond();

    return () => {
      isMounted = false;
    };
  }, [token, initialAction]);

  const handleManualRespond = async (accept: boolean) => {
    if (!token) return;
    setSubmitting(true);
    try {
      await reviewerApi.respondToInvitationByToken(token, accept);
      setResultState(accept ? "accepted" : "declined");

      if (invitation) {
        addNotification({
          title: accept ? "Review Invitation Accepted" : "Review Invitation Declined",
          message: accept
            ? `${invitation.reviewerName} accepted review invitation for ${invitation.submissionId} ("${invitation.title}").`
            : `${invitation.reviewerName} declined review invitation for ${invitation.submissionId} ("${invitation.title}"). Manuscript is now unassigned.`,
          type: "review",
          targetRoles: ["editor", "admin", "super_admin"],
          link: "/dashboard/pipeline",
        });
      }
    } catch (err: any) {
      setError(err?.message || "Failed to process invitation response.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/20 to-slate-100 flex flex-col justify-between font-sans">
      {/* Top Academic Header Bar */}
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gb-blue text-white flex items-center justify-center font-serif font-black text-base shadow-xs">
              G
            </div>
            <div>
              <span className="font-serif font-extrabold text-slate-900 tracking-tight text-sm block">
                Gono Bishwabidyalay Journal
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block -mt-0.5">
                Peer Review Management Portal
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-gb-blue border border-blue-200/80">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Invitation</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col justify-center">
        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-lg space-y-4">
            <Loader2 className="h-10 w-10 text-gb-blue animate-spin mx-auto" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Validating Review Invitation</h2>
              <p className="text-xs text-slate-500">
                Contacting editorial dispatch servers and loading manuscript metadata...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-white p-8 sm:p-10 shadow-lg text-center space-y-5">
            <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600 shadow-2xs">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-slate-900">Invitation Link Error</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">{error}</p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <span>Return to Journal Home</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : resultState === "accepted" ? (
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 sm:p-12 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="h-16 w-16 rounded-3xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-800">
                {alreadyResponded ? "Invitation Already Accepted" : "Invitation Successfully Accepted"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900">
                Thank You, {invitation?.reviewerName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Your confirmation has been transmitted to the handling editor. The manuscript status has been updated to <strong>Under Review</strong> and you may now proceed with your scholarly evaluation.
              </p>
            </div>

            {/* Manuscript Badge Details */}
            {invitation && (
              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 text-left space-y-3 max-w-lg mx-auto">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-400">{invitation.submissionId}</span>
                  <span className="font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                    {invitation.type}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                  {invitation.title}
                </h4>
                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    Review Deadline:
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {invitation.dueDate
                      ? new Date(invitation.dueDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Standard 14 Days"}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard/reviewer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gb-blue text-xs font-bold text-white shadow-xs hover:bg-gb-blue-dark transition-all"
              >
                <UserCheck className="h-4 w-4" />
                <span>Open Reviewer Workspace</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>Journal Home</span>
              </Link>
            </div>
          </div>
        ) : resultState === "declined" ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="h-16 w-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-600 shadow-xs">
              <XCircle className="h-9 w-9 text-slate-500" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-700">
                {alreadyResponded ? "Invitation Already Declined" : "Review Invitation Declined"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900">
                Thank You for Notifying Us
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                We appreciate your prompt response, {invitation?.reviewerName}. The editorial office has been notified and the manuscript has been unassigned so that an alternative referee may be designated.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard/reviewer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gb-blue text-xs font-bold text-white shadow-xs hover:bg-gb-blue-dark transition-all"
              >
                <UserCheck className="h-4 w-4" />
                <span>Go to Reviewer Workspace</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span>Return to Journal Home</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Initial Overview Card before manual action */
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                  Pending Peer Review Invitation
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                {invitation?.submissionId}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {invitation?.type} · {invitation?.topic || "Interdisciplinary"}
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-slate-900 leading-snug">
                {invitation?.title}
              </h1>
            </div>

            {/* Target Completion Deadline Banner */}
            <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50/60 to-slate-50/40 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 block">
                    Target Evaluation Due Date
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {invitation?.dueDate
                      ? new Date(invitation.dueDate).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "14 days from invitation"}
                  </span>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-[11px] font-bold text-blue-700 bg-white border border-blue-200 px-2.5 py-1 rounded-full shadow-2xs">
                Turnaround Requirement
              </span>
            </div>

            {/* Abstract preview if available */}
            {invitation?.abstractText && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Abstract</span>
                </span>
                <p className="text-xs text-slate-600 leading-relaxed max-h-48 overflow-y-auto pr-2">
                  {invitation.abstractText}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleManualRespond(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
              >
                Decline Review
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleManualRespond(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gb-blue text-xs font-extrabold text-white shadow-xs hover:bg-gb-blue-dark transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Confirmation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Accept Review Invitation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white px-6 py-4 text-center text-xs text-slate-400">
        <p>
          &copy; {new Date().getFullYear()} Gono Bishwabidyalay Journal of Science &amp; Technology. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default function ReviewInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="h-8 w-8 animate-spin text-gb-blue" />
        </div>
      }
    >
      <ReviewInvitationContent />
    </Suspense>
  );
}
