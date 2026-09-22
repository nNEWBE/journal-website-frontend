"use client";

import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";
import {
  ChevronDown,
  ChevronUp,
  Replace,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface ManuscriptFindReplaceProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

export function ManuscriptFindReplace({
  isOpen,
  onClose,
  editor,
}: ManuscriptFindReplaceProps) {
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [matchIndex, setMatchIndex] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const findInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        findInputRef.current?.focus();
        findInputRef.current?.select();
      }, 50);
    }
  }, [isOpen]);

  // Recount matches in editor whenever findText changes
  useEffect(() => {
    if (!editor || !findText.trim()) {
      setMatchCount(0);
      setMatchIndex(0);
      return;
    }

    const text = editor.getText() || "";
    const flags = matchCase ? "g" : "gi";
    try {
      const regex = new RegExp(escapeRegex(findText), flags);
      const matches = text.match(regex);
      const count = matches ? matches.length : 0;
      setMatchCount(count);
      setMatchIndex(count > 0 ? 1 : 0);
    } catch {
      setMatchCount(0);
      setMatchIndex(0);
    }
  }, [findText, matchCase, editor?.state.doc]);

  const escapeRegex = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // Find next occurrence using window.find
  const handleFindNext = (backwards: boolean = false) => {
    if (!findText) return;
    const win = typeof window !== "undefined" ? (window as unknown as { find?: (text: string, caseSensitive: boolean, backwards: boolean, wrapAround: boolean, wholeWord: boolean, searchInFrames: boolean, showDialog: boolean) => boolean }) : null;
    if (win && win.find) {
      const found = win.find(findText, matchCase, backwards, true, false, false, false);
      if (found) {
        if (backwards) {
          setMatchIndex((prev) => (prev > 1 ? prev - 1 : matchCount));
        } else {
          setMatchIndex((prev) => (prev < matchCount ? prev + 1 : 1));
        }
      }
    }
  };

  // Replace one instance
  const handleReplaceOne = () => {
    if (!editor || !findText) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      handleFindNext(false);
      return;
    }

    const selectedText = sel.toString();
    const isMatch = matchCase
      ? selectedText === findText
      : selectedText.toLowerCase() === findText.toLowerCase();

    if (isMatch) {
      editor.chain().focus().insertContent(replaceText).run();
      handleFindNext(false);
    } else {
      handleFindNext(false);
    }
  };

  // Replace all instances in entire document
  const handleReplaceAll = () => {
    if (!editor || !findText) return;

    const currentHtml = editor.getHTML();
    const flags = matchCase ? "g" : "gi";
    try {
      const regex = new RegExp(escapeRegex(findText), flags);
      const countMatches = (currentHtml.match(regex) || []).length;
      const newHtml = currentHtml.replace(regex, replaceText);
      editor.commands.setContent(newHtml);
      toast.success(`Replaced ${countMatches} matches for "${findText}".`);
      setFindText("");
      setMatchCount(0);
      setMatchIndex(0);
    } catch (e) {
      toast.error("Replace all failed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-24 right-6 z-50 bg-[#060e22]/95 text-white p-3 rounded-xs shadow-2xl border border-slate-700 w-80 space-y-2.5 backdrop-blur-md animate-in slide-in-from-top-4 duration-150 select-none">
      <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
          <Search className="h-3.5 w-3.5" />
          <span>Find & Replace</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-xs"
          title="Close (Esc)"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Find input */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xs px-2 py-1 focus-within:border-blue-500">
          <input
            ref={findInputRef}
            type="text"
            placeholder="Find in manuscript..."
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.shiftKey) handleFindNext(true);
                else handleFindNext(false);
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          {findText && (
            <span className="text-[10px] font-mono text-slate-400 shrink-0">
              {matchCount > 0 ? `${matchIndex} of ${matchCount}` : "0 matches"}
            </span>
          )}
          <button
            type="button"
            onClick={() => handleFindNext(true)}
            title="Previous Match (Shift+Enter)"
            className="p-0.5 text-slate-400 hover:text-white rounded-xs cursor-pointer"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleFindNext(false)}
            title="Next Match (Enter)"
            className="p-0.5 text-slate-400 hover:text-white rounded-xs cursor-pointer"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Replace input */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xs px-2 py-1 focus-within:border-blue-500">
          <input
            type="text"
            placeholder="Replace with..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleReplaceOne();
              else if (e.key === "Escape") onClose();
            }}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Action buttons & options */}
      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={matchCase}
            onChange={(e) => setMatchCase(e.target.checked)}
            className="rounded-xs border-slate-600 text-blue-600 focus:ring-0"
          />
          <span>Match Case</span>
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleReplaceOne}
            disabled={!findText || matchCount === 0}
            className="px-2 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-slate-200 text-[11px] font-medium rounded-xs cursor-pointer"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={handleReplaceAll}
            disabled={!findText || matchCount === 0}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-[11px] font-bold rounded-xs cursor-pointer flex items-center gap-1"
          >
            <Replace className="h-3 w-3" />
            <span>All</span>
          </button>
        </div>
      </div>
    </div>
  );
}
