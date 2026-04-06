/**
 * ClinOS Design Tokens
 * Single source of truth for all brand colors, severity levels, and
 * clinical UI constants. Use these when you need color values in JS/TS
 * (e.g. chart configs, dynamic styles). For Tailwind classes, use the
 * CSS custom properties in globals.css directly.
 */

// ─── Brand Colors ─────────────────────────────────────────────────────────────
export const BRAND = {
  navy:       "#0D2137",
  navyLight:  "#1A3150",
  teal:       "#00695C",
  tealLight:  "#00897B",
  tealDark:   "#004D40",
  red:        "#C62828",
  redLight:   "#EF5350",
  amber:      "#E65100",
  amberLight: "#FF6D00",
} as const;

// ─── Clinical Severity Levels ─────────────────────────────────────────────────
export type SeverityLevel = "critical" | "unstable" | "stable" | "unknown";

export const SEVERITY: Record<
  SeverityLevel,
  { label: string; color: string; bgClass: string; textClass: string; icon: string }
> = {
  critical: {
    label:     "CRITICAL",
    color:     "#C62828",
    bgClass:   "severity-critical",
    textClass: "text-[var(--severity-critical)]",
    icon:      "🔴",
  },
  unstable: {
    label:     "UNSTABLE",
    color:     "#E65100",
    bgClass:   "severity-unstable",
    textClass: "text-[var(--severity-unstable)]",
    icon:      "🟠",
  },
  stable: {
    label:     "STABLE",
    color:     "#00695C",
    bgClass:   "severity-stable",
    textClass: "text-[var(--severity-stable)]",
    icon:      "🟢",
  },
  unknown: {
    label:     "UNKNOWN",
    color:     "#6B7280",
    bgClass:   "bg-muted",
    textClass: "text-muted-foreground",
    icon:      "⚪",
  },
};

// ─── ClinOS 8-Step Workflow Steps ─────────────────────────────────────────────
export type WorkflowStep =
  | "triage"
  | "history"
  | "examination"
  | "investigations"
  | "differentials"
  | "diagnosis"
  | "management"
  | "documentation";

export const WORKFLOW_STEPS: Record<
  WorkflowStep,
  { step: number; label: string; short: string; description: string }
> = {
  triage: {
    step:        1,
    label:       "Triage",
    short:       "TRIAGE",
    description: "Assess patient stability: Stable / Unstable / Crash",
  },
  history: {
    step:        2,
    label:       "History",
    short:       "HX",
    description: "Structured history taking with AI-guided prompts",
  },
  examination: {
    step:        3,
    label:       "Examination",
    short:       "EXAM",
    description: "Clinical findings with significance scoring",
  },
  investigations: {
    step:        4,
    label:       "Investigations",
    short:       "INV",
    description: "STAT / URGENT / ROUTINE investigation ordering",
  },
  differentials: {
    step:        5,
    label:       "Differentials",
    short:       "DDx",
    description: "3-tier differential: must-not-miss / likely / possible",
  },
  diagnosis: {
    step:        6,
    label:       "Diagnosis",
    short:       "Dx",
    description: "Criteria-based diagnosis with confidence scoring",
  },
  management: {
    step:        7,
    label:       "Management",
    short:       "Mx",
    description: "ER / Ward management with drug safety hard stops",
  },
  documentation: {
    step:        8,
    label:       "Documentation",
    short:       "DOC",
    description: "Auto-generated SOAP note / referral / discharge summary",
  },
};

export const WORKFLOW_STEP_ORDER: WorkflowStep[] = [
  "triage",
  "history",
  "examination",
  "investigations",
  "differentials",
  "diagnosis",
  "management",
  "documentation",
];

// ─── Clinical Modes ───────────────────────────────────────────────────────────
export type ClinicalMode = "er" | "ward" | "icu";

export const CLINICAL_MODES: Record<ClinicalMode, { label: string; color: string }> = {
  er:   { label: "Emergency",    color: BRAND.red },
  ward: { label: "Ward",         color: BRAND.teal },
  icu:  { label: "ICU / HDU",    color: BRAND.amber },
};

// ─── Investigation Priority ───────────────────────────────────────────────────
export type InvestigationPriority = "stat" | "urgent" | "routine";

export const INVESTIGATION_PRIORITY: Record<
  InvestigationPriority,
  { label: string; timeframe: string; color: string }
> = {
  stat:    { label: "STAT",    timeframe: "< 30 min",  color: BRAND.red },
  urgent:  { label: "URGENT",  timeframe: "< 2 hours", color: BRAND.amber },
  routine: { label: "ROUTINE", timeframe: "< 24 hours",color: BRAND.teal },
};

// ─── DDx Tiers ────────────────────────────────────────────────────────────────
export type DDxTier = "must_not_miss" | "likely" | "possible";

export const DDX_TIERS: Record<DDxTier, { label: string; description: string; color: string }> = {
  must_not_miss: {
    label:       "Must Not Miss",
    description: "Life-threatening — rule out first regardless of probability",
    color:       BRAND.red,
  },
  likely: {
    label:       "Most Likely",
    description: "Highest probability given presentation",
    color:       BRAND.teal,
  },
  possible: {
    label:       "Possible",
    description: "Lower probability but consistent with findings",
    color:       BRAND.amber,
  },
};
