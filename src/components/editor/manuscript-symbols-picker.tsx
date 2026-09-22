"use client";

import React, { useState } from "react";
import { X, Search } from "lucide-react";

interface ManuscriptSymbolsPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSymbol: (symbol: string) => void;
}

const SYMBOL_CATEGORIES = [
  {
    name: "Greek Letters",
    symbols: [
      { char: "α", name: "alpha" },
      { char: "β", name: "beta" },
      { char: "γ", name: "gamma" },
      { char: "δ", name: "delta" },
      { char: "ε", name: "epsilon" },
      { char: "ζ", name: "zeta" },
      { char: "η", name: "eta" },
      { char: "θ", name: "theta" },
      { char: "ι", name: "iota" },
      { char: "κ", name: "kappa" },
      { char: "λ", name: "lambda" },
      { char: "μ", name: "mu" },
      { char: "ν", name: "nu" },
      { char: "ξ", name: "xi" },
      { char: "π", name: "pi" },
      { char: "ρ", name: "rho" },
      { char: "σ", name: "sigma" },
      { char: "τ", name: "tau" },
      { char: "υ", name: "upsilon" },
      { char: "φ", name: "phi" },
      { char: "χ", name: "chi" },
      { char: "ψ", name: "psi" },
      { char: "ω", name: "omega" },
      { char: "Γ", name: "Gamma" },
      { char: "Δ", name: "Delta" },
      { char: "Θ", name: "Theta" },
      { char: "Λ", name: "Lambda" },
      { char: "Ξ", name: "Xi" },
      { char: "Π", name: "Pi" },
      { char: "Σ", name: "Sigma" },
      { char: "Φ", name: "Phi" },
      { char: "Ψ", name: "Psi" },
      { char: "Ω", name: "Omega" },
    ],
  },
  {
    name: "Math & Relations",
    symbols: [
      { char: "±", name: "plus-minus" },
      { char: "×", name: "multiply" },
      { char: "÷", name: "divide" },
      { char: "≠", name: "not equal" },
      { char: "≈", name: "approx equal" },
      { char: "≤", name: "less or equal" },
      { char: "≥", name: "greater or equal" },
      { char: "≡", name: "identical to" },
      { char: "∝", name: "proportional to" },
      { char: "∞", name: "infinity" },
      { char: "√", name: "square root" },
      { char: "∑", name: "summation" },
      { char: "∏", name: "product" },
      { char: "∫", name: "integral" },
      { char: "∂", name: "partial derivative" },
      { char: "∇", name: "nabla" },
      { char: "∈", name: "element of" },
      { char: "∉", name: "not an element" },
      { char: "⊂", name: "subset of" },
      { char: "⊆", name: "subset or equal" },
      { char: "∪", name: "union" },
      { char: "∩", name: "intersection" },
      { char: "∅", name: "empty set" },
      { char: "∀", name: "for all" },
      { char: "∃", name: "there exists" },
    ],
  },
  {
    name: "Units & Typography",
    symbols: [
      { char: "°", name: "degree" },
      { char: "℃", name: "celsius" },
      { char: "℉", name: "fahrenheit" },
      { char: "Å", name: "angstrom" },
      { char: "‰", name: "per mille" },
      { char: "§", name: "section sign" },
      { char: "¶", name: "paragraph sign" },
      { char: "†", name: "dagger" },
      { char: "‡", name: "double dagger" },
      { char: "•", name: "bullet point" },
      { char: "—", name: "em dash" },
      { char: "–", name: "en dash" },
      { char: "©", name: "copyright" },
      { char: "®", name: "registered" },
      { char: "™", name: "trademark" },
    ],
  },
];

export function ManuscriptSymbolsPicker({
  isOpen,
  onClose,
  onInsertSymbol,
}: ManuscriptSymbolsPickerProps) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0b1b3d] text-white border border-slate-700 shadow-2xl rounded-xs w-full max-w-md p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150 select-none">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-white">Scientific & Math Symbols</h3>
            <p className="text-[11px] text-slate-400">Click any symbol to insert at current cursor position</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-xs"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search symbol (e.g. alpha, infinity, sum)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#060e22] border border-slate-700 rounded-xs pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Symbols Grid */}
        <div className="max-h-64 overflow-y-auto space-y-3 pr-1 text-xs">
          {SYMBOL_CATEGORIES.map((cat) => {
            const filtered = cat.symbols.filter(
              (s) =>
                !search ||
                s.name.toLowerCase().includes(search.toLowerCase()) ||
                s.char.includes(search)
            );

            if (filtered.length === 0) return null;

            return (
              <div key={cat.name} className="space-y-1.5">
                <span className="text-[10.5px] font-bold text-amber-400 uppercase tracking-wide">
                  {cat.name}
                </span>
                <div className="grid grid-cols-8 gap-1">
                  {filtered.map((s) => (
                    <button
                      key={s.char}
                      type="button"
                      onClick={() => {
                        onInsertSymbol(s.char);
                        onClose();
                      }}
                      title={`${s.name} (${s.char})`}
                      className="h-8 flex items-center justify-center bg-white/5 hover:bg-blue-600 rounded-xs text-sm font-serif text-white hover:scale-110 transition-transform cursor-pointer border border-white/5 hover:border-blue-400"
                    >
                      {s.char}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
