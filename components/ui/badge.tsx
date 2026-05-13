import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1", {
  variants: {
    tone: {
      neutral: "bg-slate-100 text-slate-700 ring-slate-200",
      info: "bg-blue-50 text-blue-700 ring-blue-200",
      success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      warning: "bg-amber-50 text-amber-700 ring-amber-200",
      danger: "bg-red-50 text-red-700 ring-red-200"
    }
  },
  defaultVariants: {
    tone: "neutral"
  }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}
