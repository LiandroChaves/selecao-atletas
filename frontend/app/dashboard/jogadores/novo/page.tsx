"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { ArrowLeft, Upload, Loader2, Plus, Video, Notebook } from "lucide-react";
import Link from "next/link";
import type { Posicao, NivelAmbidestria, Clube, Pais, Estado, Cidade } from "@/types";
import { capitalizeName } from "@/lib/utils";

export default function NovoJogadorPage() {
  const router = useRouter();
  const { data: posicoes } = useSWR<Posicao[]>("/configuracoes/posicoes", fetcher);
  const { data: ambidestria } = useSWR<NivelAmbidestria[]>("/configuracoes/ambidestria", fetcher);
  const { data: clubes } = useSWR<Clube[]>("/clubes", fetcher);
  const { data: paises } = useSWR<Pais[]>("/localidades/paises", fetcher);
  const { data: estados } = useSWR<Estado[]>("/localidades/estados", fetcher);
  const { data: cidades } = useSWR<Cidade[]>("/localidades/cidades", fetcher);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [nomeCurto, setNomeCurto] = useState("");
  const [apelido, setApelido] = useState("");

  const [selectedPais, setSelectedPais] = useState<string>("");
  const [selectedEstado, setSelectedEstado] = useState<string>("");

  const filteredEstados = estados?.filter(e => String(e.pais_id) === selectedPais) || [];
  const filteredCidades = cidades?.filter(c => String(c.estado_id) === selectedEstado) || [];

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set("nome", nome.trim());
      fd.set("nome_curto", nomeCurto.trim());
      fd.set("apelido", apelido.trim());
      if (foto) fd.set("foto", foto);

      await apiFetch("/jogadores", { method: "POST", body: fd });
      router.push("/dashboard/jogadores");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar jogador");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "h-12 rounded-xl border border-input bg-background px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all";
  const labelClass = "text-sm font-bold text-foreground ml-1";

  return (
    <div className="mx-auto max-w-4xl mb-12">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/dashboard/jogadores" className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-accent transition-all shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Novo Atleta</h1>
          <p className="text-base text-muted-foreground">Registre o perfil completo do novo jogador</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive border border-destructive/20">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 shadow-md">
        <div className="flex flex-col items-center gap-4">
          <label htmlFor="fotoInput" className="flex h-36 w-36 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-dashed border-border bg-muted hover:border-primary transition-all shadow-inner group">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </label>
          <input id="fotoInput" type="file" accept="image/*" className="hidden" onChange={handleFoto} />
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Foto do Perfil</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
            <label className={labelClass}>Nome Completo *</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} onBlur={(e) => setNome(capitalizeName(e.target.value))} required className={inputClass} placeholder="Nome completo do atleta" />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Nome na Camisa</label>
            <input value={nomeCurto} onChange={(e) => setNomeCurto(e.target.value)} onBlur={(e) => setNomeCurto(capitalizeName(e.target.value))} className={inputClass} placeholder="Ex: R. Gaúcho" />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Apelido</label>
            <input value={apelido} onChange={(e) => setApelido(e.target.value)} onBlur={(e) => setApelido(capitalizeName(e.target.value))} className={inputClass} placeholder="Ex: Fenômeno" />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Data de Nascimento</label>
            <input name="data_nascimento" type="date" className={inputClass} />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Pé Dominante *</label>
            <select name="pe_dominante" required className={inputClass}>
              <option value="">Selecione</option>
              <option value="D">Direito</option>
              <option value="E">Esquerdo</option>
              <option value="A">Ambidestro</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Posição Principal *</label>
            <select name="posicao_id" required className={inputClass}>
              <option value="">Selecione</option>
              {posicoes?.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Posição Secundária</label>
            <select name="posicao_secundaria_id" className={inputClass}>
              <option value="">Nenhuma</option>
              {posicoes?.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Nível de Ambidestria *</label>
            <select name="nivel_ambidestria_id" required className={inputClass}>
              <option value="">Selecione</option>
              {ambidestria?.map((a) => <option key={a.id} value={a.id}>{a.descricao}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Clube Atual</label>
            <select name="clube_atual_id" className={inputClass}>
              <option value="">Sem clube</option>
              {clubes?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Altura (m)</label>
            <input name="altura" type="number" step="0.01" className={inputClass} placeholder="1.80" />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Peso (kg)</label>
            <input name="peso" type="number" step="0.1" className={inputClass} placeholder="75.0" />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>País</label>
            <select name="pais_id" value={selectedPais} onChange={(e) => { setSelectedPais(e.target.value); setSelectedEstado(""); }} className={inputClass}>
              <option value="">Selecione</option>
              {paises?.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Estado</label>
            <select name="estado_id" value={selectedEstado} onChange={(e) => setSelectedEstado(e.target.value)} disabled={!selectedPais} className={inputClass}>
              <option value="">Selecione</option>
              {filteredEstados.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Cidade</label>
            <select name="cidade_id" disabled={!selectedEstado} className={inputClass}>
              <option value="">Selecione</option>
              {filteredCidades.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
            <label className={labelClass}>Link de Vídeo (Highlights)</label>
            <div className="relative">
              <Video className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
              <input name="video" type="url" className={`${inputClass} pl-12 w-full`} placeholder="https://youtube.com/watch?v=..." />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
            <label className={labelClass}>Observações Técnicas</label>
            <div className="relative">
              <Notebook className="absolute left-4 top-4 h-5 w-5 text-muted-foreground/50" />
              <textarea name="observacoes" className="min-h-32 w-full rounded-xl border border-input bg-background pl-12 pr-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" placeholder="Anotações sobre comportamento, potencial e técnica..." />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="flex h-14 items-center justify-center gap-3 rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:opacity-50">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          Cadastrar Atleta
        </button>
      </form>
    </div>
  );
}