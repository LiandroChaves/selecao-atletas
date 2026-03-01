"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Swords, Eye, Pencil, Trash2, Calendar, Trophy, MapPin, Building2, Settings } from "lucide-react";
import { formatDate, API_URL } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { apiFetch } from "@/lib/api";

export default function PartidasPage() {
  const { data: partidas, isLoading, mutate } = useSWR<any[]>("/partidas", fetcher);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiFetch(`/partidas/${deleteId}`, { method: "DELETE" });
      await mutate();
      setDeleteId(null);
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  }

  const filtered = partidas?.filter((p) =>
    p.campeonato?.toLowerCase().includes(search.toLowerCase()) ||
    p.clube_casa?.nome?.toLowerCase().includes(search.toLowerCase()) ||
    p.clube_fora?.nome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">Confrontos</h1>
          <p className="text-sm font-bold text-muted-foreground tracking-[0.2em] uppercase opacity-50 mt-2">Histórico de Partidas e Resultados</p>
        </div>
        <Link
          href="/dashboard/partidas/nova"
          className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Registrar Jogo
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md px-2">
        <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por campeonato ou clube..."
          className="h-12 w-full rounded-2xl border border-border bg-card pl-14 pr-4 text-base text-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/30"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-[2rem] border border-border bg-card/50" />
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((p) => {
            const logoCasa = p.clube_casa?.logos?.[0]?.url_logo;
            const logoFora = p.clube_fora?.logos?.[0]?.url_logo;

            return (
              <div
                key={p.id}
                className="group relative flex flex-col sm:flex-row items-center gap-6 rounded-[2rem] border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-black/5"
              >
                {/* Meta Info (Left) */}
                <div className="flex flex-col items-center sm:items-start gap-1 sm:min-w-[140px] text-center sm:text-left">
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-tighter">
                    <Calendar className="h-3.5 w-3.5" />
                    <span suppressHydrationWarning>{formatDate(p.data)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground font-bold text-[10px] uppercase tracking-widest">
                    <Trophy className="h-3 w-3" />
                    <span className="line-clamp-1">{p.campeonato || "Amistoso"}</span>
                  </div>
                </div>

                {/* Scoreboard (Center) */}
                <div className="flex flex-1 items-center justify-center gap-4 sm:gap-8 w-full">
                  {/* Time Casa */}
                  <div className="flex flex-1 items-center justify-end gap-3 text-right">
                    <span className="text-sm sm:text-lg font-black text-foreground uppercase tracking-tighter line-clamp-1">
                      {p.clube_casa?.nome}
                    </span>
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-muted/30 border border-border/50 p-2 flex items-center justify-center">
                      {logoCasa ? (
                        <img src={`${API_URL}/files/${logoCasa}`} alt="Casa" className="h-full w-full object-contain" crossOrigin="anonymous" />
                      ) : <Building2 className="h-6 w-6 text-muted-foreground/20" />}
                    </div>
                  </div>

                  {/* Placar */}
                  <div className="flex items-center justify-center rounded-2xl bg-muted/50 px-5 py-2 border border-border shadow-inner">
                    <span className="text-2xl font-black text-foreground tracking-tighter">
                      {p.gols_casa}
                    </span>
                    <span className="mx-2 text-muted-foreground font-bold opacity-30">×</span>
                    <span className="text-2xl font-black text-foreground tracking-tighter">
                      {p.gols_fora}
                    </span>
                  </div>

                  {/* Time Fora */}
                  <div className="flex flex-1 items-center justify-start gap-3 text-left">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-muted/30 border border-border/50 p-2 flex items-center justify-center">
                      {logoFora ? (
                        <img src={`${API_URL}/files/${logoFora}`} alt="Fora" className="h-full w-full object-contain" crossOrigin="anonymous" />
                      ) : <Building2 className="h-6 w-6 text-muted-foreground/20" />}
                    </div>
                    <span className="text-sm sm:text-lg font-black text-foreground uppercase tracking-tighter line-clamp-1">
                      {p.clube_fora?.nome}
                    </span>
                  </div>
                </div>

                {/* Actions (Right) */}
                <div className="flex items-center gap-2 sm:ml-auto">
                  <Link
                    href={`/dashboard/partidas/${p.id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    title="Detalhes"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/dashboard/partidas/${p.id}/editar`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                    title="Editar"
                  >
                    <Pencil className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={(e) => { e.preventDefault(); setDeleteId(p.id); }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
                    title="Excluir"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border bg-card/30 py-24">
          <div className="rounded-full bg-muted p-8 mb-6">
            <Swords className="h-12 w-12 text-muted-foreground/20" />
          </div>
          <p className="text-2xl font-black text-foreground uppercase tracking-tighter">Nenhum jogo registrado</p>
          <p className="text-muted-foreground font-medium mt-2">Os confrontos cadastrados aparecerão aqui.</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Excluir Partida"
        message="Tem certeza que deseja apagar este confronto? Todas as estatísticas de desempenho dos jogadores vinculadas a esta partida serão perdidas."
        confirmLabel="Confirmar Exclusão"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}