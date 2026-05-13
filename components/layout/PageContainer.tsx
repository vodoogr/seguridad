import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("mx-auto w-full max-w-7xl px-6 py-6 lg:px-8", className)}>{children}</main>;
}
