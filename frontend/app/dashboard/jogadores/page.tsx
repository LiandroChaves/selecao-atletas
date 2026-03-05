"use client";

import useSWR from "swr";
import { fetcher, apiFetch } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, User, MapPin, Trash2, Pencil, Globe, Star } from "lucide-react";
import type { Jogador } from "@/types";
import { calcAge, API_URL } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";

export default function JogadoresPage() {
  const { data: jogadores, isLoading, mutate } = useSWR<Jogador[]>("/jogadores", fetcher);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = jogadores?.filter(
    (j) =>
      j.nome.toLowerCase().includes(search.toLowerCase()) ||
      j.posicao_principal?.nome?.toLowerCase().includes(search.toLowerCase()) ||
      j.clube_atual?.nome?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiFetch(`/jogadores/${deleteId}`, { method: "DELETE" });
      await mutate();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">Atletas</h1>
          <p className="text-base text-muted-foreground mt-1">
            Gestão técnica de {jogadores?.length ?? 0} perfis de jogadores
          </p>
        </div>
        <Link
          href="/dashboard/jogadores/novo"
          className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Novo Atleta
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, posição ou clube..."
          className="h-12 w-full rounded-2xl border border-border bg-card pl-12 pr-4 text-base text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
        />
      </div>

      {/* Players Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-[2rem] border border-border bg-card/50" />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((j) => (
            <Link
              key={j.id}
              href={`/dashboard/jogadores/${j.id}`}
              className="group relative flex flex-col gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2"
            >
              <div className="flex items-start justify-between">
                {/* Photo with Position Badge */}
                <div className="relative">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted/30 border border-border/50 shadow-inner group-hover:bg-background transition-colors">
                    {j.foto ? (
                      <img
                        src={`${API_URL}/files/${j.foto}`}
                        alt={j.nome}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground/30" />
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/dashboard/jogadores/${j.id}/editar`;
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteId(j.id);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:border-destructive/50 hover:text-destructive hover:bg-destructive/5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Player Info */}
              <div className="flex flex-col gap-3">
                <div className="mb-5">
                  {j.posicao_principal && (
                    <div className="absolute rounded-lg bg-primary px-2 py-1 text-[10px] font-black text-primary-foreground shadow-md uppercase tracking-tighter text-nowrap">
                      {j.posicao_principal.nome}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {j.nome}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest" suppressHydrationWarning>
                      {calcAge(j.data_nascimento)} ANOS
                    </span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                      PÉ {j.pe_dominante === "D" ? "DIREITO" : j.pe_dominante === "E" ? "ESQUERDO" : "AMBIDESTRO"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-border/50 pt-3">
                  {j.clube_atual && (
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/80">
                      <Star className="h-3.5 w-3.5 text-primary" />
                      <span className="truncate">{j.clube_atual.nome}</span>
                    </div>
                  )}
                  {j.pais && (
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/70">
                      {j.pais.bandeira?.logo_bandeira ? (
                        <img
                          src={`${API_URL}/files/${j.pais.bandeira.logo_bandeira}`}
                          alt={j.pais.nome}
                          className="h-3 w-4.5 object-cover rounded-[1px] shadow-sm"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <Globe className="h-3 w-3" />
                      )}
                      <span>{j.pais.nome.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-border bg-card/30 py-32">
          <div className="rounded-full bg-muted p-8 mb-6 shadow-inner">
            <User className="h-16 w-16 text-muted-foreground/20" />
          </div>
          <p className="text-2xl font-black text-foreground">Nenhum atleta encontrado</p>
          <p className="text-muted-foreground font-medium mt-2 text-center max-w-xs">
            Tente ajustar os termos da busca ou cadastre um novo jogador para gerenciar sua carreira.
          </p>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Excluir Jogador"
        message="Tem certeza que deseja excluir este jogador? Todo o histórico técnico e estatísticas serão apagados permanentemente."
        confirmLabel="Confirmar Exclusão"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}