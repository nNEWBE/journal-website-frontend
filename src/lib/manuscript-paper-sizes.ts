export type PaperFormat = "a4" | "letter" | "legal" | "executive" | "a5" | "a3";
export type PaperOrientation = "portrait" | "landscape";
export type MarginPreset = "normal" | "narrow" | "moderate" | "wide";
export type ViewMode = "pages" | "continuous";

export interface PaperDimension {
  id: PaperFormat;
  name: string;
  width: number; // in pixels at 96 DPI (1 in = 96 px)
  height: number;
  widthInches: number;
  heightInches: number;
  widthMm: number;
  heightMm: number;
  description: string;
  descriptionShort: string;
}

export const PAPER_DIMENSIONS: Record<
  PaperFormat,
  { portrait: PaperDimension; landscape: PaperDimension }
> = {
  a4: {
    portrait: {
      id: "a4",
      name: "A4",
      width: 794,
      height: 1123,
      widthInches: 8.27,
      heightInches: 11.69,
      widthMm: 210,
      heightMm: 297,
      description: "210 × 297 mm (ISO Academic Standard)",
      descriptionShort: "210 × 297 mm",
    },
    landscape: {
      id: "a4",
      name: "A4 Landscape",
      width: 1123,
      height: 794,
      widthInches: 11.69,
      heightInches: 8.27,
      widthMm: 297,
      heightMm: 210,
      description: "297 × 210 mm",
      descriptionShort: "297 × 210 mm",
    },
  },
  letter: {
    portrait: {
      id: "letter",
      name: "US Letter",
      width: 816,
      height: 1056,
      widthInches: 8.5,
      heightInches: 11.0,
      widthMm: 215.9,
      heightMm: 279.4,
      description: "8.5 × 11.0 in (US Standard)",
      descriptionShort: "8.5 × 11.0 in",
    },
    landscape: {
      id: "letter",
      name: "US Letter Landscape",
      width: 1056,
      height: 816,
      widthInches: 11.0,
      heightInches: 8.5,
      widthMm: 279.4,
      heightMm: 215.9,
      description: "11.0 × 8.5 in",
      descriptionShort: "11.0 × 8.5 in",
    },
  },
  legal: {
    portrait: {
      id: "legal",
      name: "Legal",
      width: 816,
      height: 1344,
      widthInches: 8.5,
      heightInches: 14.0,
      widthMm: 215.9,
      heightMm: 355.6,
      description: "8.5 × 14.0 in (Extended Journal)",
      descriptionShort: "8.5 × 14.0 in",
    },
    landscape: {
      id: "legal",
      name: "Legal Landscape",
      width: 1344,
      height: 816,
      widthInches: 14.0,
      heightInches: 8.5,
      widthMm: 355.6,
      heightMm: 215.9,
      description: "14.0 × 8.5 in",
      descriptionShort: "14.0 × 8.5 in",
    },
  },
  executive: {
    portrait: {
      id: "executive",
      name: "Executive",
      width: 696,
      height: 1008,
      widthInches: 7.25,
      heightInches: 10.5,
      widthMm: 184.2,
      heightMm: 266.7,
      description: "7.25 × 10.5 in (Monograph / Report)",
      descriptionShort: "7.25 × 10.5 in",
    },
    landscape: {
      id: "executive",
      name: "Executive Landscape",
      width: 1008,
      height: 696,
      widthInches: 10.5,
      heightInches: 7.25,
      widthMm: 266.7,
      heightMm: 184.2,
      description: "10.5 × 7.25 in",
      descriptionShort: "10.5 × 7.25 in",
    },
  },
  a5: {
    portrait: {
      id: "a5",
      name: "A5",
      width: 559,
      height: 794,
      widthInches: 5.83,
      heightInches: 8.27,
      widthMm: 148,
      heightMm: 210,
      description: "148 × 210 mm (Booklet / Proceedings)",
      descriptionShort: "148 × 210 mm",
    },
    landscape: {
      id: "a5",
      name: "A5 Landscape",
      width: 794,
      height: 559,
      widthInches: 8.27,
      heightInches: 5.83,
      widthMm: 210,
      heightMm: 148,
      description: "210 × 148 mm",
      descriptionShort: "210 × 148 mm",
    },
  },
  a3: {
    portrait: {
      id: "a3",
      name: "A3",
      width: 1123,
      height: 1587,
      widthInches: 11.69,
      heightInches: 16.54,
      widthMm: 297,
      heightMm: 420,
      description: "297 × 420 mm (Large Poster / Ledger)",
      descriptionShort: "297 × 420 mm",
    },
    landscape: {
      id: "a3",
      name: "A3 Landscape",
      width: 1587,
      height: 1123,
      widthInches: 16.54,
      heightInches: 11.69,
      widthMm: 420,
      heightMm: 297,
      description: "420 × 297 mm",
      descriptionShort: "420 × 297 mm",
    },
  },
};

export interface MarginPresetConfig {
  top: number; // in pixels at 96 DPI
  bottom: number;
  left: number;
  right: number;
  label: string;
  description: string;
}

export const MARGIN_PRESETS: Record<MarginPreset, MarginPresetConfig> = {
  normal: {
    top: 96,
    bottom: 96,
    left: 96,
    right: 96,
    label: 'Normal (1.0" / 2.54 cm)',
    description: "Standard 1-inch margins on all sides (APA, IEEE, Elsevier)",
  },
  narrow: {
    top: 48,
    bottom: 48,
    left: 48,
    right: 48,
    label: 'Narrow (0.5" / 1.27 cm)',
    description: "Compact 0.5-inch margins for maximum content space",
  },
  moderate: {
    top: 96,
    bottom: 96,
    left: 72,
    right: 72,
    label: 'Moderate (1.0" top/bottom, 0.75" sides)',
    description: "1.0 inch top/bottom, 0.75 inch left/right",
  },
  wide: {
    top: 96,
    bottom: 96,
    left: 192,
    right: 192,
    label: 'Wide (1.0" top/bottom, 2.0" sides)',
    description: "1.0 inch top/bottom, 2.0 inch left/right for binding or notes",
  },
};

export const FORMAT_OPTIONS = [
  { value: "a4", label: "A4 (210 × 297 mm)" },
  { value: "letter", label: "Letter (8.5 × 11 in)" },
  { value: "legal", label: "Legal (8.5 × 14 in)" },
  { value: "executive", label: "Executive (7.25 × 10.5 in)" },
  { value: "a5", label: "A5 (148 × 210 mm)" },
  { value: "a3", label: "A3 (297 × 420 mm)" },
];

export const ORIENTATION_OPTIONS = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
];

export const MARGIN_OPTIONS = [
  { value: "normal", label: 'Normal (1.0")' },
  { value: "narrow", label: 'Narrow (0.5")' },
  { value: "moderate", label: 'Moderate (0.75")' },
  { value: "wide", label: 'Wide (2.0")' },
];

export const VIEW_MODE_OPTIONS = [
  { value: "pages", label: "Print Layout" },
  { value: "continuous", label: "Web Layout" },
];

export interface ManuscriptHeaderFooterConfig {
  headerEnabled: boolean;
  headerText: string;
  headerAlign: "left" | "center" | "right";
  headerShowPageNumber: boolean;

  footerEnabled: boolean;
  footerText: string;
  footerAlign: "left" | "center" | "right";
  footerShowPageNumber: boolean;

  differentFirstPage: boolean;
}

export const DEFAULT_HEADER_FOOTER: ManuscriptHeaderFooterConfig = {
  headerEnabled: false,
  headerText: "",
  headerAlign: "right",
  headerShowPageNumber: false,

  footerEnabled: false,
  footerText: "",
  footerAlign: "center",
  footerShowPageNumber: false,

  differentFirstPage: false,
};

