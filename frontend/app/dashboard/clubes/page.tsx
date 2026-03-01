"use client";

import useSWR from "swr";
import { fetcher, apiFetch } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Building2, Trash2, Pencil, MapPin, Calendar, Globe } from "lucide-react";
import type { Clube } from "@/types";
import { API_URL } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

export default function ClubesPage() {
  const { data: clubes, isLoading, mutate } = useSWR<Clube[]>("/clubes", fetcher);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiFetch(`/clubes/${deleteId}`, { method: "DELETE" });
      await mutate();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  const filtered = clubes?.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.pais?.nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Clubes</h1>
          <p className="text-base text-muted-foreground mt-1">
            Gerencie os {clubes?.length ?? 0} clubes e agremiações parceiras
          </p>
        </div>
        <Link
          href="/dashboard/clubes/novo"
          className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Novo Clube
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, país ou estádio..."
          className="h-12 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-base text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-3xl border border-border bg-card/50" />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const logoUrl = c.logos?.[0]?.url_logo;
            return (
              <Link
                key={c.id}
                href={`/dashboard/clubes/${c.id}`}
                className="group relative flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted/30 border border-border/50 shadow-inner group-hover:bg-background transition-colors">
                    {logoUrl ? (
                      <img
                        src={`${API_URL}/files/${logoUrl}`}
                        alt={c.nome}
                        className="h-full w-full object-contain p-2"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-muted-foreground/30" />
                    )}
                  </div>

                  <div className="flex gap-2 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/dashboard/clubes/${c.id}/editar`;
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                    >
                      <Pencil className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setDeleteId(c.id);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:border-destructive/50 hover:text-destructive hover:bg-destructive/5"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-black text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {c.nome}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {c.pais && (
                      <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-1.5 text-xs font-black text-muted-foreground border border-border/50">
                        {c.pais.bandeira?.logo_bandeira ? (
                          <img
                            src={`${API_URL}/files/${c.pais.bandeira.logo_bandeira}`}
                            alt={c.pais.nome}
                            className="h-3 w-5 object-cover rounded-[2px] shadow-sm"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <Globe className="h-3 w-3" />
                        )}
                        {c.pais.nome.toUpperCase()}
                      </div>
                    )}
                    {c.fundacao && (
                      <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black text-primary border border-primary/10">
                        <Calendar className="h-3 w-3" />
                        EST. {c.fundacao}
                      </div>
                    )}
                  </div>

                  {c.estadio && (
                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground/70 bg-muted/20 p-3 rounded-xl border border-border/30">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="line-clamp-1">{c.estadio}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border bg-card/30 py-32">
          <div className="rounded-full bg-muted p-8 mb-6 shadow-inner">
            <Building2 className="h-16 w-16 text-muted-foreground/20" />
          </div>
          <p className="text-2xl font-black text-foreground">Nenhum clube encontrado</p>
          <p className="text-muted-foreground font-medium mt-2">Tente ajustar sua busca ou cadastre um novo parceiro.</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Excluir Clube"
        message="Tem certeza que deseja excluir este clube? Esta ação removerá permanentemente todos os vínculos e logos associados."
        confirmLabel="Excluir permanentemente"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}