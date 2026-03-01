"use client";

import { Menu, LogOut, User } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm lg:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="hidden text-sm font-medium text-foreground sm:inline">
            {user?.nome || "Usuario"}
          </span>
        </div>

        <button
          onClick={logout}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Sair"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
