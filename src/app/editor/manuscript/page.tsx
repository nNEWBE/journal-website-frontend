"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Printer,
  Save,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import CharacterCount from "@tiptap/extension-character-count";
import mammoth from "mammoth";

import {
  type PaperFormat,
  type PaperOrientation,
  type MarginPreset,
  type ViewMode,
  type ManuscriptHeaderFooterConfig,
  PAPER_DIMENSIONS,
  MARGIN_PRESETS,
  DEFAULT_HEADER_FOOTER,
} from "@/lib/manuscript-paper-sizes";

import { ManuscriptEditorToolbar } from "@/components/editor/manuscript-editor-toolbar";
import { ManuscriptEditorCanvas } from "@/components/editor/manuscript-editor-canvas";
import { ResizableImage } from "@/components/editor/extensions/resizable-image";
import { ManuscriptPageBreak } from "@/components/editor/extensions/manuscript-page-break";
import { ManuscriptFontSize } from "@/components/editor/extensions/manuscript-font-size";
import { ManuscriptFindReplace } from "@/components/editor/manuscript-find-replace";
import {
  MANUSCRIPT_TEMPLATES,
  type ManuscriptTemplate,
} from "@/lib/manuscript-templates";
import {
  downloadAsDocx,
  printManuscriptDocument,
} from "@/lib/manuscript-export";
import { optimizeImageFile } from "@/lib/manuscript-image-optimizer";

const LOCAL_STORAGE_KEY = "gb_academic_manuscript_draft";
const SUBMISSION_ATTACH_KEY = "gb_draft_written_manuscript";

export default function ManuscriptEditorPage() {
  const router = useRouter();

  // Document meta state
  const [docTitle, setDocTitle] = useState<string>("Untitled Academic Manuscript");
  const [contentHtml, setContentHtml] = useState<string>("");
  const [, setSelectedTemplate] = useState<ManuscriptTemplate>(
    MANUSCRIPT_TEMPLATES[0]
  );
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showFindReplace, setShowFindReplace] = useState<boolean>(false);

  // Formatting & Page Layout
  const [currentFont, setCurrentFont] = useState<string>("'Times New Roman', Times, serif");
  const [currentSize, setCurrentSize] = useState<string>("12pt");
  const [currentSpacing, setCurrentSpacing] = useState<string>("2.0");
  const [layoutColumns, setLayoutColumns] = useState<"1" | "2">("1");
  const [paperFormat, setPaperFormat] = useState<PaperFormat>("a4");
  const [paperOrientation, setPaperOrientation] = useState<PaperOrientation>("portrait");
  const [pageMargins, setPageMargins] = useState<MarginPreset>("normal");
  const [viewMode, setViewMode] = useState<ViewMode>("pages");
  const [headerFooter, setHeaderFooter] = useState<ManuscriptHeaderFooterConfig>(DEFAULT_HEADER_FOOTER);
  const [activeHeaderFooterFocus, setActiveHeaderFooterFocus] = useState<"header" | "footer" | null>(null);

  // Save state
  const [saveStatus, setSaveStatus] = useState<string>("Saved");
  const [, setLastSavedTime] = useState<string>("");
  const updateDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<any>(null);

  // Initialize TipTap Editor with clean, official, high-performance extensions
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        dropcursor: { color: "#2563eb", width: 2.5 },
        link: { openOnClick: false },
      }),
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      ManuscriptFontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      ResizableImage,
      ManuscriptPageBreak,
      CharacterCount.configure(),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      handlePaste: (view, event) => {
        const imageFiles: File[] = [];
        if (event.clipboardData?.files?.length) {
          for (let i = 0; i < event.clipboardData.files.length; i++) {
            const f = event.clipboardData.files[i];
            if (f.type.startsWith("image/")) {
              imageFiles.push(f);
            }
          }
        }
        if (imageFiles.length === 0 && event.clipboardData?.items) {
          for (let i = 0; i < event.clipboardData.items.length; i++) {
            const item = event.clipboardData.items[i];
            if (item.type.startsWith("image/")) {
              const f = item.getAsFile();
              if (f) imageFiles.push(f);
            }
          }
        }

        if (imageFiles.length > 0) {
          event.preventDefault();
          const file = imageFiles[0];
          toast.info("Inserting pasted image...");
          optimizeImageFile(file).then((src) => {
            if (src) {
              const ed = editorRef.current || (view as any).editor;
              if (ed && !ed.isDestroyed) {
                ed.chain()
                  .focus()
                  .insertContent({
                    type: "resizableImage",
                    attrs: {
                      src,
                      alt: "Figure: Academic illustration",
                      caption: "Figure: Academic illustration",
                      width: 480,
                      wrap: "center",
                    },
                  })
                  .run();
                toast.success("Image inserted successfully");
              }
            }
          });
          return true;
        }
        return false;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            toast.info("Inserting dropped image...");
            optimizeImageFile(file).then((src) => {
              if (src) {
                const ed = editorRef.current || (view as any).editor;
                const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_\-]/g, " ");
                if (ed && !ed.isDestroyed) {
                  ed.chain()
                    .focus()
                    .insertContent({
                      type: "resizableImage",
                      attrs: {
                        src,
                        alt: `Figure: ${cleanName}`,
                        caption: `Figure: ${cleanName}`,
                        width: 480,
                        wrap: "center",
                      },
                    })
                    .run();
                  toast.success(`Image "${file.name}" inserted`);
                }
              }
            });
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      // Debounce serialization to avoid heavy React reconciliation while typing
      if (updateDebounceRef.current) clearTimeout(updateDebounceRef.current);
      updateDebounceRef.current = setTimeout(() => {
        setContentHtml(editor.getHTML());
      }, 500);
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    return () => {
      if (updateDebounceRef.current) clearTimeout(updateDebounceRef.current);
    };
  }, []);

  // Restore draft or load template on mount
  useEffect(() => {
    if (!editor) return;

    queueMicrotask(() => {
      if (editor.isDestroyed) return;

      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.contentHtml && parsed.contentHtml.length > 20) {
            editor.commands.setContent(parsed.contentHtml, { emitUpdate: true });
            setContentHtml(parsed.contentHtml);
            if (parsed.title) setDocTitle(parsed.title);
            if (parsed.font) setCurrentFont(parsed.font);
            if (parsed.size) setCurrentSize(parsed.size);
            if (parsed.spacing) setCurrentSpacing(parsed.spacing);
            if (parsed.layoutColumns) setLayoutColumns(parsed.layoutColumns);
            if (parsed.paperFormat) setPaperFormat(parsed.paperFormat);
            if (parsed.paperOrientation) setPaperOrientation(parsed.paperOrientation);
            if (parsed.pageMargins) setPageMargins(parsed.pageMargins);
            if (parsed.viewMode) setViewMode(parsed.viewMode);
            if (parsed.headerFooter) setHeaderFooter(parsed.headerFooter);
            setSaveStatus("Restored Draft");
            return;
          }
        }
      } catch (e) {
        console.error("Failed to restore draft:", e);
      }

      // Default template load
      editor.commands.setContent(MANUSCRIPT_TEMPLATES[0].initialHtml, { emitUpdate: true });
      setDocTitle(MANUSCRIPT_TEMPLATES[0].defaultTitle);
      setContentHtml(MANUSCRIPT_TEMPLATES[0].initialHtml);
      setSaveStatus("Template Loaded");
    });
  }, [editor]);

  // Periodic Autosave (Debounced 1.5s)
  useEffect(() => {
    if (!contentHtml || !editor) return;

    const timer = setTimeout(() => {
      try {
        setSaveStatus("Saving...");
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            title: docTitle,
            contentHtml,
            font: currentFont,
            size: currentSize,
            spacing: currentSpacing,
            layoutColumns,
            paperFormat,
            paperOrientation,
            pageMargins,
            viewMode,
            headerFooter,
            updatedAt: Date.now(),
          })
        );
        const timeStr = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        setSaveStatus(`Saved at ${timeStr}`);
        setLastSavedTime(timeStr);
      } catch (err) {
        console.error("Autosave failed:", err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    contentHtml,
    docTitle,
    currentFont,
    currentSize,
    currentSpacing,
    layoutColumns,
    paperFormat,
    paperOrientation,
    pageMargins,
    viewMode,
    headerFooter,
    editor,
  ]);

  // Manual Immediate Save (Ctrl+S)
  const saveDraftImmediately = useCallback(() => {
    const html = editorRef.current?.getHTML() || contentHtml;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          title: docTitle,
          contentHtml: html,
          font: currentFont,
          size: currentSize,
          spacing: currentSpacing,
          layoutColumns,
          paperFormat,
          paperOrientation,
          pageMargins,
          viewMode,
          headerFooter,
          updatedAt: Date.now(),
        })
      );
      const timeStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setSaveStatus(`Saved at ${timeStr}`);
      setLastSavedTime(timeStr);
      toast.success("Draft saved successfully.");
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save manuscript draft.");
    }
  }, [
    contentHtml,
    docTitle,
    currentFont,
    currentSize,
    currentSpacing,
    layoutColumns,
    paperFormat,
    paperOrientation,
    pageMargins,
    viewMode,
    headerFooter,
  ]);

  // Handle paper format change (A4, Letter, Legal, etc.)
  const handleSetPaperFormat = useCallback((format: PaperFormat) => {
    setPaperFormat(format);
    const dims = PAPER_DIMENSIONS[format].portrait;
    toast.info(`Format set to ${dims.name} (${dims.width} × ${dims.height} px)`);
  }, []);

  // Handle paper orientation change (Portrait, Landscape)
  const handleSetPaperOrientation = useCallback((orientation: PaperOrientation) => {
    setPaperOrientation(orientation);
    toast.info(
      `Orientation switched to ${orientation === "portrait" ? "Portrait" : "Landscape"}`
    );
  }, []);

  // Handle margin change (Normal, Narrow, Moderate)
  const handleSetPageMargins = useCallback((marginsKey: MarginPreset) => {
    setPageMargins(marginsKey);
    const margins = MARGIN_PRESETS[marginsKey];
    toast.info(`Margins adjusted to ${margins.label}`);
  }, []);

  // Handle view mode change (Print Layout Pages vs Continuous Document)
  const handleSetViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "pages") {
      toast.info("Switched to Print Layout (Virtual Paper Sheet)");
    } else {
      toast.info("Switched to Web Layout (Continuous Canvas)");
    }
  }, []);

  // Open & Import Word (.docx) file
  const handleOpenDocx = useCallback(async (file: File) => {
    try {
      toast.info(`Opening Word file "${file.name}"...`);
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      if (!html || html.trim().length === 0) {
        toast.error("Could not extract readable document from Word file.");
        return;
      }

      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[_\-]/g, " ");
      setDocTitle(cleanTitle);

      const ed = editorRef.current;
      if (ed) {
        ed.commands.setContent(html);
        setContentHtml(html);
      }
      toast.success(`Successfully imported "${file.name}"!`);
    } catch (err) {
      console.error("Failed to import .docx:", err);
      toast.error("Failed to read Word file. Please verify it is a valid .docx document.");
    }
  }, []);

  // Insert Image File
  const handleInsertImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files (.png, .jpg, .webp, .svg) can be inserted.");
      return;
    }
    try {
      toast.info(`Optimizing image "${file.name}"...`);
      const src = await optimizeImageFile(file);
      const ed = editorRef.current;
      if (src && ed) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_\-]/g, " ");
        ed.chain()
          .focus()
          .insertContent({
            type: "resizableImage",
            attrs: {
              src,
              alt: `Figure: ${cleanName}`,
              caption: `Figure: ${cleanName}`,
              width: 480,
              wrap: "center",
            },
          })
          .run();
        toast.success(`Image "${file.name}" inserted`);
      }
    } catch (err) {
      console.error("Failed to insert image:", err);
      toast.error("Failed to process image file.");
    }
  }, []);

  // Switch Academic Template
  const handleSelectTemplate = useCallback(
    (template: ManuscriptTemplate) => {
      if (
        contentHtml &&
        !window.confirm(
          `Load the "${template.name}" template? Any unsaved edits in your current document will be replaced.`
        )
      ) {
        return;
      }

      setSelectedTemplate(template);
      setDocTitle(template.defaultTitle);
      setContentHtml(template.initialHtml);
      const ed = editorRef.current;
      if (ed) {
        ed.commands.setContent(template.initialHtml, { emitUpdate: true });
      }
      setShowTemplateModal(false);
      toast.success(`Loaded ${template.name} template.`);
    },
    [contentHtml]
  );

  // Export as Word (.docx)
  const handleExportDocx = useCallback(() => {
    const currentHtml = editorRef.current?.getHTML() || contentHtml;
    downloadAsDocx(currentHtml, docTitle);
    toast.success("Manuscript exported as Word Document (.docx)");
  }, [contentHtml, docTitle]);

  // Attach to Submission & Return
  const handleAttachToSubmission = useCallback(() => {
    const currentHtml = editorRef.current?.getHTML() || contentHtml;
    if (!currentHtml || currentHtml.trim().length < 50) {
      toast.error(
        "Manuscript content is too brief to attach. Please write your paper sections first."
      );
      return;
    }

    const wordPayload = {
      title: docTitle,
      html: currentHtml,
      filename: `${docTitle.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "") || "manuscript"}.docx`,
      wordCount: editorRef.current?.storage?.characterCount?.words?.() || 0,
      updatedAt: Date.now(),
    };

    localStorage.setItem(SUBMISSION_ATTACH_KEY, JSON.stringify(wordPayload));
    toast.success("Manuscript prepared and attached to submission draft!");
    setTimeout(() => {
      router.push("/dashboard/submissions/new");
    }, 600);
  }, [contentHtml, docTitle, router]);

  const toggleFindReplace = useCallback(() => {
    setShowFindReplace((prev) => !prev);
  }, []);

  const closeFindReplace = useCallback(() => {
    setShowFindReplace(false);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (!ctrlOrCmd) return;

      const key = e.key.toLowerCase();

      // Ctrl+S: Save Draft
      if (key === "s") {
        e.preventDefault();
        saveDraftImmediately();
      }
      // Ctrl+P: Print / PDF
      else if (key === "p") {
        e.preventDefault();
        printManuscriptDocument();
      }
      // Ctrl+F / Ctrl+H: Find & Replace
      else if (key === "f" || key === "h") {
        e.preventDefault();
        setShowFindReplace((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleGlobalShortcuts);
    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  }, [saveDraftImmediately]);

  const handleExit = () => {
    if (
      window.confirm(
        "Exit manuscript editor? Your work is automatically saved in your browser draft."
      )
    ) {
      router.back();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0b1b3d] text-slate-800 overflow-hidden font-sans">
      {/* ── 1. Top Application Bar ── */}
      <header className="h-12 bg-[#060e22] border-b border-slate-800 text-white px-3 sm:px-5 flex items-center justify-between shrink-0 z-40 select-none">
        {/* Left: Back + Doc Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={handleExit}
            className="p-1.5 rounded-xs hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            title="Exit Editor"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Editable Document Title */}
          <div className="flex items-center gap-1.5 min-w-0">
            <FileText className="h-4 w-4 text-amber-400 shrink-0 hidden sm:block" />
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-white hover:bg-white/5 focus:bg-white/10 px-2 py-1 rounded-xs border border-transparent focus:border-white/20 focus:outline-none w-35 sm:w-60 md:w-[320px] truncate"
              title="Click to rename manuscript"
            />
            <span className="text-[10px] font-mono text-slate-400 shrink-0 hidden md:inline">
              .docx
            </span>
          </div>

          {/* Autosave / Manual Save Button */}
          <button
            type="button"
            onClick={saveDraftImmediately}
            title="Save draft now (Ctrl+S)"
            className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 px-2.5 py-1 rounded-xs transition-colors cursor-pointer border border-slate-700/60 ml-2"
          >
            <Save className="h-3 w-3 text-emerald-400" />
            <span>{saveStatus}</span>
          </button>
        </div>

        {/* Center / Right: Templates, Export, Attach to Submission */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Predefined Template Selector */}
          <button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-medium rounded-xs transition-colors cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-300" />
            <span>Academic Templates</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {/* Print / PDF */}
          <button
            type="button"
            onClick={printManuscriptDocument}
            title="Print or Save as PDF (Ctrl+P)"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xs bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/15 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Print / PDF</span>
          </button>

          {/* Export as Word (.docx) */}
          <button
            type="button"
            onClick={handleExportDocx}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-xs transition-colors cursor-pointer"
            title="Download Word Document (.docx)"
          >
            <Download className="h-3.5 w-3.5 text-sky-300" />
            <span className="hidden sm:inline">Export DOCX</span>
          </button>

          {/* Attach to Submission & Return */}
          <button
            type="button"
            onClick={handleAttachToSubmission}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#060e22] text-xs font-bold rounded-xs transition-colors shadow-sm cursor-pointer"
            title="Save and Attach this manuscript to your journal submission"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Attach to Submission</span>
          </button>
        </div>
      </header>

      {/* ── 2. Word-Processor Ribbon Formatting Toolbar ── */}
      <ManuscriptEditorToolbar
        editor={editor}
        onOpenDocx={handleOpenDocx}
        onInsertImageFile={handleInsertImageFile}
        onToggleFindReplace={toggleFindReplace}
        paperFormat={paperFormat}
        onSetPaperFormat={handleSetPaperFormat}
        paperOrientation={paperOrientation}
        onSetPaperOrientation={handleSetPaperOrientation}
        layoutColumns={layoutColumns}
        onSetLayoutColumns={setLayoutColumns}
        pageMargins={pageMargins}
        onSetPageMargins={handleSetPageMargins}
        viewMode={viewMode}
        onSetViewMode={handleSetViewMode}
        currentSpacing={currentSpacing}
        onSetLineSpacing={setCurrentSpacing}
        currentFont={currentFont}
        onSetFontFamily={setCurrentFont}
        currentSize={currentSize}
        onSetFontSize={setCurrentSize}
        headerFooter={headerFooter}
        onUpdateHeaderFooter={setHeaderFooter}
        onFocusHeaderFooter={setActiveHeaderFooterFocus}
      />

      {/* ── 3. Academic Paper Sheet Canvas (High-Performance Google Docs Virtual Paper) ── */}
      <ManuscriptEditorCanvas
        editor={editor}
        paperFormat={paperFormat}
        paperOrientation={paperOrientation}
        viewMode={viewMode}
        layoutColumns={layoutColumns}
        pageMargins={pageMargins}
        currentFont={currentFont}
        currentSize={currentSize}
        currentSpacing={currentSpacing}
        docTitle={docTitle}
        headerFooter={headerFooter}
        onUpdateHeaderFooter={setHeaderFooter}
        activeHeaderFooterFocus={activeHeaderFooterFocus}
        onClearHeaderFooterFocus={() => setActiveHeaderFooterFocus(null)}
        onDropImageFile={handleInsertImageFile}
        onDropDocxFile={handleOpenDocx}
      />

      {/* ── 4. MS Word-Style Find & Replace Floating Palette ── */}
      <ManuscriptFindReplace
        isOpen={showFindReplace}
        onClose={closeFindReplace}
        editor={editor}
      />

      {/* ── Template Switcher Modal ── */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xs border border-slate-300 shadow-2xl p-6 w-full max-w-lg space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#1e40af]" />
                  <span>Choose Academic Manuscript Template</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a predefined peer-reviewed journal structure to auto-populate your paper.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              {MANUSCRIPT_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className="p-3.5 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 rounded-xs cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                        {tmpl.name}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                        {tmpl.badge}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-slate-500 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>
                  <span className="text-xs text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0">
                    <span>Apply</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
