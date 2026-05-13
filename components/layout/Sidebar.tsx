"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardHat, LogOut } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

type SidebarItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export function Sidebar({
  items,
  onLogout
}: {
  items: SidebarItem[];
  onLogout?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 px-4 py-5 text-white">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600">
          <HardHat size={24} />
        </div>
        <div>
          <strong className="block text-sm font-bold">Seguridad Almacen</strong>
          <span className="text-xs text-blue-200">Gestion PRL</span>
        </div>
      </div>

      <nav className="grid gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 transition-colors",
                active ? "bg-blue-600 text-white shadow-soft" : "hover:bg-slate-900 hover:text-white"
              )}
              href={item.href}
              key={item.href}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {onLogout ? (
        <Button className="mt-auto justify-start" onClick={onLogout} variant="ghost">
          <LogOut size={18} />
          Cerrar sesion
        </Button>
      ) : null}
    </aside>
  );
}
