"use client";

import { use, useState } from "react";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { generatePlayerPDF } from "@/lib/pdf";
import type { Jogador, Clube } from "@/types";
import { calcAge, formatDate, API_URL, parseCharacteristic, formatCharacteristic, simpleCapitalize, capitalizeName } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeft, FileDown, Pencil, User, Calendar, Ruler, Weight, Footprints,
  Trophy, Activity, Building2, AlertTriangle, Star, PlayCircle, Notebook,
  Globe, Trash2, ChevronLeft, ChevronRight
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from "recharts";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PDFModal } from "@/components/pdf-modal";
import type { PDFOptions } from "@/types";

export default function JogadorPerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: jogador, isLoading, error: loadError, mutate } = useSWR<any>(`/jogadores/${id}`, fetcher);
  const { data: clubes } = useSWR<Clube[]>("/clubes", fetcher);

  // Estados de Paginação
  const [pageAttr, setPageAttr] = useState(0);
  const [pageClube, setPageClube] = useState(0);
  const [pageTrophy, setPageTrophy] = useState(0);
  const [pageLesao, setPageLesao] = useState(0);

  // Estados de Exibição dos Formulários
  const [showAddCaracteristica, setShowAddCaracteristica] = useState(false);
  const [showAddClube, setShowAddClube] = useState(false);
  const [showAddLesao, setShowAddLesao] = useState(false);
  const [showAddEstatistica, setShowAddEstatistica] = useState(false);

  const [deleteData, setDeleteData] = useState<{ id: number, type: 'caracteristica' | 'clube' | 'lesao' | 'estatistica' } | null>(null);

  // Estados dos Formulários
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

  function SocialLink({ href, icon, color }: { href?: string, icon: React.ReactNode, color: string }) {
    if (!href) return (
      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/20 text-muted-foreground/20 cursor-not-allowed">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">{icon}</svg>
      </div>
    );

    return (
      <a href={href} target="_blank" rel="noreferrer" className={`h-10 w-10 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground transition-all hover:text-white shadow-sm active:scale-90 ${color}`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">{icon}</svg>
      </a>
    );
  }

  async function handleAction(type: 'caracteristica' | 'clube' | 'lesao' | 'estatistica', method: 'POST' | 'PUT' | 'DELETE', actionId?: number, bodyData?: any) {
    setLoadingAction(true);
    let url = `/historicos/${type}`;
    if (actionId) url += `/${actionId}`;
    try {
      await apiFetch(url, { method, body: bodyData ? JSON.stringify(bodyData) : undefined });
      mutate();
      if (method === 'POST') {
        if (type === 'caracteristica') { setShowAddCaracteristica(false); setFormCaracteristica({ descricao: "", nota: 5 }); }
        if (type === 'clube') { setShowAddClube(false); setFormClube({ clube_id: "", data_entrada: "", data_saida: "", jogos: "", categoria: "Profissional" }); }
        if (type === 'lesao') { setShowAddLesao(false); setFormLesao({ tipo_lesao: "", data_inicio: "", data_retorno: "", descricao: "" }); }
        if (type === 'estatistica') { setShowAddEstatistica(false); setFormEstatistica({ temporada: "", clube_id: "", partidas_jogadas: 0, gols: 0, assistencias: 0, faltas_cometidas: 0, cartoes_amarelos: 0, cartoes_vermelhos: 0 }); }
      }
      setDeleteData(null);
    } catch (err) { console.error(err); } finally { setLoadingAction(false); }
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-6xl p-10 text-center">
        <div className="rounded-[2rem] border border-destructive/20 bg-destructive/10 p-12 text-destructive shadow-xl">
          <AlertTriangle className="mx-auto mb-6 h-16 w-16 opacity-80" />
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Erro ao carregar atleta</h2>
          <p className="opacity-80 font-medium">Não foi possível carregar os dados deste jogador.</p>
        </div>
      </div>
    );
  }

  if (isLoading || !jogador) return <div className="p-10 animate-pulse text-center font-black">CARREGANDO FICHA DO ATLETA...</div>;

  const age = calcAge(jogador.data_nascimento);
  const radarData = jogador.caracteristicas?.map((c: any) => {
    const { descricao, nota } = parseCharacteristic(c.descricao);
    return { subject: descricao.toUpperCase(), value: nota, fullMark: 10 };
  }) ?? [];

  const inputClass = "h-12 rounded-2xl border border-input bg-background px-4 text-base focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-inner";

  const paginate = (data: any[], current: number, size: number) => data?.slice(current * size, (current + 1) * size) || [];
  const hasNext = (data: any[], current: number, size: number) => data && (current + 1) * size < data.length;

  return (
    <div className="flex flex-col gap-10 pb-20 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard/jogadores" className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card hover:bg-accent transition-all shadow-sm">
            <ArrowLeft className="h-8 w-8" />
          </Link>
          <div>
            <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">Perfil do Atleta</h1>
            <p className="text-xs font-black text-muted-foreground tracking-[0.5em] uppercase opacity-40 mt-3">Elite Data Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/jogadores/${id}/editar`} className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-card px-8 text-sm font-black uppercase tracking-widest hover:bg-accent transition-all shadow-sm">
            <Pencil className="h-5 w-5" /> Editar
          </Link>
          <button onClick={() => setIsPDFModalOpen(true)} className="flex h-14 items-center gap-3 rounded-2xl bg-primary px-8 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all">
            <FileDown className="h-5 w-5" /> PDF
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="overflow-hidden rounded-[3.5rem] border border-border bg-card shadow-2xl">
        <div className="h-4 bg-primary/90 w-full" />
        <div className="flex flex-col gap-16 p-14 md:flex-row lg:items-center">

          {/* COLUNA DA FOTO + REDES SOCIAIS */}
          <div className="flex flex-col items-center gap-6 mx-auto md:mx-0">
            <div className="relative">
              <div className="flex h-72 w-72 shrink-0 items-center justify-center overflow-hidden rounded-[3.5rem] bg-muted border-4 border-card shadow-2xl">
                {jogador.foto ? (
                  <img src={`${API_URL}/files/${jogador.foto}`} alt={jogador.nome} className="h-full w-full object-cover" crossOrigin="anonymous" />
                ) : (
                  <User className="h-32 w-32 text-muted-foreground/10" />
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-primary shadow-2xl border-4 border-card">
                <Trophy className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-[1.5rem] border border-border/50 shadow-inner">
              <SocialLink
                href={jogador.whatsapp ? `https://wa.me/${jogador.whatsapp.replace(/\D/g, "")}` : ""}
                color="hover:bg-green-500"
                icon={<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 4.754a8.117 8.117 0 01-3.882-1.012l-.278-.165-2.885.758.77-2.812-.181-.288a8.13 8.13 0 01-1.248-4.302c0-4.492 3.655-8.147 8.147-8.147 2.176 0 4.223.846 5.761 2.383 1.538 1.538 2.383 3.584 2.383 5.764 0 4.493-3.655 8.148-8.147 8.148m8.129-17.147A11.36 11.36 0 0012.65 0C5.682 0 0 5.682 0 12.65c0 2.223.579 4.391 1.677 6.29L0 24l5.25-1.378a11.31 11.31 0 005.4 1.378c6.968 0 12.65-5.682 12.65-12.65 0-3.374-1.312-6.544-3.696-8.928" />}
              />
              <SocialLink href={jogador.instagram} color="hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" icon={<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.688.072 4.948.072s3.667-.014 4.947-.072c4.351-.2 6.78-2.618 6.98-6.98.058-1.28.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.352-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />} />
              <SocialLink href={jogador.twitter} color="hover:bg-black" icon={<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />} />
              <SocialLink href={jogador.facebook} color="hover:bg-[#1877F2]" icon={<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />} />
              <SocialLink href={jogador.tiktok} color="hover:bg-[#000000]" icon={<path d="M12.525.02c1.31-.032 2.612.019 3.847.163.085 1.6.563 3.067 1.575 4.331.416.513.912.967 1.445 1.362a9.354 9.354 0 002.593 1.27l.012 3.412a9.23 9.23 0 01-5.293-1.588v7.469c0 3.967-3.232 7.147-7.272 7.147-3.93 0-7.269-3.15-7.269-7.147s3.339-7.147 7.269-7.147c.305 0 .61.019.912.057V12.7c-.3-.024-.602-.036-.912-.036-2.033 0-3.666 1.583-3.666 3.535 0 1.951 1.633 3.535 3.666 3.535s3.666-1.584 3.666-3.535v-16.2z" />} />
            </div>
          </div>

          {/* LADO DIREITO (INFO DO ATLETA) */}
          <div className="flex flex-1 flex-col gap-10 text-center md:text-left">
            <div>
              <h2 className="text-7xl font-black text-foreground tracking-tighter mb-4 leading-none">{jogador.nome}</h2>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                <span className="rounded-2xl bg-primary/10 px-8 py-3 text-sm font-black text-primary uppercase tracking-[0.2em] border border-primary/20">
                  {jogador.posicao_principal?.nome}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-12 gap-x-16 text-sm sm:grid-cols-3 border-t border-border/50 pt-12">
              <FichaItem icon={Calendar} label="Idade" value={`${age} ANOS (${formatDate(jogador.data_nascimento)})`} />
              <FichaItem icon={Building2} label="Vínculo Atual" value={jogador.clube_atual?.nome || "JOGADOR LIVRE"} />
              <FichaItem icon={Globe} label="Naturalidade" value={`${jogador.cidade?.nome || ""}, ${jogador.estado?.uf || ""} - ${jogador.pais?.nome || ""}`} badge={jogador.pais?.bandeira?.logo_bandeira} />
              <FichaItem icon={Ruler} label="Altura" value={`${jogador.altura}M`} />
              <FichaItem icon={Weight} label="Peso" value={`${jogador.peso}KG`} />
              <FichaItem icon={Footprints} label="Pé Dominante" value={jogador.pe_dominante === 'D' ? 'DESTRO' : 'CANHOTO'} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Simétrico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Lado Esquerdo: Atributos & Scout */}
        <div className="flex flex-col gap-8">
          <div className="rounded-[3rem] border border-border bg-card p-10 shadow-sm flex flex-col h-full">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter"><Star className="h-8 w-8 text-primary" /> Atributos</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setPageAttr(p => Math.max(0, p - 1))} className="p-2 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => hasNext(jogador.caracteristicas, pageAttr, 3) && setPageAttr(p => p + 1)} className="p-2 rounded-lg hover:bg-muted transition-colors"><ChevronRight className="h-5 w-5" /></button>
                <button onClick={() => setShowAddCaracteristica(!showAddCaracteristica)} className="h-10 px-4 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase">+ Add</button>
              </div>
            </div>

            {/* FORMULÁRIO DE ATRIBUTO RESTAURADO AQUI */}
            {showAddCaracteristica && (
              <div className="mb-8 p-8 bg-muted/40 rounded-[2rem] border border-border flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
                <div className="flex gap-4">
                  <input value={formCaracteristica.descricao} onChange={(e) => setFormCaracteristica({ ...formCaracteristica, descricao: e.target.value })} onBlur={(e) => setFormCaracteristica({ ...formCaracteristica, descricao: capitalizeName(e.target.value) })} placeholder="Ex: Chute de Longa Distância" className={`${inputClass} flex-1`} />
                  <input type="number" min="1" max="10" value={formCaracteristica.nota} onChange={(e) => setFormCaracteristica({ ...formCaracteristica, nota: Number(e.target.value) || 0 })} className={`${inputClass} w-24 text-center font-black text-xl`} />
                </div>
                <button onClick={() => handleAction('caracteristica', 'POST', undefined, { jogador_id: Number(id), descricao: formatCharacteristic(capitalizeName(formCaracteristica.descricao), formCaracteristica.nota) })} disabled={!formCaracteristica.descricao || loadingAction} className="h-12 w-full rounded-xl bg-primary text-primary-foreground font-black uppercase text-xs shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">Confirmar Atributo</button>
              </div>
            )}

            {radarData.length > 0 && (
              <div className="h-72 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 900 }} />
                    <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} strokeWidth={4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {paginate(jogador.caracteristicas, pageAttr, 3).map((c: any) => (
                <div key={c.id} className="flex justify-between items-center bg-muted/30 p-5 rounded-2xl border border-transparent hover:border-border transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center font-black text-primary-foreground text-xl shadow-lg">{parseCharacteristic(c.descricao).nota}</div>
                    <span className="font-black text-foreground uppercase text-base">{parseCharacteristic(c.descricao).descricao}</span>
                  </div>
                  <button onClick={() => setDeleteData({ id: c.id, type: 'caracteristica' })} className="text-destructive/20 hover:text-destructive transition-colors"><Trash2 className="h-5 w-5" /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[3rem] border border-border bg-card p-10 shadow-sm">
            <h3 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter mb-8"><Notebook className="h-8 w-8 text-primary" /> Scout Pro</h3>
            <div className="p-8 rounded-[2rem] bg-muted/30 border border-border/50 text-lg font-medium text-muted-foreground leading-relaxed italic shadow-inner">
              {jogador.observacoes ? `"${jogador.observacoes}"` : "Sem notas técnicas registradas."}
            </div>
            {jogador.video && (
              <a href={jogador.video} target="_blank" rel="noreferrer" className="mt-8 flex items-center justify-center gap-4 h-16 w-full rounded-2xl bg-secondary text-secondary-foreground font-black uppercase tracking-widest hover:bg-secondary/80 transition-all shadow-xl active:scale-95">
                <PlayCircle className="h-6 w-6" /> Abrir Scout Vídeo
              </a>
            )}
          </div>
        </div>

        {/* Lado Direito: Carreira, Conquistas & DM */}
        <div className="flex flex-col gap-8">
          {/* Carreira */}
          <div className="rounded-[3rem] border border-border bg-card p-10 shadow-sm flex-1">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter"><Building2 className="h-8 w-8 text-primary" /> Carreira</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setPageClube(p => Math.max(0, p - 1))} className="p-2 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => hasNext(jogador.historico_clubes, pageClube, 3) && setPageClube(p => p + 1)} className="p-2 rounded-lg hover:bg-muted transition-colors"><ChevronRight className="h-5 w-5" /></button>
                <button onClick={() => setShowAddClube(!showAddClube)} className="h-10 px-4 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase">+ Add</button>
              </div>
            </div>

            {/* FORMULÁRIO DE CARREIRA RESTAURADO */}
            {showAddClube && (
              <div className="mb-8 p-8 bg-muted/40 rounded-[2rem] border border-border flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
                <select value={formClube.clube_id} onChange={(e) => setFormClube({ ...formClube, clube_id: e.target.value })} className={`${inputClass} w-full`}>
                  <option value="">Selecione o Clube</option>
                  {clubes?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Início" value={formClube.data_entrada} onChange={(e) => setFormClube({ ...formClube, data_entrada: e.target.value })} className={inputClass} />
                  <input type="number" placeholder="Saída" value={formClube.data_saida} onChange={(e) => setFormClube({ ...formClube, data_saida: e.target.value })} className={inputClass} />
                  <input type="number" placeholder="Jogos" value={formClube.jogos} onChange={(e) => setFormClube({ ...formClube, jogos: e.target.value })} className={inputClass} />
                  <select value={formClube.categoria} onChange={(e) => setFormClube({ ...formClube, categoria: e.target.value })} className={inputClass}>
                    <option value="Base">Base</option>
                    <option value="Profissional">Profissional</option>
                  </select>
                </div>
                <button onClick={() => handleAction('clube', 'POST', undefined, { jogador_id: Number(id), clube_id: Number(formClube.clube_id), data_entrada: Number(formClube.data_entrada), data_saida: formClube.data_saida ? Number(formClube.data_saida) : null, jogos: Number(formClube.jogos), categoria: formClube.categoria })} className="h-12 w-full rounded-xl bg-primary text-primary-foreground font-black uppercase text-xs hover:bg-primary/90 transition-all shadow-md">Salvar Passagem</button>
              </div>
            )}

            <div className="space-y-4">
              {paginate(jogador.historico_clubes, pageClube, 3).map((h: any) => {
                const clubeLogo = (h.clube?.logos && h.clube.logos.length > 0) ? h.clube.logos[0].url_logo : null;
                return (
                  <div key={h.id} className="group flex items-center gap-5 p-5 rounded-[2rem] bg-muted/20 border border-transparent hover:border-border hover:shadow-xl transition-all">
                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-card border flex items-center justify-center p-3 shadow-inner overflow-hidden">
                      {clubeLogo ? <img src={`${API_URL}/files/${clubeLogo}`} className="h-full w-full object-contain" crossOrigin="anonymous" /> : <Building2 className="h-8 w-8 text-muted-foreground/10" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-lg text-foreground uppercase tracking-tight leading-none mb-1">{h.clube?.nome}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-primary uppercase bg-primary/5 px-2 py-1 rounded-md border border-primary/10">{h.categoria}</span>
                        <span className="text-xs font-bold text-muted-foreground uppercase opacity-50">{h.data_entrada} — {h.data_saida || "ATUAL"}</span>
                      </div>
                    </div>
                    <button onClick={() => setDeleteData({ id: h.id, type: 'clube' })} className="text-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="h-5 w-5" /></button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conquistas */}
          <div className="rounded-[3rem] border border-border bg-card p-10 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter"><Trophy className="h-8 w-8 text-primary" /> Conquistas</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setPageTrophy(p => Math.max(0, p - 1))} className="p-2 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => hasNext(jogador.titulos, pageTrophy, 3) && setPageTrophy(p => p + 1)} className="p-2 rounded-lg hover:bg-muted transition-colors"><ChevronRight className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="space-y-3">
              {paginate(jogador.titulos, pageTrophy, 3).map((t: any) => (
                <div key={t.id} className="flex items-center justify-between rounded-2xl bg-primary/5 p-5 border border-primary/10 transition-all hover:bg-primary/10">
                  <div className="flex-1">
                    <p className="font-black text-lg text-foreground uppercase leading-none mb-1">{t.titulo?.nome}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">{t.clube?.nome || "Individual"}</p>
                  </div>
                  <div className="bg-primary text-primary-foreground font-black text-xs px-4 py-2 rounded-xl shadow-lg">{t.ano}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Depto Médico */}
          <div className="rounded-[3rem] border border-border bg-card p-10 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter text-destructive"><AlertTriangle className="h-8 w-8" /> Depto Médico</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setPageLesao(p => Math.max(0, p - 1))} className="p-2 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => hasNext(jogador.lesoes, pageLesao, 2) && setPageLesao(p => p + 1)} className="p-2 rounded-lg hover:bg-muted transition-colors"><ChevronRight className="h-5 w-5" /></button>
                <button onClick={() => setShowAddLesao(!showAddLesao)} className="h-10 px-4 rounded-xl bg-destructive/10 text-destructive font-black text-xs uppercase">+ Add</button>
              </div>
            </div>

            {/* FORMULÁRIO DE LESÃO RESTAURADO */}
            {showAddLesao && (
              <div className="mb-8 p-8 bg-destructive/5 rounded-[2rem] border border-destructive/10 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
                <input value={formLesao.tipo_lesao} onChange={(e) => setFormLesao({ ...formLesao, tipo_lesao: e.target.value })} placeholder="Tipo de Lesão" className={`${inputClass} w-full`} onBlur={() => setFormLesao({ ...formLesao, tipo_lesao: simpleCapitalize(formLesao.tipo_lesao) })} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1"><span className="text-[10px] font-black uppercase text-destructive ml-2">Início</span><input type="date" value={formLesao.data_inicio} onChange={(e) => setFormLesao({ ...formLesao, data_inicio: e.target.value })} className={inputClass} /></div>
                  <div className="flex flex-col gap-1"><span className="text-[10px] font-black uppercase text-destructive ml-2">Retorno</span><input type="date" value={formLesao.data_retorno} onChange={(e) => setFormLesao({ ...formLesao, data_retorno: e.target.value })} className={inputClass} /></div>
                </div>
                <textarea value={formLesao.descricao} onChange={(e) => setFormLesao({ ...formLesao, descricao: e.target.value })} placeholder="Notas clínicas..." className="min-h-24 w-full rounded-xl border border-input bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-destructive/20" />
                <button onClick={() => handleAction('lesao', 'POST', undefined, { jogador_id: Number(id), tipo_lesao: formLesao.tipo_lesao, data_inicio: formLesao.data_inicio, data_retorno: formLesao.data_retorno || null, descricao: formLesao.descricao })} className="h-12 w-full rounded-xl bg-destructive text-white font-black uppercase text-xs hover:bg-destructive/90 transition-all shadow-md">Finalizar Relatório</button>
              </div>
            )}

            <div className="space-y-3">
              {paginate(jogador.lesoes, pageLesao, 2).map((l: any) => (
                <div key={l.id} className="p-6 rounded-[2rem] bg-destructive/5 border border-transparent hover:border-destructive/20 transition-all group relative">
                  <p className="font-black text-xl text-destructive uppercase leading-none mb-2">{l.tipo_lesao}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase opacity-50">{formatDate(l.data_inicio)} — {l.data_retorno ? formatDate(l.data_retorno) : "RECUPERANDO"}</p>
                  <button onClick={() => setDeleteData({ id: l.id, type: 'lesao' })} className="absolute top-4 right-4 text-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="rounded-[3rem] border border-border bg-card p-12 shadow-2xl mx-2">
        <div className="mb-12 flex items-center justify-between">
          <h3 className="text-3xl font-black flex items-center gap-5 uppercase tracking-tighter"><Activity className="h-10 w-10 text-primary" /> Histórico de Temporadas</h3>
          <button onClick={() => setShowAddEstatistica(!showAddEstatistica)} className="h-14 px-8 rounded-2xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary/20 transition-all">+ Novo Registro</button>
        </div>

        {/* FORMULÁRIO DE ESTATÍSTICA RESTAURADO */}
        {showAddEstatistica && (
          <div className="mb-10 p-10 bg-muted/40 rounded-[2.5rem] border border-border flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <input value={formEstatistica.temporada} onChange={(e) => setFormEstatistica({ ...formEstatistica, temporada: e.target.value })} placeholder="Temporada (Ex: 2024)" className={inputClass} />
              <select value={formEstatistica.clube_id} onChange={(e) => setFormEstatistica({ ...formEstatistica, clube_id: e.target.value })} className={inputClass}>
                <option value="">Geral / Sem Clube</option>
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
            <button onClick={() => handleAction('estatistica', 'POST', undefined, { jogador_id: Number(id), temporada: formEstatistica.temporada, clube_id: formEstatistica.clube_id ? Number(formEstatistica.clube_id) : null, partidas_jogadas: formEstatistica.partidas_jogadas, gols: formEstatistica.gols, assistencias: formEstatistica.assistencias, faltas_cometidas: formEstatistica.faltas_cometidas, cartoes_amarelos: formEstatistica.cartoes_amarelos, cartoes_vermelhos: formEstatistica.cartoes_vermelhos })} className="h-16 w-full rounded-2xl bg-primary text-primary-foreground font-black uppercase text-sm shadow-2xl hover:bg-primary/90 transition-all">Salvar Estatísticas</button>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {jogador.estatisticas_gerais && jogador.estatisticas_gerais.length > 0 ? (
            jogador.estatisticas_gerais.map((est: any) => {
              const clubeNome = est.clube_id ? clubes?.find(c => c.id === est.clube_id)?.nome : "Geral";
              return (
                <div key={est.id} className="group relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[2.5rem] bg-muted/20 border border-border hover:border-primary/20 transition-all overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary/80"></div>
                  <div className="flex flex-col pl-4">
                    <span className="text-sm font-black text-primary uppercase tracking-widest">{est.temporada}</span>
                    <span className="text-3xl font-black text-foreground tracking-tighter uppercase mt-1">
                      {clubeNome}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-8 gap-y-4 md:flex-1 md:justify-end">
                    <StatMini label="Jogos" value={est.partidas_jogadas} />
                    <StatMini label="Gols" value={est.gols} />
                    <StatMini label="Assists" value={est.assistencias} />
                    <StatMini label="Faltas" value={est.faltas_cometidas} />
                    <StatMini label="Amarelos" value={est.cartoes_amarelos} />
                    <StatMini label="Vermelhos" value={est.cartoes_vermelhos} />
                  </div>
                  <button onClick={() => setDeleteData({ id: est.id, type: 'estatistica' })} className="text-destructive hover:bg-destructive/10 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-10"><Trash2 className="h-5 w-5" /></button>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-muted-foreground font-medium italic opacity-40">Nenhuma estatística registrada.</div>
          )}
        </div>
      </div>

      <ConfirmDialog isOpen={deleteData !== null} title="Confirmar Remoção" message="Você está prestes a apagar este registro permanentemente." confirmLabel="Excluir" onConfirm={() => deleteData && handleAction(deleteData.type, 'DELETE', deleteData.id)} onCancel={() => setDeleteData(null)} loading={loadingAction} />
      <PDFModal isOpen={isPDFModalOpen} onClose={() => setIsPDFModalOpen(false)} onConfirm={handleGeneratePDF} clubes={clubes || []} loading={isGeneratingPDF} />
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

function StatMini({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{label}</span>
      <span className="text-2xl font-black text-foreground">{value}</span>
    </div>
  );
}