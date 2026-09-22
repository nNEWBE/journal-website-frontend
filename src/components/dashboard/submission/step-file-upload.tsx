"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Edit3,
  FileCheck2,
  FileEdit,
  FileText,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { createManuscriptFile } from "@/lib/manuscript-export";

export interface ManuscriptFile {
  name: string;
  size: string;
  type: string;
  date: string;
  file?: File;
  isWrittenOnline?: boolean;
}

interface StepFileUploadProps {
  files: ManuscriptFile[];
  setFiles: React.Dispatch<React.SetStateAction<ManuscriptFile[]>>;
}

const SUBMISSION_ATTACH_KEY = "gb_draft_written_manuscript";

export function StepFileUpload({ files, setFiles }: StepFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if an online-written manuscript was attached via /editor/manuscript
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SUBMISSION_ATTACH_KEY);
      if (stored) {
        const payload = JSON.parse(stored);
        if (payload.html && payload.filename) {
          const alreadyExists = files.some(
            (f) => f.name === payload.filename || f.isWrittenOnline
          );
          if (!alreadyExists) {
            const virtualFile = createManuscriptFile(payload.html, payload.title);
            const sizeStr = `${Math.max(1, Math.round(payload.html.length / 1024))} KB`;

            const attachedItem: ManuscriptFile = {
              name: payload.filename,
              size: sizeStr,
              type: "Blinded Manuscript (Written Online)",
              date: "Just now",
              file: virtualFile,
              isWrittenOnline: true,
            };

            setFiles((prev) => [attachedItem, ...prev]);
            toast.success("Online-drafted manuscript attached to submission!");
          }
        }
      }
    } catch (e) {
      console.error("Failed to sync written manuscript draft:", e);
    }
  }, [files, setFiles]);

  const processFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    if (incoming.length === 0) return;

    const newFiles: ManuscriptFile[] = incoming.map((file, idx) => {
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      return {
        name: file.name,
        size: sizeStr,
        type: files.length + idx === 0 ? "Blinded Manuscript" : "Supplementary Material",
        date: "Just now",
        file: file,
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove.isWrittenOnline) {
      try {
        localStorage.removeItem(SUBMISSION_ATTACH_KEY);
      } catch (err) {
        console.error(err);
      }
    }
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-sm font-extrabold text-slate-900">
          Upload Manuscript Files
        </h3>
        <p className="text-xs text-slate-500">
          Please upload your blinded manuscript file (PDF/DOCX) stripped of author names for double-blind review. At least one manuscript file is mandatory.
        </p>
      </div>

      {/* Mandatory manuscript file warning if empty */}
      {files.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 flex items-start gap-2.5 text-xs text-amber-900 shadow-2xs">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Manuscript File Upload Required</p>
            <p className="text-amber-800 text-[11.5px] leading-relaxed">
              At least one blinded manuscript document (PDF or DOCX) is required to proceed to the next section. Supplementary files (figures, tables, datasets) can also be added.
            </p>
          </div>
        </div>
      )}

      {/* ── NEW: Write Manuscript Online Feature Card ── */}
      <div className="rounded-2xl border border-blue-200/90 bg-linear-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b1b3d] text-white shadow-xs">
            <FileEdit className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900">
                Write Manuscript Online in Academic Word Processor
              </h4>
              <span className="inline-flex items-center px-2 py-0.5 bg-blue-100/80 text-[#1e40af] text-[10px] font-bold uppercase rounded-full">
                New
              </span>
            </div>
            <p className="text-[11.5px] text-slate-600 mt-0.5 leading-relaxed">
              Compose in predefined IMRaD format, customize academic fonts, font sizes, line spacing, tables, citations, and export as Word (.docx) directly attached here.
            </p>
          </div>
        </div>

        <Link
          href="/editor/manuscript"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b1b3d] hover:bg-[#162c60] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-all shadow-xs shrink-0 cursor-pointer group"
        >
          <span>Open Word Processor</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-amber-300" />
        </Link>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xlsx,.zip"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${isDragging
            ? "border-blue-500 bg-blue-50/80 scale-[0.99]"
            : files.length === 0
              ? "border-amber-300/80 bg-amber-50/20 hover:border-blue-400 hover:bg-blue-50/20"
              : "border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/20"
          }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs text-blue-600 border border-slate-200">
          <UploadCloud className="h-6 w-6" />
        </div>
        <p className="mt-3 text-xs font-bold text-slate-900">
          Click to browse or drop your manuscript files here
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          Accepts PDF, DOCX, XLSX, ZIP (Max 50MB per file) · Blinded Manuscript Required
        </p>
      </div>

      {/* Uploaded Files list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Attached Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {file.size} · {file.type} · {file.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {file.isWrittenOnline ? (
                    <>
                      <Link
                        href="/editor/manuscript"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 hover:bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-[#1e40af] border border-blue-200 transition-colors"
                        title="Reopen paper in academic word processor"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit in Processor
                      </Link>
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700 border border-emerald-200">
                        <FileCheck2 className="h-3 w-3" />
                        Attached
                      </span>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700 border border-emerald-200">
                      <FileCheck2 className="h-3 w-3" />
                      Uploaded
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
