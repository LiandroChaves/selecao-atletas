"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import type { Partida, Jogador } from "@/types";
import { formatDate, API_URL } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2, Activity, Target, User, Trash2, Trophy, MapPin, Calendar, CheckCircle2, XCircle, Pencil, Save, X } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";

export default function PartidaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: partida, isLoading, mutate } = useSWR<any>(`/partidas/${id}`, fetcher);
  const { data: jogadores } = useSWR<Jogador[]>("/jogadores", fetcher);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleDeleteStat() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiFetch(`/partidas/estatisticas/${deleteId}`, { method: "DELETE" });
      mutate();
      setDeleteId(null);
    } catch { } finally { setDeleting(false); }
  }

  async function handleEditStatSubmit(e: React.FormEvent, statId: number) {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const body: any = {};
      ["minutos_jogados", "gols", "assistencias", "passes_totais", "passes_certos", "desarmes", "faltas_cometidas", "cartoes_amarelos", "cartoes_vermelhos"].forEach(k => {
        body[k] = Number(editData[k] || 0);
      });

      await apiFetch(`/partidas/estatisticas/${statId}`, { method: "PUT", body: JSON.stringify(body) });
      setEditId(null);
      mutate();
    } catch { } finally { setSavingEdit(false); }
  }

  async function handleAddStat(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      const body: Record<string, unknown> = {
        partida_id: Number(id),
        jogador_id: Number(fd.get("jogador_id")),
      };
      ["minutos_jogados", "gols", "assistencias", "passes_totais", "passes_certos", "desarmes", "faltas_cometidas", "cartoes_amarelos", "cartoes_vermelhos"].forEach((k) => {
        const v = fd.get(k);
        if (v !== null && v !== "") body[k] = Number(v);
      });
      await apiFetch("/partidas/estatisticas", { method: "POST", body: JSON.stringify(body) });
      mutate();
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar estatistica");
    } finally { setSaving(false); }
  }

  if (isLoading) return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8 p-10">
      <div className="h-12 w-64 animate-pulse rounded-2xl bg-muted" />
      <div className="h-64 animate-pulse rounded-[3rem] bg-muted" />
    </div>
  );

  if (!partida) return <div className="text-center py-20 font-bold text-muted-foreground uppercase tracking-widest">Partida não encontrada</div>;

  const inputClass = "h-12 rounded-2xl border border-input bg-background px-4 text-base focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-inner";
  const logoCasa = partida.clube_casa?.logos?.[0]?.url_logo;
  const logoFora = partida.clube_fora?.logos?.[0]?.url_logo;

  const fields = [
    { name: "minutos_jogados", label: "Minutos" },
    { name: "gols", label: "Gols" },
    { name: "assistencias", label: "Assists" },
    { name: "passes_totais", label: "Passes" },
    { name: "passes_certos", label: "P. Certos" },
    { name: "desarmes", label: "Desarmes" },
    { name: "faltas_cometidas", label: "Faltas" },
    { name: "cartoes_amarelos", label: "Amarelo" },
    { name: "cartoes_vermelhos", label: "Vermelho" }
  ];

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-5 px-2">
        <Link href="/dashboard/partidas" className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-border bg-card text-muted-foreground hover:bg-accent transition-all shadow-sm">
          <ArrowLeft className="h-7 w-7" />
        </Link>
        <div>
          <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">Relatório de Jogo</h1>
          <p className="text-sm font-bold text-muted-foreground tracking-[0.4em] uppercase opacity-40 mt-2">Scouting Analysis</p>
        </div>
      </div>

      {/* Placar Card */}
      <div className="overflow-hidden rounded-[3rem] border border-border bg-card shadow-2xl shadow-black/5">
        <div className="h-4 bg-primary/90 w-full" />
        <div className="p-12 flex flex-col gap-10">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-black uppercase tracking-widest text-muted-foreground/60">
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border/50"><Calendar className="h-4 w-4 text-primary" /><span suppressHydrationWarning>{formatDate(partida.data)}</span></div>
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border/50"><Trophy className="h-4 w-4 text-primary" />{partida.campeonato || "Amistoso"}</div>
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border/50"><MapPin className="h-4 w-4 text-primary" />{partida.estadio || "Local Indefinido"}</div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 max-w-4xl mx-auto w-full">
            <div className="flex flex-col items-center gap-4 flex-1 text-center">
              <div className="h-32 w-32 rounded-[2rem] bg-muted/30 border border-border shadow-inner p-4 flex items-center justify-center">
                {logoCasa ? <img src={`${API_URL}/files/${logoCasa}`} crossOrigin="anonymous" className="h-full w-full object-contain" /> : <Activity className="h-12 w-12 text-muted-foreground/20" />}
              </div>
              <span className="text-2xl font-black text-foreground uppercase tracking-tighter">{partida.clube_casa?.nome}</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="bg-primary/10 rounded-[2.5rem] px-12 py-6 border border-primary/20 shadow-xl">
                <span className="text-7xl font-black text-primary tracking-tighter tabular-nums">
                  {partida.gols_casa} <span className="text-muted-foreground/30 mx-2">×</span> {partida.gols_fora}
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 mt-2">Placar Final</span>
            </div>

            <div className="flex flex-col items-center gap-4 flex-1 text-center">
              <div className="h-32 w-32 rounded-[2rem] bg-muted/30 border border-border shadow-inner p-4 flex items-center justify-center">
                {logoFora ? <img src={`${API_URL}/files/${logoFora}`} crossOrigin="anonymous" className="h-full w-full object-contain" /> : <Activity className="h-12 w-12 text-muted-foreground/20" />}
              </div>
              <span className="text-2xl font-black text-foreground uppercase tracking-tighter">{partida.clube_fora?.nome}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scout Section */}
      <div className="rounded-[3rem] border border-border bg-card p-10 shadow-sm relative overflow-hidden">
        <div className="mb-10 flex items-center justify-between px-2">
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase flex items-center gap-4"><Activity className="h-8 w-8 text-primary" /> Performance Individual</h2>
          <button onClick={() => setShowForm(!showForm)} className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">+ Lançar Scout</button>
        </div>

        {showForm && (
          <form onSubmit={handleAddStat} className="mb-12 p-8 bg-muted/40 rounded-[2.5rem] border border-border flex flex-col gap-8 animate-in slide-in-from-top-4 duration-500 shadow-inner">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Selecionar Atleta</label>
              <select name="jogador_id" required className={inputClass}>
                <option value="">Buscar jogador...</option>
                {jogadores?.map(j => <option key={j.id} value={j.id}>{j.nome}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {fields.map(f => (
                <div key={f.name} className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">{f.label}</label>
                  <input name={f.name} type="number" min="0" defaultValue="0" className={`${inputClass} text-center font-black`} />
                </div>
              ))}
            </div>
            <button type="submit" disabled={saving} className="h-16 w-full rounded-2xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20">Finalizar Lançamento</button>
          </form>
        )}

        <div className="overflow-x-auto rounded-[2rem] border border-border/50 bg-muted/20">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-6 font-black text-xs uppercase tracking-widest text-muted-foreground">Jogador</th>
                <th className="p-6 text-center font-black text-xs uppercase tracking-widest text-muted-foreground">Minutos</th>
                <th className="p-6 text-center font-black text-xs uppercase tracking-widest text-muted-foreground">Gols</th>
                <th className="p-6 text-center font-black text-xs uppercase tracking-widest text-muted-foreground">Assists</th>
                <th className="p-6 text-center font-black text-xs uppercase tracking-widest text-muted-foreground">Cartões</th>
                <th className="p-6 text-right font-black text-xs uppercase tracking-widest text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {partida.estatisticas?.map((s: any) => (
                editId === s.id ? (
                  <tr key={s.id} className="bg-primary/5">
                    <td colSpan={6} className="p-6">
                      <form onSubmit={(e) => handleEditStatSubmit(e, s.id)} className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-primary uppercase tracking-tighter text-lg">{s.jogador?.nome}</span>
                          <div className="flex gap-2">
                            <button type="submit" disabled={savingEdit} className="h-10 px-4 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                              {savingEdit ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-4 w-4" />} Salvar
                            </button>
                            <button type="button" onClick={() => setEditId(null)} className="h-10 px-4 rounded-xl border border-border bg-card text-muted-foreground font-black text-[10px] uppercase tracking-widest">
                              Cancelar
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                          {fields.map(f => (
                            <div key={f.name} className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-black uppercase text-muted-foreground/60 px-1">{f.label}</label>
                              <input
                                type="number"
                                min="0"
                                value={editData[f.name] || 0}
                                onChange={e => setEditData({ ...editData, [f.name]: e.target.value })}
                                className="h-10 w-full rounded-xl border border-input bg-background text-center font-black text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={s.id} className="hover:bg-muted/40 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center overflow-hidden">
                          {s.jogador?.foto ? <img src={`${API_URL}/files/${s.jogador.foto}`} className="h-full w-full object-cover" crossOrigin="anonymous" /> : <User className="h-6 w-6 text-muted-foreground/20" />}
                        </div>
                        <div>
                          <p className="font-black text-foreground uppercase tracking-tighter text-base leading-none">{s.jogador?.nome}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">{s.jogador?.posicao_principal?.nome}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center font-black text-lg text-foreground">{s.minutos_jogados}'</td>
                    <td className="p-6 text-center">
                      {s.gols > 0 ? <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20">{s.gols}</span> : <span className="text-muted-foreground/30 font-bold">0</span>}
                    </td>
                    <td className="p-6 text-center">
                      {s.assistencias > 0 ? <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-black shadow-lg shadow-amber-500/20">{s.assistencias}</span> : <span className="text-muted-foreground/30 font-bold">0</span>}
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {s.cartoes_amarelos > 0 && <div className="h-6 w-4 bg-yellow-400 rounded-sm shadow-sm border border-yellow-500/50" title="Amarelo" />}
                        {s.cartoes_vermelhos > 0 && <div className="h-6 w-4 bg-red-600 rounded-sm shadow-sm border border-red-700/50" title="Vermelho" />}
                        {!s.cartoes_amarelos && !s.cartoes_vermelhos && <span className="text-muted-foreground/20">—</span>}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => {
                            setEditId(s.id);
                            setEditData(s);
                          }}
                          className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-muted-foreground/30 hover:text-primary hover:bg-primary/10 transition-all"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(s.id)}
                          className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog isOpen={deleteId !== null} title="Excluir Scout" message="Esta ação removerá permanentemente as estatísticas deste jogador e reajustará o somatório geral do perfil dele." confirmLabel="Excluir Agora" onConfirm={handleDeleteStat} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}