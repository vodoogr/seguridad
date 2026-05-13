export const uiTokens = {
  radius: {
    sm: "6px",
    md: "8px",
    lg: "12px"
  },
  shadow: {
    card: "shadow-soft",
    elevated: "shadow-panel"
  },
  surface: {
    app: "bg-slate-50",
    panel: "bg-white",
    sidebar: "bg-slate-950"
  }
} as const;

export const statusTone = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-blue-50 text-blue-700 ring-blue-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200"
} as const;
