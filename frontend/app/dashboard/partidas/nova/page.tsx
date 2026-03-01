"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { ArrowLeft, Loader2, Plus, Trophy, MapPin, CalendarDays, Hash } from "lucide-react";
import Link from "next/link";
import type { Clube } from "@/types";
import { capitalizeName } from "@/lib/utils";

export default function NovaPartidaPage() {
  const router = useRouter();
  const { data: clubes } = useSWR<Clube[]>("/clubes", fetcher);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados controlados para capitalize
  const [campeonato, setCampeonato] = useState("");
  const [estadio, setEstadio] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const body = {
        data: fd.get("data"),
        campeonato: campeonato.trim() || undefined,
        estadio: estadio.trim() || undefined,
        clube_casa_id: Number(fd.get("clube_casa_id")),
        clube_fora_id: Number(fd.get("clube_fora_id")),
        gols_casa: Number(fd.get("gols_casa") || 0),
        gols_fora: Number(fd.get("gols_fora") || 0),
      };

      if (body.clube_casa_id === body.clube_fora_id) {
        throw new Error("O clube de casa não pode ser o mesmo que o de fora.");
      }

      await apiFetch("/partidas", { method: "POST", body: JSON.stringify(body) });
      router.push("/dashboard/partidas");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar partida");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "h-12 rounded-xl border border-input bg-background px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner placeholder:text-muted-foreground/40";
  const labelClass = "text-sm font-black text-foreground uppercase tracking-widest ml-1";

  return (
    <div className="mx-auto max-w-3xl mb-12">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4 px-2">
        <Link
          href="/dashboard/partidas"
          className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] border border-border bg-card text-muted-foreground hover:bg-accent transition-all shadow-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">Nova Partida</h1>
          <p className="text-sm font-bold text-muted-foreground tracking-[0.2em] uppercase opacity-50 mt-2">Registro de Confronto Oficial</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-destructive/10 p-4 text-sm font-bold text-destructive border border-destructive/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <Hash className="h-5 w-5" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-[2.5rem] border border-border bg-card p-10 shadow-2xl shadow-black/5">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">

          {/* Data da Partida */}
          <div className="flex flex-col gap-2.5">
            <label className={labelClass}>Data do Jogo *</label>
            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
              <input name="data" type="date" required className={`${inputClass} w-full pl-12`} />
            </div>
          </div>

          {/* Campeonato */}
          <div className="flex flex-col gap-2.5">
            <label className={labelClass}>Campeonato</label>
            <div className="relative">
              <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
              <input
                value={campeonato}
                onChange={(e) => setCampeonato(e.target.value)}
                onBlur={(e) => setCampeonato(capitalizeName(e.target.value))}
                className={`${inputClass} w-full pl-12`}
                placeholder="Ex: Libertadores"
              />
            </div>
          </div>

          {/* Estádio */}
          <div className="flex flex-col gap-2.5 sm:col-span-2">
            <label className={labelClass}>Estádio / Local</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
              <input
                value={estadio}
                onChange={(e) => setEstadio(e.target.value)}
                onBlur={(e) => setEstadio(capitalizeName(e.target.value))}
                className={`${inputClass} w-full pl-12`}
                placeholder="Nome da Arena ou Estádio"
              />
            </div>
          </div>

          <div className="h-px bg-border/50 sm:col-span-2 my-2" />

          {/* Confronto */}
          <div className="flex flex-col gap-4 bg-muted/20 p-6 rounded-[2rem] border border-border/50">
            <label className={labelClass}>Mandante *</label>
            <select name="clube_casa_id" required className={inputClass}>
              <option value="">Selecione o Clube</option>
              {clubes?.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground px-1 tracking-widest">Placar Mandante</label>
              <input name="gols_casa" type="number" min="0" defaultValue="0" className={`${inputClass} text-center text-xl font-black`} />
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-muted/20 p-6 rounded-[2rem] border border-border/50">
            <label className={labelClass}>Visitante *</label>
            <select name="clube_fora_id" required className={inputClass}>
              <option value="">Selecione o Clube</option>
              {clubes?.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground px-1 tracking-widest">Placar Visitante</label>
              <input name="gols_fora" type="number" min="0" defaultValue="0" className={`${inputClass} text-center text-xl font-black`} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-16 items-center justify-center gap-4 rounded-2xl bg-primary text-base font-black uppercase tracking-[0.2em] text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Plus className="h-6 w-6" />
              Finalizar Registro
            </>
          )}
        </button>
      </form>
    </div>
  );
}