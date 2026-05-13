import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { PageContainer } from "./PageContainer";

type ShellItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export function AppShellV2({ children, navItems }: { children: ReactNode; navItems: ShellItem[] }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:grid lg:grid-cols-[18rem_1fr]">
      <Sidebar items={navItems} />
      <PageContainer>{children}</PageContainer>
    </div>
  );
}
