import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { PageContainer } from "./PageContainer";

type ShellItem = {
  label: string;
  href: string;
};

export function AppShellV2({ children, navItems }: { children: ReactNode; navItems: ShellItem[] }) {
  const serializableNavItems = navItems.map((item) => ({
    label: item.label,
    href: item.href
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:grid lg:grid-cols-[18rem_1fr]">
      <Sidebar items={serializableNavItems} />
      <PageContainer>{children}</PageContainer>
    </div>
  );
}
