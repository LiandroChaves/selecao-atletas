"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Swords,
  Trophy,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/configuracoes", label: "Localidade, Nível e Posições", icon: Settings },
  { href: "/dashboard/titulos", label: "Títulos", icon: Trophy },
  { href: "/dashboard/clubes", label: "Clubes", icon: Building2 },
  { href: "/dashboard/jogadores", label: "Jogadores", icon: Users },
  { href: "/dashboard/partidas", label: "Partidas", icon: Swords },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              {/* Football icon SVG */}
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3c0 0 2 3 2 9s-2 9-2 9" />
                <path d="M12 3c0 0-2 3-2 9s2 9 2 9" />
                <path d="M3 12h18" />
                <path d="M5.5 6.5l2.5 2" />
                <path d="M18.5 6.5l-2.5 2" />
                <path d="M5.5 17.5l2.5-2" />
                <path d="M18.5 17.5l-2.5-2" />
              </svg>
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-sidebar-foreground">
                Seleção
              </span>
              <span className="block text-[10px] font-medium tracking-widest text-sidebar-foreground/50 uppercase">
                Atletas
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                        : "text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive && "drop-shadow-sm")} />
                    {item.label}
                    {isActive && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border px-5 py-4 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-xs text-sidebar-foreground/40">
            v1.0.0 — Sistema Online
          </p>
        </div>
      </aside>
    </>
  );
}
