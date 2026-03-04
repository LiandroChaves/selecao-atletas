"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { generatePlayerPDF } from "@/lib/pdf";
import type { Jogador, Clube } from "@/types";
import { calcAge, formatDate, API_URL, parseCharacteristic, formatCharacteristic, simpleCapitalize, capitalizeName } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeft,
  FileDown,
  Pencil,
  User,
  MapPin,
  Calendar,
  Ruler,
  Weight,
  Footprints,
  Target,
  Trophy,
  Activity,
  Building2,
  AlertTriangle,
  Star,
  Plus,
  Trash2,
  Settings,
  PlayCircle,
  Notebook,
  Globe,
  Blocks,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PDFModal } from "@/components/pdf-modal";
import type { PDFOptions } from "@/types";

export default function JogadorPerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: jogador, isLoading, error: loadError, mutate } = useSWR<any>(`/jogadores/${id}`, fetcher);
  const { data: clubes } = useSWR<Clube[]>("/clubes", fetcher);

  const [showAddCaracteristica, setShowAddCaracteristica] = useState(false);
  const [showAddClube, setShowAddClube] = useState(false);
  const [showAddLesao, setShowAddLesao] = useState(false);

  const [deleteData, setDeleteData] = useState<{ id: number, type: 'caracteristica' | 'clube' | 'lesao' | 'estatistica' } | null>(null);
  const [editCaracteristicaId, setEditCaracteristicaId] = useState<number | null>(null);
  const [editClubeId, setEditClubeId] = useState<number | null>(null);
  const [editLesaoId, setEditLesaoId] = useState<number | null>(null);
  const [showAddEstatistica, setShowAddEstatistica] = useState(false);

  const [formCaracteristica, setFormCaracteristica] = useState({ descricao: "", nota: 5 });
  const [formClube, setFormClube] = useState({ clube_id: "", data_entrada: "", data_saida: "", jogos: "", categoria: "Profissional" });
  const [formLesao, setFormLesao] = useState({ tipo_lesao: "", data_inicio: "", data_retorno: "", descricao: "" });
  const [formEstatistica, setFormEstatistica] = useState({ temporada: "", clube_id: "", partidas_jogadas: 0, gols: 0, assistencias: 0, faltas_cometidas: 0, cartoes_amarelos: 0, cartoes_vermelhos: 0 });

  const [loadingAction, setLoadingAction] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  async function handleGeneratePDF(options: PDFOptions) {
    setIsGeneratingPDF(true);
    try {
      await generatePlayerPDF(jogador, options);
      setIsPDFModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPDF(false);
    }
  }

  async function handleAction(type: 'caracteristica' | 'clube' | 'lesao' | 'estatistica', method: 'POST' | 'PUT' | 'DELETE', actionId?: number, bodyData?: any) {
    setLoadingAction(true);
    let url = `/historicos/${type}`;
    if (actionId) url += `/${actionId}`;
    try {
      await apiFetch(url, {
        method,
        body: bodyData ? JSON.stringify(bodyData) : undefined
      });
      mutate();
      if (method === 'POST') {
        if (type === 'caracteristica') { setShowAddCaracteristica(false); setFormCaracteristica({ descricao: "", nota: 5 }); }
        if (type === 'clube') { setShowAddClube(false); setFormClube({ clube_id: "", data_entrada: "", data_saida: "", jogos: "", categoria: "Profissional" }); }
        if (type === 'lesao') { setShowAddLesao(false); setFormLesao({ tipo_lesao: "", data_inicio: "", data_retorno: "", descricao: "" }); }
        if (type === 'estatistica') { setShowAddEstatistica(false); setFormEstatistica({ temporada: "", clube_id: "", partidas_jogadas: 0, gols: 0, assistencias: 0, faltas_cometidas: 0, cartoes_amarelos: 0, cartoes_vermelhos: 0 }); }
      }
      setEditCaracteristicaId(null);
      setEditClubeId(null);
      setEditLesaoId(null);
      setDeleteData(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  }

  if (loadError) {
    console.error("Erro ao carregar jogador (detalhes):", loadError);
    return (
      <div className="mx-auto max-w-6xl p-10 text-center">
        <div className="rounded-[2rem] border border-destructive/20 bg-destructive/10 p-12 text-destructive shadow-xl">
          <AlertTriangle className="mx-auto mb-6 h-16 w-16 opacity-80" />
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Erro ao carregar atleta</h2>
          <p className="opacity-80 font-medium">Não foi possível carregar os dados deste jogador. Verifique sua conexão ou se o atleta foi excluído recentemente.</p>
        </div>
      </div>
    );
  }

  if (isLoading || !jogador) {
    return (
      <div className="mx-auto max-w-6xl flex flex-col gap-8 p-10">
        <div className="h-12 w-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-[500px] animate-pulse rounded-[3rem] bg-muted" />
      </div>
    );
  }

  const age = calcAge(jogador.data_nascimento);
  const radarData = jogador.caracteristicas?.map((c: any) => {
    const { descricao, nota } = parseCharacteristic(c.descricao);
    return {
      subject: `${descricao.toUpperCase()}: ${nota}`,
      value: nota,
      fullMark: 10,
    };
  }) ?? [];

  const inputClass = "h-12 rounded-2xl border border-input bg-background px-4 text-base focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-inner";

  return (
    <div className="flex flex-col gap-12 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/jogadores" className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground hover:bg-accent transition-all shadow-sm">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <div>
            <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">Perfil do Atleta</h1>
            <p className="text-xs font-black text-muted-foreground tracking-[0.5em] uppercase opacity-40 mt-3">Elite Data Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/jogadores/${id}/editar`} className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-card px-8 text-sm font-black uppercase tracking-widest text-foreground hover:bg-accent transition-all shadow-sm">
            <Pencil className="h-5 w-5" /> Editar
          </Link>
          <button onClick={() => setIsPDFModalOpen(true)} className="flex h-14 items-center gap-3 rounded-2xl bg-primary px-8 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all">
            <FileDown className="h-5 w-5" /> PDF
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="overflow-hidden rounded-[3.5rem] border border-border bg-card shadow-2xl shadow-black/5">
        <div className="h-4 bg-primary/90 w-full" />
        <div className="flex flex-col gap-16 p-14 md:flex-row lg:items-center">
          <div className="relative mx-auto md:mx-0">
            <div className="flex h-72 w-72 shrink-0 items-center justify-center overflow-hidden rounded-[3.5rem] bg-muted border-4 border-card shadow-2xl">
              {jogador.foto ? (
                <img src={`${API_URL}/files/${jogador.foto}`} alt={jogador.nome} className="h-full w-full object-cover" crossOrigin="anonymous" />
              ) : (
                <User className="h-32 w-32 text-muted-foreground/10" />
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary shadow-2xl border-8 border-card">
              <Trophy className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-10 text-center md:text-left">
            <div>
              <h2 className="text-7xl font-black text-foreground tracking-tighter mb-4 leading-none">{jogador.nome}</h2>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                <span className="rounded-2xl bg-primary/10 px-8 py-3 text-sm font-black text-primary uppercase tracking-[0.2em] border border-primary/20 shadow-sm">
                  {jogador.posicao_principal?.nome}
                </span>
                {jogador.posicao_secundaria && (
                  <span className="rounded-2xl bg-muted px-8 py-3 text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] border border-border">
                    {jogador.posicao_secundaria.nome}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-12 gap-x-16 text-sm sm:grid-cols-3 border-t border-border/50 pt-12">
              <FichaItem icon={Calendar} label="Idade" value={`${age} ANOS (${formatDate(jogador.data_nascimento)})`} />
              <FichaItem icon={Building2} label="Vínculo Atual" value={jogador.clube_atual?.nome || "AGENTE LIVRE"} />
              <FichaItem icon={Globe} label="Naturalidade" value={`${jogador.cidade?.nome || ""}, ${jogador.estado?.uf || ""} - ${jogador.pais?.nome || ""}`} badge={jogador.pais?.bandeira?.logo_bandeira} />
              <FichaItem icon={Ruler} label="Altura" value={`${jogador.altura}M`} />
              <FichaItem icon={Weight} label="Peso" value={`${jogador.peso}KG`} />
              <FichaItem icon={Footprints} label="Pé Dominante" value={`${jogador.pe_dominante === 'D' ? 'DESTRO' : jogador.pe_dominante === 'E' ? 'CANHOTO' : 'AMBIDESTRO'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="rounded-[3rem] border border-border bg-card p-12 shadow-sm mx-2">
        <div className="mb-12 flex items-center justify-between">
          <h3 className="text-3xl font-black flex items-center gap-5 uppercase tracking-tighter"><Activity className="h-10 w-10 text-primary" /> Estatísticas por Temporada</h3>
          <button onClick={() => setShowAddEstatistica(!showAddEstatistica)} className="h-14 px-8 rounded-2xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all">+ Add</button>
        </div>

        {showAddEstatistica && (
          <div className="mb-10 p-10 bg-muted/40 rounded-[2.5rem] border border-border space-y-6 animate-in slide-in-from-top-4 duration-500 shadow-xl">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <input value={formEstatistica.temporada} onChange={(e) => setFormEstatistica({ ...formEstatistica, temporada: e.target.value })} placeholder="Temporada (Ex: 2024)" className={inputClass} />
              <select value={formEstatistica.clube_id} onChange={(e) => setFormEstatistica({ ...formEstatistica, clube_id: e.target.value })} className={inputClass}>
                <option value="">Selecione o Clube (Opcional)</option>
                {clubes?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-6">
              <div className="flex flex-col gap-2"><span className="text-[10px] font-black uppercase text-muted-foreground ml-2">Jogos</span><input type="number" value={formEstatistica.partidas_jogadas} onChange={(e) => setFormEstatistica({ ...formEstatistica, partidas_jogadas: Number(e.target.value) })} className={inputClass} /></div>
              <div className="flex flex-col gap-2"><span className="text-[10px] font-black uppercase text-muted-foreground ml-2">Gols</span><input type="number" value={formEstatistica.gols} onChange={(e) => setFormEstatistica({ ...formEstatistica, gols: Number(e.target.value) })} className={inputClass} /></div>
              <div className="flex flex-col gap-2"><span className="text-[10px] font-black uppercase text-muted-foreground ml-2">Assists</span><input type="number" value={formEstatistica.assistencias} onChange={(e) => setFormEstatistica({ ...formEstatistica, assistencias: Number(e.target.value) })} className={inputClass} /></div>
              <div className="flex flex-col gap-2"><span className="text-[10px] font-black uppercase text-muted-foreground ml-2">Faltas</span><input type="number" value={formEstatistica.faltas_cometidas} onChange={(e) => setFormEstatistica({ ...formEstatistica, faltas_cometidas: Number(e.target.value) })} className={inputClass} /></div>
              <div className="flex flex-col gap-2"><span className="text-[10px] font-black uppercase text-muted-foreground ml-2">Amarelos</span><input type="number" value={formEstatistica.cartoes_amarelos} onChange={(e) => setFormEstatistica({ ...formEstatistica, cartoes_amarelos: Number(e.target.value) })} className={inputClass} /></div>
              <div className="flex flex-col gap-2"><span className="text-[10px] font-black uppercase text-muted-foreground ml-2">Vermelhos</span><input type="number" value={formEstatistica.cartoes_vermelhos} onChange={(e) => setFormEstatistica({ ...formEstatistica, cartoes_vermelhos: Number(e.target.value) })} className={inputClass} /></div>
            </div>
            <button onClick={() => handleAction('estatistica', 'POST', undefined, { jogador_id: Number(id), temporada: formEstatistica.temporada, clube_id: formEstatistica.clube_id ? Number(formEstatistica.clube_id) : null, partidas_jogadas: formEstatistica.partidas_jogadas, gols: formEstatistica.gols, assistencias: formEstatistica.assistencias, faltas_cometidas: formEstatistica.faltas_cometidas, cartoes_amarelos: formEstatistica.cartoes_amarelos, cartoes_vermelhos: formEstatistica.cartoes_vermelhos })} className="h-16 w-full rounded-2xl bg-primary text-primary-foreground font-black uppercase text-sm shadow-2xl">Salvar Estatísticas</button>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {jogador.estatisticas_gerais && jogador.estatisticas_gerais.length > 0 ? (
            jogador.estatisticas_gerais.map((est: any) => {
              const clubeNome = est.clube_id ? clubes?.find(c => c.id === est.clube_id)?.nome : "Geral";
              return (
                <div key={est.id} className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[2.5rem] bg-secundary/5 border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary/80"></div>

                  <div className="flex flex-col pl-4">
                    <span className="text-sm font-black text-primary uppercase tracking-[0.2em]">{est.temporada}</span>
                    <span className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none mt-1">{clubeNome}</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-8 gap-y-4 md:flex-1 md:justify-end">
                    <StatMini label="Jogos" value={est.partidas_jogadas} />
                    <StatMini label="Gols" value={est.gols} />
                    <StatMini label="Assists" value={est.assistencias} />
                    <StatMini label="Faltas" value={est.faltas_cometidas} />
                    <StatMini label="Amarelos" value={est.cartoes_amarelos} />
                    <StatMini label="Vermelhos" value={est.cartoes_vermelhos} />
                  </div>

                  <button onClick={() => setDeleteData({ id: est.id, type: 'estatistica' })} className="absolute top-4 right-4 h-12 w-12 flex items-center justify-center rounded-xl text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shadow-sm"><Trash2 className="h-5 w-5" /></button>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted-foreground font-medium italic opacity-40">Nenhuma estatística registrada.</div>
          )}
        </div>
      </div>

      {/* Media & Scouting Notes */}
      {(jogador.video || jogador.observacoes) && (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 px-2">
          {jogador.video && (
            <div className="rounded-[3rem] border border-border bg-card p-12 flex flex-col gap-8 shadow-sm">
              <h3 className="text-3xl font-black flex items-center gap-5 uppercase tracking-tighter"><PlayCircle className="h-10 w-10 text-primary" /> Highlights</h3>
              <a href={jogador.video} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-5 h-20 w-full rounded-[1.5rem] bg-secondary text-secondary-foreground font-black uppercase tracking-[0.3em] text-sm hover:bg-secondary/80 transition-all shadow-xl active:scale-95">Abrir Scout Vídeo</a>
            </div>
          )}
          {jogador.observacoes && (
            <div className="rounded-[3rem] border border-border bg-card p-12 flex flex-col gap-8 shadow-sm">
              <h3 className="text-3xl font-black flex items-center gap-5 uppercase tracking-tighter"><Notebook className="h-10 w-10 text-primary" /> Scout Pro</h3>
              <div className="p-8 rounded-[2rem] bg-muted/30 border border-border/50 text-lg font-medium text-muted-foreground leading-relaxed italic shadow-inner">
                "{jogador.observacoes}"
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 px-2">
        {/* Atributos Section */}
        <div className="rounded-[3rem] border border-border bg-card p-12 shadow-sm relative overflow-hidden">
          <div className="mb-12 flex items-center justify-between">
            <h3 className="text-3xl font-black flex items-center gap-5 uppercase tracking-tighter"><Star className="h-10 w-10 text-primary" /> Atributos</h3>
            <button onClick={() => setShowAddCaracteristica(!showAddCaracteristica)} className="h-14 px-8 rounded-2xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all">+ Novo</button>
          </div>
          {showAddCaracteristica && (
            <div className="mb-12 p-10 bg-muted/40 rounded-[2.5rem] border border-border flex flex-col gap-6 animate-in slide-in-from-top-4 duration-500 shadow-xl">
              <div className="flex gap-5">
                <input value={formCaracteristica.descricao} onChange={(e) => setFormCaracteristica({ ...formCaracteristica, descricao: e.target.value })} onBlur={(e) => setFormCaracteristica({ ...formCaracteristica, descricao: capitalizeName(e.target.value) })} placeholder="Atributo" className={`${inputClass} flex-1`} />
                <input type="number" min="1" max="10" value={formCaracteristica.nota} onChange={(e) => setFormCaracteristica({ ...formCaracteristica, nota: Number(e.target.value) || 0 })} className={`${inputClass} w-32 text-center font-black text-3xl`} />
              </div>
              <button onClick={() => handleAction('caracteristica', 'POST', undefined, { jogador_id: Number(id), descricao: formatCharacteristic(capitalizeName(formCaracteristica.descricao), formCaracteristica.nota) })} disabled={!formCaracteristica.descricao || loadingAction} className="h-16 w-full rounded-2xl bg-primary text-primary-foreground font-black uppercase text-sm shadow-2xl shadow-primary/20">Confirmar Atributo</button>
            </div>
          )}
          {radarData.length > 0 && (
            <div className="h-[450px] w-full mb-12 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                  <PolarGrid stroke="hsl(var(--border))" strokeDasharray="5 5" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 900 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} strokeWidth={8} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4">
            {jogador.caracteristicas?.map((c: any) => (
              <div key={c.id} className="group flex justify-between items-center bg-muted/30 p-8 rounded-[2rem] border border-transparent hover:border-border hover:bg-muted/50 transition-all">
                <div className="flex items-center gap-6">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${parseCharacteristic(c.descricao).nota >= 8 ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`}>
                    {parseCharacteristic(c.descricao).nota}
                  </div>
                  <span className="font-black text-foreground uppercase tracking-tight text-xl">{parseCharacteristic(c.descricao).descricao}</span>
                </div>
                <button onClick={() => setDeleteData({ id: c.id, type: 'caracteristica' })} className="h-12 w-12 flex items-center justify-center rounded-2xl text-muted-foreground/20 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shadow-sm"><Trash2 className="h-6 w-6" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Historico, Titulos & DM Column */}
        <div className="flex flex-col gap-10">
          {/* Carreira Section */}
          <div className="rounded-[3rem] border border-border bg-card p-12 shadow-sm">
            <div className="mb-12 flex items-center justify-between">
              <h3 className="text-3xl font-black flex items-center gap-5 uppercase tracking-tighter"><Building2 className="h-10 w-10 text-primary" /> Carreira</h3>
              <button onClick={() => setShowAddClube(!showAddClube)} className="h-14 px-8 rounded-2xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all">+ Add</button>
            </div>
            {showAddClube && (
              <div className="mb-10 p-10 bg-muted/40 rounded-[2.5rem] border border-border space-y-6 animate-in slide-in-from-top-4 duration-500 shadow-xl">
                <select value={formClube.clube_id} onChange={(e) => setFormClube({ ...formClube, clube_id: e.target.value })} className={`${inputClass} w-full`}>
                  <option value="">Selecione o Clube</option>
                  {clubes?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-5">
                  <input type="number" placeholder="Início" value={formClube.data_entrada} onChange={(e) => setFormClube({ ...formClube, data_entrada: e.target.value })} className={inputClass} />
                  <input type="number" placeholder="Saída" value={formClube.data_saida} onChange={(e) => setFormClube({ ...formClube, data_saida: e.target.value })} className={inputClass} />
                  <input type="number" placeholder="Jogos" value={formClube.jogos} onChange={(e) => setFormClube({ ...formClube, jogos: e.target.value })} className={inputClass} />
                  <select value={formClube.categoria} onChange={(e) => setFormClube({ ...formClube, categoria: e.target.value })} className={inputClass}>
                    <option value="Base">Base</option>
                    <option value="Profissional">Profissional</option>
                  </select>
                </div>
                <button onClick={() => handleAction('clube', 'POST', undefined, { jogador_id: Number(id), clube_id: Number(formClube.clube_id), data_entrada: Number(formClube.data_entrada), data_saida: formClube.data_saida ? Number(formClube.data_saida) : null, jogos: Number(formClube.jogos), categoria: formClube.categoria })} className="h-16 w-full rounded-2xl bg-primary text-primary-foreground font-black uppercase text-sm shadow-2xl">Salvar Passagem</button>
              </div>
            )}
            <div className="space-y-6">
              {jogador.historico_clubes?.map((h: any) => {
                const clubeLogo = (h.clube?.logos && h.clube.logos.length > 0) ? h.clube.logos[0].url_logo : null;
                return (
                  <div key={h.id} className="group flex items-center gap-8 p-8 rounded-[2.5rem] bg-muted/20 border border-transparent hover:border-border hover:shadow-2xl transition-all">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-card border border-border shadow-inner overflow-hidden p-4 transition-transform group-hover:scale-110">
                      {clubeLogo ? <img src={`${API_URL}/files/${clubeLogo}`} className="h-full w-full object-contain" crossOrigin="anonymous" /> : <Building2 className="h-12 w-12 text-muted-foreground/20" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-2xl text-foreground uppercase tracking-tighter mb-2 leading-none">{h.clube?.nome}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">{h.categoria}</span>
                        <span className="text-sm font-bold text-muted-foreground uppercase opacity-40">{h.data_entrada} — {h.data_saida || "ATUAL"} • {h.jogos} JOGOS</span>
                      </div>
                    </div>
                    <button onClick={() => setDeleteData({ id: h.id, type: 'clube' })} className="h-14 w-14 flex items-center justify-center rounded-2xl text-muted-foreground/20 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all shadow-sm"><Trash2 className="h-6 w-6" /></button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conquistas (Títulos) Section */}
          <div className="rounded-[3rem] border border-border bg-card p-12 shadow-sm">
            <h3 className="text-3xl font-black flex items-center gap-5 uppercase tracking-tighter mb-12">
              <Trophy className="h-10 w-10 text-primary" /> Conquistas
            </h3>
            <div className="space-y-4">
              {jogador.titulos && jogador.titulos.length > 0 ? (
                jogador.titulos.map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between rounded-[1.5rem] bg-primary/5 p-6 border border-primary/10 shadow-sm transition-all hover:bg-primary/10">
                    <div>
                      <p className="font-black text-2xl text-foreground uppercase tracking-tighter leading-none mb-1">
                        {t.titulo?.nome}
                      </p>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                        {t.clube?.nome || "Individual"}
                      </p>
                    </div>
                    <div className="bg-primary text-primary-foreground font-black text-sm px-6 py-3 rounded-2xl shadow-lg shadow-primary/20 tracking-widest">
                      {t.ano}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground font-medium italic opacity-40">Nenhuma conquista registrada até o momento.</p>
                </div>
              )}
            </div>
          </div>

          {/* Departamento Médico Section */}
          <div className="rounded-[3rem] border border-border bg-card p-12 shadow-sm">
            <div className="mb-12 flex items-center justify-between">
              <h3 className="text-3xl font-black flex items-center gap-5 uppercase tracking-tighter text-destructive"><AlertTriangle className="h-10 w-10" /> Depto Médico</h3>
              <button onClick={() => setShowAddLesao(!showAddLesao)} className="h-14 px-8 rounded-2xl bg-destructive/10 text-destructive font-black text-xs uppercase tracking-widest hover:bg-destructive/20 transition-all">+ Add</button>
            </div>
            {showAddLesao && (
              <div className="mb-10 p-10 bg-destructive/5 rounded-[2.5rem] border border-destructive/10 space-y-6 animate-in slide-in-from-top-4 duration-500 shadow-xl">
                <input value={formLesao.tipo_lesao} onChange={(e) => setFormLesao({ ...formLesao, tipo_lesao: e.target.value })} placeholder="Tipo de Lesão" className={`${inputClass} w-full`} onBlur={() => setFormLesao({ ...formLesao, tipo_lesao: simpleCapitalize(formLesao.tipo_lesao) })} />
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2"><span className="text-[10px] font-black uppercase text-destructive ml-2">Início</span><input type="date" value={formLesao.data_inicio} onChange={(e) => setFormLesao({ ...formLesao, data_inicio: e.target.value })} className={inputClass} /></div>
                  <div className="flex flex-col gap-2"><span className="text-[10px] font-black uppercase text-destructive ml-2">Retorno</span><input type="date" value={formLesao.data_retorno} onChange={(e) => setFormLesao({ ...formLesao, data_retorno: e.target.value })} className={inputClass} /></div>
                </div>
                <textarea value={formLesao.descricao} onChange={(e) => setFormLesao({ ...formLesao, descricao: e.target.value })} placeholder="Notas clínicas..." className="min-h-32 w-full rounded-[1.5rem] border border-input bg-background p-6 text-base outline-none focus:ring-2 focus:ring-destructive/20" />
                <button onClick={() => handleAction('lesao', 'POST', undefined, { jogador_id: Number(id), tipo_lesao: formLesao.tipo_lesao, data_inicio: formLesao.data_inicio, data_retorno: formLesao.data_retorno || null, descricao: formLesao.descricao })} className="h-16 w-full rounded-2xl bg-destructive text-white font-black uppercase text-sm shadow-2xl">Finalizar Relatório</button>
              </div>
            )}
            <div className="space-y-6">
              {jogador.lesoes?.map((l: any) => (
                <div key={l.id} className="group flex flex-col gap-4 p-8 rounded-[2.5rem] bg-destructive/5 border border-transparent hover:border-destructive/20 transition-all relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-2xl text-destructive uppercase tracking-tighter leading-none mb-2">{l.tipo_lesao}</p>
                      <p className="text-sm font-bold text-muted-foreground uppercase opacity-40" suppressHydrationWarning>{formatDate(l.data_inicio)} — {l.data_retorno ? formatDate(l.data_retorno) : "EM RECUPERAÇÃO"}</p>
                    </div>
                    <button onClick={() => setDeleteData({ id: l.id, type: 'lesao' })} className="h-12 w-12 flex items-center justify-center rounded-xl text-destructive/20 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all absolute top-4 right-4"><Trash2 className="h-5 w-5" /></button>
                  </div>
                  {l.descricao && <div className="p-5 rounded-2xl bg-card border border-border shadow-inner text-sm font-medium text-muted-foreground/80 leading-relaxed italic">{l.descricao}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog isOpen={deleteData !== null} title="Confirmar Remoção" message="Você está prestes a apagar permanentemente este registro da ficha oficial do atleta." confirmLabel="Excluir Agora" onConfirm={() => deleteData && handleAction(deleteData.type, 'DELETE', deleteData.id)} onCancel={() => setDeleteData(null)} loading={loadingAction} />

      <PDFModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        onConfirm={handleGeneratePDF}
        clubes={clubes || []}
        loading={isGeneratingPDF}
      />
    </div>
  );
}

function FichaItem({ icon: Icon, label, value, badge }: any) {
  return (
    <div className="flex flex-col gap-3 group">
      <div className="flex items-center gap-3 text-muted-foreground/40 group-hover:text-primary transition-colors">
        <Icon className="h-6 w-6" />
        <span className="text-[11px] font-black uppercase tracking-[0.4em] leading-none">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-xl font-black text-foreground tracking-tight leading-none uppercase">{value}</p>
        {badge && <img src={`${API_URL}/files/${badge}`} className="h-5 w-8 object-cover rounded-sm shadow-lg border border-border/50" crossOrigin="anonymous" />}
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color }: any) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-[3rem] border border-border bg-card p-12 shadow-sm transition-all hover:border-primary/40 hover:-translate-y-4 hover:shadow-2xl">
      <div className={`p-6 rounded-[2rem] bg-muted/50 ${color} shadow-inner`}>
        <Icon className="h-10 w-10" />
      </div>
      <div className="text-center">
        <span className="block text-7xl font-black text-foreground tracking-tighter mb-2 leading-none">{value}</span>
        <span className="block text-xs font-black uppercase tracking-[0.5em] text-muted-foreground opacity-30">{label}</span>
      </div>
    </div>
  );
}

function StatMini({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">{label}</span>
      <span className="text-2xl font-black text-foreground">{value}</span>
    </div>
  );
}