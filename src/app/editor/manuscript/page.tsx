"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Printer,
  RotateCcw,
  Save,
  Send,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Dropcursor from "@tiptap/extension-dropcursor";
import mammoth from "mammoth";
import { PaginationPlus } from "tiptap-pagination-plus";

import {
  type PaperFormat,
  type PaperOrientation,
  type MarginPreset,
  type ViewMode,
  PAPER_DIMENSIONS,
  MARGIN_PRESETS,
} from "@/lib/manuscript-paper-sizes";

import { ManuscriptEditorToolbar } from "@/components/editor/manuscript-editor-toolbar";
import { ManuscriptEditorCanvas } from "@/components/editor/manuscript-editor-canvas";
import { ResizableImage } from "@/components/editor/extensions/resizable-image";
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
  const [selectedTemplate, setSelectedTemplate] = useState<ManuscriptTemplate>(
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

  // Save state
  const [saveStatus, setSaveStatus] = useState<string>("Saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const updateDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize TipTap Editor with full extensions suite + PaginationPlus
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Dropcursor.configure({ color: "#2563eb", width: 2.5 }),
      ResizableImage,
      PaginationPlus.configure({
        enabled: true,
        pageWidth: 794,
        pageHeight: 1123,
        pageGap: 28,
        pageGapBorderSize: 1,
        pageGapBorderColor: "#cbd5e1",
        pageBreakBackground: "#eef1f6",
        marginTop: 72,
        marginBottom: 72,
        marginLeft: 72,
        marginRight: 72,
        contentMarginTop: 12,
        contentMarginBottom: 12,
        headerLeft: `<span style="font-size: 8.5pt; color: #64748b; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Academic Manuscript</span>`,
        headerRight: `<span style="font-size: 8pt; color: #94a3b8; font-family: monospace; font-weight: bold;">PEER-REVIEW DRAFT</span>`,
        footerLeft: `<span style="font-size: 8pt; color: #94a3b8; font-family: sans-serif;">Peer-Reviewed Journal Document</span>`,
        footerRight: `<span style="font-size: 8.5pt; color: #334155; font-weight: 700; font-family: monospace;">Page {page}</span>`,
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.startsWith("image/")) {
              const file = item.getAsFile();
              if (file) {
                event.preventDefault();
                toast.info("Optimizing pasted image...");
                optimizeImageFile(file).then((optimizedSrc) => {
                  const node = view.state.schema.nodes.resizableImage?.create({
                    src: optimizedSrc,
                    alt: "Figure: Academic illustration",
                    caption: "Figure: Academic illustration",
                    width: 480,
                    wrap: "center",
                  });
                  if (node) {
                    const tr = view.state.tr.replaceSelectionWith(node);
                    view.dispatch(tr);
                    toast.success("Image optimized & inserted");
                  }
                });
                return true;
              }
            }
          }
        }
        return false;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            toast.info("Optimizing dropped image...");
            optimizeImageFile(file).then((optimizedSrc) => {
              const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_\-]/g, " ");
              const node = view.state.schema.nodes.resizableImage?.create({
                src: optimizedSrc,
                alt: `Figure: ${cleanName}`,
                caption: `Figure: ${cleanName}`,
                width: 480,
                wrap: "center",
              });
              if (node) {
                const tr = view.state.tr.replaceSelectionWith(node);
                view.dispatch(tr);
                toast.success(`Image "${file.name}" inserted`);
              }
            });
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      // Debounce the state update to avoid heavy serializations and React waterfall on every keystroke
      if (updateDebounceRef.current) clearTimeout(updateDebounceRef.current);
      updateDebounceRef.current = setTimeout(() => {
        setContentHtml(editor.getHTML());
      }, 400);
    },
  });

  useEffect(() => {
    return () => {
      if (updateDebounceRef.current) clearTimeout(updateDebounceRef.current);
    };
  }, []);

  // Load draft or initial template on editor mount (deferred to microtask to prevent React 19 flushSync warning)
  useEffect(() => {
    if (!editor) return;

    queueMicrotask(() => {
      if (editor.isDestroyed) return;

      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.contentHtml && parsed.contentHtml.length > 20) {
            editor.commands.setContent(parsed.contentHtml);
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
            setSaveStatus("Restored Draft");
            return;
          }
        }
      } catch (e) {
        console.error("Failed to restore draft:", e);
      }

      // Default template load
      editor.commands.setContent(MANUSCRIPT_TEMPLATES[0].initialHtml);
      setDocTitle(MANUSCRIPT_TEMPLATES[0].defaultTitle);
      setContentHtml(MANUSCRIPT_TEMPLATES[0].initialHtml);
      setSaveStatus("Template Loaded");
    });
  }, [editor]);

  // Periodic Autosave
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
    }, 1200);

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
    editor,
  ]);

  // Manual Immediate Save (Ctrl+S)
  const saveDraftImmediately = () => {
    const html = editor?.getHTML() || contentHtml;
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
  };

  // Handle paper format change (A4, Letter, Legal, Executive, A5, A3)
  const handleSetPaperFormat = (format: PaperFormat) => {
    setPaperFormat(format);
    const dims = PAPER_DIMENSIONS[format][paperOrientation];
    const margins = MARGIN_PRESETS[pageMargins];
    if (editor) {
      editor
        .chain()
        .focus()
        .updatePageWidth(dims.width)
        .updatePageHeight(dims.height)
        .updateMargins({
          top: margins.top,
          bottom: margins.bottom,
          left: margins.left,
          right: margins.right,
        })
        .run();
    }
    toast.info(`Format set to ${dims.name} (${dims.width} × ${dims.height} px)`);
  };

  // Handle paper orientation change (Portrait, Landscape)
  const handleSetPaperOrientation = (orientation: PaperOrientation) => {
    setPaperOrientation(orientation);
    const dims = PAPER_DIMENSIONS[paperFormat][orientation];
    const margins = MARGIN_PRESETS[pageMargins];
    if (editor) {
      editor
        .chain()
        .focus()
        .updatePageWidth(dims.width)
        .updatePageHeight(dims.height)
        .updateMargins({
          top: margins.top,
          bottom: margins.bottom,
          left: margins.left,
          right: margins.right,
        })
        .run();
    }
    toast.info(
      `Orientation switched to ${orientation === "portrait" ? "Portrait" : "Landscape"}`
    );
  };

  // Handle margin change (Normal, Narrow, Moderate)
  const handleSetPageMargins = (marginsKey: MarginPreset) => {
    setPageMargins(marginsKey);
    const margins = MARGIN_PRESETS[marginsKey];
    if (editor) {
      editor
        .chain()
        .focus()
        .updateMargins({
          top: margins.top,
          bottom: margins.bottom,
          left: margins.left,
          right: margins.right,
        })
        .run();
    }
    toast.info(`Margins adjusted to ${margins.label}`);
  };

  // Handle view mode change (Print Layout Pages vs Web Layout Continuous)
  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (editor) {
      if (mode === "pages") {
        editor.chain().focus().enablePagination().run();
        toast.info("Switched to Print Layout (Multi-Page Sheets)");
      } else {
        editor.chain().focus().disablePagination().run();
        toast.info("Switched to Web Layout (Continuous Document)");
      }
    }
  };

  // Sync document title into page headers
  useEffect(() => {
    if (editor) {
      queueMicrotask(() => {
        if (!editor.isDestroyed) {
          editor.commands.updateHeaderContent(
            `<span style="font-size: 8.5pt; color: #64748b; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">${docTitle || "Academic Manuscript"}</span>`,
            `<span style="font-size: 8pt; color: #94a3b8; font-family: monospace; font-weight: bold;">PEER-REVIEW DRAFT</span>`
          );
        }
      });
    }
  }, [docTitle, editor]);

  // Open & Import Word (.docx) file
  const handleOpenDocx = async (file: File) => {
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

      if (editor) {
        editor.commands.setContent(html);
        setContentHtml(html);
      }
      toast.success(`Successfully imported "${file.name}"!`);
    } catch (err) {
      console.error("Failed to import .docx:", err);
      toast.error("Failed to read Word file. Please verify it is a valid .docx document.");
    }
  };

  // Insert Image File
  const handleInsertImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files (.png, .jpg, .webp, .svg) can be inserted.");
      return;
    }
    try {
      toast.info(`Optimizing image "${file.name}"...`);
      const src = await optimizeImageFile(file);
      if (src && editor) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_\-]/g, " ");
        editor
          .chain()
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
  };

  // Switch Academic Template
  const handleSelectTemplate = (template: ManuscriptTemplate) => {
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
    if (editor) {
      editor.commands.setContent(template.initialHtml);
    }
    setShowTemplateModal(false);
    toast.success(`Loaded ${template.name} template.`);
  };

  // Start with Blank Page
  const handleBlankDocument = () => {
    if (
      window.confirm(
        "Clear document and start with a blank paper? Your current draft will be cleared."
      )
    ) {
      const blank = `<h1>Title of Academic Paper</h1><p>Begin typing your manuscript here...</p>`;
      setContentHtml(blank);
      setDocTitle("Untitled Manuscript");
      if (editor) {
        editor.commands.setContent(blank);
      }
      setShowTemplateModal(false);
      toast.info("Created new blank manuscript.");
    }
  };

  // Export as Word (.docx)
  const handleExportDocx = () => {
    const currentHtml = editor?.getHTML() || contentHtml;
    downloadAsDocx(currentHtml, docTitle);
    toast.success("Manuscript exported as Word Document (.docx)");
  };

  // Attach to Submission & Return
  const handleAttachToSubmission = () => {
    const currentHtml = editor?.getHTML() || contentHtml;
    if (!currentHtml || currentHtml.trim().length < 50) {
      toast.error("Manuscript content is too brief to attach. Please write your paper sections first.");
      return;
    }

    const wordPayload = {
      title: docTitle,
      html: currentHtml,
      filename: `${docTitle.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "") || "manuscript"}.docx`,
      wordCount: editor?.getText().trim().split(/\s+/).filter(Boolean).length || 0,
      updatedAt: Date.now(),
    };

    localStorage.setItem(SUBMISSION_ATTACH_KEY, JSON.stringify(wordPayload));
    toast.success("Manuscript prepared and attached to submission draft!");
    setTimeout(() => {
      router.push("/dashboard/submissions/new");
    }, 600);
  };

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
  }, [docTitle, contentHtml, currentFont, currentSize, currentSpacing, layoutColumns, pageMargins, editor]);

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
        onToggleFindReplace={() => setShowFindReplace((prev) => !prev)}
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
      />

      {/* ── 3. Academic Paper Sheet Canvas (Multi-Page A4 / Letter / Legal) ── */}
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
        onDropImageFile={handleInsertImageFile}
        onDropDocxFile={handleOpenDocx}
      />

      {/* ── 4. MS Word-Style Find & Replace Floating Palette ── */}
      <ManuscriptFindReplace
        isOpen={showFindReplace}
        onClose={() => setShowFindReplace(false)}
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

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleBlankDocument}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Start with Blank Page</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor-specific Toast placement so top-right action buttons are never obscured */}
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
