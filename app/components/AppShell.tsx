"use client";

import { HardHat } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logout } from "../actions";
import { navItems } from "../data";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <HardHat size={28} />
          <div>
            <strong>Seguridad Almacen</strong>
            <span>Gestion PRL</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => (
            <Link className={pathname === item.href ? "active" : ""} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="logout-form">
          <button type="submit">Cerrar sesion</button>
        </form>
      </aside>
      <section className="workspace">{children}</section>
    </main>
  );
}
