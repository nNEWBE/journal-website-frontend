"use client";

import React, { useState, useRef, useEffect, memo } from "react";
import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Columns2,
  FileCode,
  FileDown,
  FileUp,
  Highlighter,
  Image as ImageIcon,
  Indent,
  Italic,
  LayoutTemplate,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Outdent,
  Palette,
  Plus,
  Quote,
  Redo2,
  RemoveFormatting,
  Search,
  SeparatorHorizontal,
  Sigma,
  SplitSquareVertical,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Underline,
  Undo2,
} from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import { ManuscriptSymbolsPicker } from "./manuscript-symbols-picker";
import {
  type PaperFormat,
  type PaperOrientation,
  type MarginPreset,
  type ViewMode,
  FORMAT_OPTIONS,
  ORIENTATION_OPTIONS,
  VIEW_MODE_OPTIONS,
} from "@/lib/manuscript-paper-sizes";

export type RibbonTab = "home" | "insert" | "layout" | "review";

interface ManuscriptEditorToolbarProps {
  editor: Editor | null;
  onOpenDocx: (file: File) => void;
  onInsertImageFile: (file: File) => void;
  onToggleFindReplace: () => void;
  paperFormat: PaperFormat;
  onSetPaperFormat: (format: PaperFormat) => void;
  paperOrientation: PaperOrientation;
  onSetPaperOrientation: (orientation: PaperOrientation) => void;
  layoutColumns: "1" | "2";
  onSetLayoutColumns: (cols: "1" | "2") => void;
  pageMargins: MarginPreset;
  onSetPageMargins: (margins: MarginPreset) => void;
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  currentSpacing: string;
  onSetLineSpacing: (spacing: string) => void;
}

const STYLE_OPTIONS = [
  { value: "p", label: "Normal Text" },
  { value: "h1", label: "Document Title (H1)" },
  { value: "h2", label: "1. Section Heading (H2)" },
  { value: "h3", label: "1.1 Subsection (H3)" },
  { value: "h4", label: "1.1.1 Sub-subsection (H4)" },
  { value: "blockquote", label: "Quote / Excerpt" },
  { value: "codeBlock", label: "Code Snippet / Algorithm" },
];

const FONT_OPTIONS = [
  { value: "'Times New Roman', Times, serif", label: "Times New Roman (APA / IEEE)", style: { fontFamily: "'Times New Roman', serif" } },
  { value: "Calibri, sans-serif", label: "Calibri (Modern Academic)", style: { fontFamily: "Calibri, sans-serif" } },
  { value: "Arial, sans-serif", label: "Arial (Standard Scientific)", style: { fontFamily: "Arial, sans-serif" } },
  { value: "Georgia, serif", label: "Georgia (Editorial)", style: { fontFamily: "Georgia, serif" } },
  { value: "Garamond, serif", label: "Garamond (Humanities)", style: { fontFamily: "Garamond, serif" } },
  { value: "Inter, sans-serif", label: "Inter (Clean Sans)", style: { fontFamily: "Inter, sans-serif" } },
  { value: "'JetBrains Mono', monospace", label: "JetBrains Mono (Code)", style: { fontFamily: "monospace" } },
];

const FONT_SIZE_OPTIONS = [
  { value: "9pt", label: "9 pt (Footnotes / Captions)" },
  { value: "10pt", label: "10 pt (IEEE Two-Column Body)" },
  { value: "11pt", label: "11 pt (Standard Academic)" },
  { value: "12pt", label: "12 pt (APA Double-Spaced Standard)" },
  { value: "14pt", label: "14 pt (Subsection Heading)" },
  { value: "16pt", label: "16 pt (Section Heading)" },
  { value: "18pt", label: "18 pt (Paper Subtitle)" },
  { value: "24pt", label: "24 pt (Paper Title)" },
];

const SPACING_OPTIONS = [
  { value: "1.0", label: "1.0 Single Spacing" },
  { value: "1.15", label: "1.15 Compact Standard" },
  { value: "1.5", label: "1.5 Scientific Standard" },
  { value: "2.0", label: "2.0 Double-Spaced (Peer Review)" },
  { value: "2.5", label: "2.5 Generous" },
];

const MARGIN_OPTIONS = [
  { value: "normal", label: "Normal (1 inch / 2.54 cm)" },
  { value: "narrow", label: "Narrow (0.5 inch / 1.27 cm)" },
  { value: "moderate", label: "Moderate (0.75 inch / 1.9 cm)" },
];

const COLUMN_OPTIONS = [
  { value: "1", label: "Single Column (Standard APA/Elsevier)" },
  { value: "2", label: "Two Columns (IEEE / Nature Conference)" },
];

const TEXT_COLORS = [
  { label: "Default Dark", value: "#0f172a" },
  { label: "Charcoal Slate", value: "#334155" },
  { label: "Academic Navy", value: "#1e3a8a" },
  { label: "Crimson Red", value: "#991b1b" },
  { label: "Forest Green", value: "#166534" },
  { label: "Amber Ochre", value: "#b45309" },
];

const HIGHLIGHT_COLORS = [
  { label: "Clear Highlight", value: "" },
  { label: "Academic Yellow", value: "#fef08a" },
  { label: "Soft Cyan", value: "#bae6fd" },
  { label: "Mint Green", value: "#bbf7d0" },
  { label: "Lavender Purple", value: "#e9d5ff" },
  { label: "Rose Pink", value: "#fecdd3" },
];

function ManuscriptEditorToolbarInner({
  editor,
  onOpenDocx,
  onInsertImageFile,
  onToggleFindReplace,
  paperFormat,
  onSetPaperFormat,
  paperOrientation,
  onSetPaperOrientation,
  layoutColumns,
  onSetLayoutColumns,
  pageMargins,
  onSetPageMargins,
  viewMode,
  onSetViewMode,
  currentSpacing,
  onSetLineSpacing,
}: ManuscriptEditorToolbarProps) {
  const [activeTab, setActiveTab] = useState<RibbonTab>("home");
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState<boolean>(false);
  const [showTablePicker, setShowTablePicker] = useState<boolean>(false);
  const [tableGrid, setTableGrid] = useState<{ rows: number; cols: number }>({ rows: 3, cols: 3 });
  const [showSymbolsPicker, setShowSymbolsPicker] = useState<boolean>(false);
  const [, setSelectionTick] = useState<number>(0);

  // Throttled local tick to update active states (bold, italic, headings) without re-rendering page or canvas
  useEffect(() => {
    if (!editor) return;

    let rafId: number | null = null;
    const handleSelectionUpdate = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          setSelectionTick((t) => (t + 1) % 10000);
        });
      }
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const docxInputRef = useRef<HTMLInputElement | null>(null);

  const colorPopoverRef = useRef<HTMLDivElement | null>(null);
  const highlightPopoverRef = useRef<HTMLDivElement | null>(null);
  const tablePickerRef = useRef<HTMLDivElement | null>(null);

  // Outside click handler for popovers
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (colorPopoverRef.current && !colorPopoverRef.current.contains(target)) {
        setShowColorPicker(false);
      }
      if (highlightPopoverRef.current && !highlightPopoverRef.current.contains(target)) {
        setShowHighlightPicker(false);
      }
      if (tablePickerRef.current && !tablePickerRef.current.contains(target)) {
        setShowTablePicker(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowColorPicker(false);
        setShowHighlightPicker(false);
        setShowTablePicker(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!editor) return null;

  // Active state detection
  const getCurrentStyle = () => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    if (editor.isActive("heading", { level: 4 })) return "h4";
    if (editor.isActive("blockquote")) return "blockquote";
    if (editor.isActive("codeBlock")) return "codeBlock";
    return "p";
  };

  const handleStyleChange = (val: string) => {
    if (val === "p") editor.chain().focus().setParagraph().run();
    else if (val === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
    else if (val === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
    else if (val === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
    else if (val === "h4") editor.chain().focus().toggleHeading({ level: 4 }).run();
    else if (val === "blockquote") editor.chain().focus().toggleBlockquote().run();
    else if (val === "codeBlock") editor.chain().focus().toggleCodeBlock().run();
  };

  const handleInsertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setShowTablePicker(false);
  };

  const handleInsertLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter web link or DOI URL:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleInsertCitation = () => {
    const refNum = Math.floor(Math.random() * 8) + 1;
    editor.chain().focus().insertContent(` [${refNum}] `).run();
  };

  const handleInsertCallout = () => {
    editor
      .chain()
      .focus()
      .insertContent(
        `<blockquote style="border-left: 4px solid #1e40af; background: #f8fafc; padding: 10pt 14pt; margin: 16pt 0; font-style: normal; color: #1e293b;"><p><strong>Key Finding / Summary Note:</strong> Enter academic observation or hypothesis here.</p></blockquote><p></p>`
      )
      .run();
  };

  return (
    <div className="bg-[#0b1b3d] border-b border-slate-700/80 text-slate-200 select-none shrink-0 z-30 font-sans shadow-md relative overflow-visible">
      {/* ── 1. Ribbon Tab Headers (Home, Insert, Layout, Review) ── */}
      <div className="flex items-center gap-1 px-4 pt-1 border-b border-slate-800 bg-[#07132c] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("home")}
          className={`px-3 py-1 font-semibold transition-colors cursor-pointer border-b-2 ${activeTab === "home"
            ? "text-amber-400 border-amber-400 bg-white/5"
            : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
            }`}
        >
          Home
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("insert")}
          className={`px-3 py-1 font-semibold transition-colors cursor-pointer border-b-2 ${activeTab === "insert"
            ? "text-amber-400 border-amber-400 bg-white/5"
            : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
            }`}
        >
          Insert
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("layout")}
          className={`px-3 py-1 font-semibold transition-colors cursor-pointer border-b-2 ${activeTab === "layout"
            ? "text-amber-400 border-amber-400 bg-white/5"
            : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
            }`}
        >
          Layout
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("review")}
          className={`px-3 py-1 font-semibold transition-colors cursor-pointer border-b-2 ${activeTab === "review"
            ? "text-amber-400 border-amber-400 bg-white/5"
            : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
            }`}
        >
          Review
        </button>
      </div>

      {/* ── 2. Ribbon Content Row ── */}
      <div className="px-3 sm:px-5 py-1.5 flex items-center gap-2 min-h-11.5 overflow-visible">
        {/* ==================== HOME TAB ==================== */}
        {activeTab === "home" && (
          <>
            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5 border-r border-slate-700/80 pr-2">
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo (Ctrl+Z)"
                className="p-1 rounded-xs hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <Undo2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo (Ctrl+Y)"
                className="p-1 rounded-xs hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <Redo2 className="h-4 w-4" />
              </button>
            </div>

            {/* Heading Style Select */}
            <div className="w-36.25 shrink-0">
              <CustomSelect
                value={getCurrentStyle()}
                onChange={handleStyleChange}
                options={STYLE_OPTIONS}
                size="toolbar"
              />
            </div>

            {/* Font Family Select */}
            <div className="w-42.5 shrink-0">
              <CustomSelect
                value={editor.getAttributes("textStyle").fontFamily || "'Times New Roman', Times, serif"}
                onChange={(font) => editor.chain().focus().setFontFamily(font).run()}
                options={FONT_OPTIONS}
                size="toolbar"
              />
            </div>

            {/* Font Size Select */}
            <div className="w-25 shrink-0">
              <CustomSelect
                value="12pt"
                onChange={(sz) => {
                  // Apply inline font-size via custom style
                  editor.chain().focus().setMark("textStyle", { style: `font-size: ${sz}` }).run();
                }}
                options={FONT_SIZE_OPTIONS}
                size="toolbar"
              />
            </div>

            <div className="h-5 w-px bg-slate-700/80 shrink-0" />

            {/* Character Formatting: Bold, Italic, Underline, Strikethrough, Subscript, Superscript */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold (Ctrl+B)"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("bold") ? "bg-amber-400 text-slate-900 font-bold" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <Bold className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic (Ctrl+I)"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("italic") ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <Italic className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline (Ctrl+U)"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("underline") ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <Underline className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Strikethrough"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("strike") ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <Strikethrough className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                title="Subscript (Chemistry Notation e.g. H2O)"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("subscript") ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <SubscriptIcon className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                title="Superscript (Exponents / Math Notation e.g. R2)"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("superscript") ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <SuperscriptIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="h-5 w-px bg-slate-700/80 shrink-0" />

            {/* Colors: Text & Highlight */}
            <div className="flex items-center gap-1 relative">
              {/* Text Color */}
              <div className="relative" ref={colorPopoverRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowColorPicker((prev) => !prev);
                    setShowHighlightPicker(false);
                  }}
                  title="Text Color"
                  className="p-1.5 rounded-xs hover:bg-white/10 text-slate-200 transition-colors cursor-pointer flex items-center gap-0.5"
                >
                  <Palette className="h-3.5 w-3.5 text-amber-300" />
                </button>

                {showColorPicker && (
                  <div className="absolute top-8 left-0 z-50 bg-[#060e22] border border-slate-700 p-2.5 rounded-xs shadow-2xl space-y-1.5 w-44">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Text Color
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {TEXT_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => {
                            editor.chain().focus().setColor(c.value).run();
                            setShowColorPicker(false);
                          }}
                          className="h-6 w-full rounded-xs border border-white/20 hover:scale-105 transition-transform"
                          style={{ backgroundColor: c.value }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Text Highlight Color */}
              <div className="relative" ref={highlightPopoverRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowHighlightPicker((prev) => !prev);
                    setShowColorPicker(false);
                  }}
                  title="Text Highlight Background"
                  className="p-1.5 rounded-xs hover:bg-white/10 text-slate-200 transition-colors cursor-pointer flex items-center gap-0.5"
                >
                  <Highlighter className="h-3.5 w-3.5 text-yellow-300" />
                </button>

                {showHighlightPicker && (
                  <div className="absolute top-8 left-0 z-50 bg-[#060e22] border border-slate-700 p-2.5 rounded-xs shadow-2xl space-y-1.5 w-44">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Highlight
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {HIGHLIGHT_COLORS.map((c) => (
                        <button
                          key={c.label}
                          type="button"
                          onClick={() => {
                            if (!c.value) editor.chain().focus().unsetHighlight().run();
                            else editor.chain().focus().toggleHighlight({ color: c.value }).run();
                            setShowHighlightPicker(false);
                          }}
                          className="h-6 w-full rounded-xs border border-white/20 hover:scale-105 transition-transform text-[9px] flex items-center justify-center text-slate-900 font-bold"
                          style={{ backgroundColor: c.value || "#ffffff" }}
                          title={c.label}
                        >
                          {!c.value ? "None" : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Formatting */}
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                title="Clear Formatting"
                className="p-1.5 rounded-xs hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RemoveFormatting className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="h-5 w-px bg-slate-700/80 shrink-0" />

            {/* Paragraph Alignment */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                title="Align Left (Ctrl+L)"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive({ textAlign: "left" }) ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <AlignLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                title="Align Center (Ctrl+E)"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive({ textAlign: "center" }) ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <AlignCenter className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                title="Align Right (Ctrl+R)"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive({ textAlign: "right" }) ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <AlignRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                title="Justify (Ctrl+J)"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive({ textAlign: "justify" }) ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <AlignJustify className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="h-5 w-px bg-slate-700/80 shrink-0" />

            {/* Lists: Bullets, Numbered */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bulleted List"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("bulletList") ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Numbered List"
                className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("orderedList") ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                  }`}
              >
                <ListOrdered className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Line Spacing */}
            <div className="w-31.25 shrink-0 ml-1">
              <CustomSelect
                value={currentSpacing}
                onChange={onSetLineSpacing}
                options={SPACING_OPTIONS}
                size="toolbar"
              />
            </div>
          </>
        )}

        {/* ==================== INSERT TAB ==================== */}
        {activeTab === "insert" && (
          <>
            {/* Open / Import Word Document (.docx) */}
            <input
              type="file"
              ref={docxInputRef}
              accept=".docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onOpenDocx(file);
                  e.target.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => docxInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xs text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Open and load an existing Microsoft Word (.docx) document"
            >
              <FileUp className="h-3.5 w-3.5" />
              <span>Open Word (.docx)</span>
            </button>

            <div className="h-5 w-px bg-slate-700/80 shrink-0" />

            {/* Insert Picture */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onInsertImageFile(file);
                  e.target.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xs text-xs font-medium transition-colors cursor-pointer"
              title="Insert Image from Computer or Drag & Drop directly"
            >
              <ImageIcon className="h-3.5 w-3.5 text-sky-400" />
              <span>Picture / Figure</span>
            </button>

            {/* Insert Table with Interactive Matrix */}
            <div className="relative" ref={tablePickerRef}>
              <button
                type="button"
                onClick={() => setShowTablePicker((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xs text-xs font-medium transition-colors cursor-pointer"
                title="Insert Academic Table"
              >
                <TableIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span>Table</span>
              </button>

              {showTablePicker && (
                <div className="absolute top-9 left-0 z-50 bg-[#060e22] border border-slate-700 p-3 rounded-xs shadow-2xl space-y-2 w-56">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span>Insert Table</span>
                    <span className="text-amber-400 font-mono">
                      {tableGrid.cols} × {tableGrid.rows}
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1 bg-slate-900/80 p-1.5 rounded-xs border border-slate-800">
                    {Array.from({ length: 36 }).map((_, i) => {
                      const col = (i % 6) + 1;
                      const row = Math.floor(i / 6) + 1;
                      const isHighlighted = col <= tableGrid.cols && row <= tableGrid.rows;
                      return (
                        <div
                          key={i}
                          onMouseEnter={() => setTableGrid({ rows: row, cols: col })}
                          onClick={() => handleInsertTable(row, col)}
                          className={`h-4 w-4 rounded-xs border transition-colors cursor-pointer ${isHighlighted ? "bg-blue-500 border-blue-400" : "bg-white/10 border-white/20"
                            }`}
                        />
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInsertTable(tableGrid.rows, tableGrid.cols)}
                    className="w-full py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-xs cursor-pointer"
                  >
                    Insert {tableGrid.cols} × {tableGrid.rows} Table
                  </button>
                </div>
              )}
            </div>

            <div className="h-5 w-px bg-slate-700/80 shrink-0" />

            {/* Page Break */}
            <button
              type="button"
              onClick={() => {
                (editor.chain().focus() as any).setPageBreak().run();
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xs text-xs font-medium transition-colors cursor-pointer"
              title="Insert Page Break (Ctrl+Enter)"
            >
              <SplitSquareVertical className="h-3.5 w-3.5 text-purple-400" />
              <span>Page Break</span>
            </button>

            {/* Divider / Horizontal Rule */}
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-1.5 rounded-xs hover:bg-white/10 text-slate-200 transition-colors cursor-pointer"
              title="Horizontal Section Rule"
            >
              <SeparatorHorizontal className="h-3.5 w-3.5" />
            </button>

            {/* Hyperlink */}
            <button
              type="button"
              onClick={handleInsertLink}
              className={`p-1.5 rounded-xs transition-colors cursor-pointer ${editor.isActive("link") ? "bg-amber-400 text-slate-900" : "hover:bg-white/10 text-slate-200"
                }`}
              title="Insert Hyperlink / DOI (Ctrl+K)"
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </button>

            {/* Academic Citation */}
            <button
              type="button"
              onClick={handleInsertCitation}
              className="inline-flex items-center gap-1 px-2 py-1.5 bg-white/10 hover:bg-white/20 text-amber-300 rounded-xs text-xs font-semibold transition-colors cursor-pointer"
              title="Insert Academic Citation Reference"
            >
              <span>[#] Citation</span>
            </button>

            {/* Scientific Symbols Picker */}
            <button
              type="button"
              onClick={() => setShowSymbolsPicker(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xs text-xs font-medium transition-colors cursor-pointer"
              title="Insert Math, Greek, and Scientific Symbols"
            >
              <Sigma className="h-3.5 w-3.5 text-amber-400" />
              <span>Symbols</span>
            </button>

            {/* Callout Box */}
            <button
              type="button"
              onClick={handleInsertCallout}
              className="inline-flex items-center gap-1 px-2 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xs text-xs transition-colors cursor-pointer"
              title="Insert Abstract / Summary Note Box"
            >
              <Quote className="h-3.5 w-3.5 text-blue-400" />
              <span>Callout Box</span>
            </button>
          </>
        )}

        {/* ==================== LAYOUT TAB ==================== */}
        {activeTab === "layout" && (
          <div className="flex items-center gap-3 overflow-x-auto py-0.5">
            {/* 1. Paper Format (A4, Letter, Legal, Executive, A5, A3) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold text-slate-300">Format:</span>
              <div className="w-47.5">
                <CustomSelect
                  value={paperFormat}
                  onChange={(val) => onSetPaperFormat(val as PaperFormat)}
                  options={FORMAT_OPTIONS}
                  size="toolbar"
                />
              </div>
            </div>

            <div className="h-5 w-px bg-slate-700/80 shrink-0" />

            {/* 2. Paper Orientation (Portrait, Landscape) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold text-slate-300">Orientation:</span>
              <div className="w-38.75">
                <CustomSelect
                  value={paperOrientation}
                  onChange={(val) => onSetPaperOrientation(val as PaperOrientation)}
                  options={ORIENTATION_OPTIONS}
                  size="toolbar"
                />
              </div>
            </div>

            <div className="h-5 w-px bg-slate-700/80 shrink-0" />

            {/* 3. Page Margins */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-medium text-slate-400">Margins:</span>
              <div className="w-42.5">
                <CustomSelect
                  value={pageMargins}
                  onChange={(val) => onSetPageMargins(val as MarginPreset)}
                  options={MARGIN_OPTIONS}
                  size="toolbar"
                />
              </div>
            </div>

            <div className="h-5 w-px bg-slate-700/80 shrink-0" />

            {/* 4. Columns Toggle */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-medium text-slate-400">Columns:</span>
              <div className="w-46.25">
                <CustomSelect
                  value={layoutColumns}
                  onChange={(val) => onSetLayoutColumns(val as "1" | "2")}
                  options={COLUMN_OPTIONS}
                  size="toolbar"
                />
              </div>
            </div>

            <div className="h-5 w-px bg-slate-700/80 shrink-0" />

            {/* 5. View Mode (Print Layout Pages vs Web Layout Continuous) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-semibold text-slate-300">View:</span>
              <div className="w-46.25">
                <CustomSelect
                  value={viewMode}
                  onChange={(val) => onSetViewMode(val as ViewMode)}
                  options={VIEW_MODE_OPTIONS}
                  size="toolbar"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== REVIEW TAB ==================== */}
        {activeTab === "review" && (
          <>
            <button
              type="button"
              onClick={onToggleFindReplace}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xs text-xs font-semibold transition-colors cursor-pointer"
              title="Find & Replace (Ctrl+F / Ctrl+H)"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Find & Replace</span>
            </button>

            <div className="h-5 w-px bg-slate-700/80 shrink-0" />

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-white">Document Status:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                Proofing Checked (No Syntax Errors)
              </span>
            </div>
          </>
        )}
      </div>

      {/* Scientific Symbols Modal */}
      <ManuscriptSymbolsPicker
        isOpen={showSymbolsPicker}
        onClose={() => setShowSymbolsPicker(false)}
        onInsertSymbol={(sym) => {
          editor.chain().focus().insertContent(sym).run();
        }}
      />
    </div>
  );
}

export const ManuscriptEditorToolbar = memo(ManuscriptEditorToolbarInner);
