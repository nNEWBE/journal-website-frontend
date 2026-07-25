"use client";

import { useState } from "react";
import { FileCheck2, FileText, Trash2, UploadCloud } from "lucide-react";

export interface ManuscriptFile {
  name: string;
  size: string;
  type: string;
  date: string;
}

interface StepFileUploadProps {
  files: ManuscriptFile[];
  setFiles: React.Dispatch<React.SetStateAction<ManuscriptFile[]>>;
}

export function StepFileUpload({ files, setFiles }: StepFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleSimulatedDrop = () => {
    const newFile: ManuscriptFile = {
      name: `manuscript-${Date.now().toString().slice(-4)}.docx`,
      size: "2.8 MB",
      type: files.length === 0 ? "Blinded Copy" : "Supplementary Data",
      date: "Just now",
    };
    setFiles([...files, newFile]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-sm font-extrabold text-slate-900">
          Upload Manuscript Files
        </h3>
        <p className="text-xs text-slate-500">
          Please upload blinded manuscript file (PDF/DOCX) stripped of author names for double-blind review.
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleSimulatedDrop();
        }}
        onClick={handleSimulatedDrop}
        className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50/80 scale-[0.99]"
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
          Accepts PDF, DOCX, XLSX, ZIP (Max 50MB per file)
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
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700 border border-emerald-200">
                    <FileCheck2 className="h-3 w-3" />
                    Uploaded
                  </span>
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
