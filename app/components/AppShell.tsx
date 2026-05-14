"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logout } from "../actions";
import { navItems } from "../data";
import { BrandMark } from "./BrandMark";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div>
            <strong>Seguridad Almacen</strong>
            <span>Gestion PRL</span>
            <BrandMark className="sidebar-logo" size={48} />
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link className={pathname === item.href ? "active" : ""} href={item.href} key={item.href}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={logout} className="logout-form">
          <button type="submit">Cerrar sesion</button>
        </form>
      </aside>
      <section className="workspace">{children}</section>
    </main>
  );
}
