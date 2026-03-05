"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { ArrowLeft, Upload, Loader2, Save, Video, Notebook, MessageCircle, Instagram, Facebook, Twitter, Smartphone } from "lucide-react";
import Link from "next/link";
import type { Posicao, NivelAmbidestria, Clube, Pais, Cidade, Estado } from "@/types";
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

  // Estados controlados para formatação em tempo real
  const [nome, setNome] = useState("");
  const [nomeCurto, setNomeCurto] = useState("");
  const [apelido, setApelido] = useState("");
  const [video, setVideo] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Redes Sociais
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");

  // Localidade Cascata
  const [selectedPais, setSelectedPais] = useState<string>("");
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const filteredEstados = estados?.filter(e => String(e.pais_id) === selectedPais) || [];
  const filteredCidades = cidades?.filter(c => String(c.estado_id) === selectedEstado) || [];

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let res = "";
    if (digits.length > 0) res += "+" + digits.substring(0, 2);
    if (digits.length > 2) res += " (" + digits.substring(2, 4);
    if (digits.length > 4) res += ") " + digits.substring(4, 5);
    if (digits.length > 5) res += "." + digits.substring(5, 9);
    if (digits.length > 9) res += "-" + digits.substring(9, 13);
    return res;
  };

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

      // Tratamento e Formatação
      fd.set("nome", capitalizeName(nome.trim()));
      fd.set("nome_curto", capitalizeName(nomeCurto.trim()));
      fd.set("apelido", capitalizeName(apelido.trim()));
      fd.set("video", video.trim());
      fd.set("observacoes", observacoes.trim());

      fd.set("whatsapp", whatsapp);
      fd.set("instagram", instagram ? `https://instagram.com/${instagram.replace("@", "")}` : "");
      fd.set("twitter", twitter ? `https://x.com/${twitter.replace("@", "")}` : "");
      fd.set("facebook", facebook ? `https://facebook.com/${facebook.replace("@", "")}` : "");
      fd.set("tiktok", tiktok ? `https://tiktok.com/@${tiktok.replace("@", "")}` : "");

      if (foto) fd.set("foto", foto);

      const res = await apiFetch(`/jogadores`, { method: "POST", body: fd }) as { id: number };
      router.push(`/dashboard/jogadores/${res.id}`);
      // Redireciona direto pro perfil do jogador recém-criado
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar jogador");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "h-12 rounded-xl border border-input bg-background px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all";
  const labelClass = "text-sm font-bold text-foreground ml-1";

  return (
    <div className="mx-auto max-w-4xl mb-12 px-4 sm:px-0">
      <div className="mb-8 flex items-center gap-4">
        <Link href={`/dashboard/jogadores`} className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-accent transition-all shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">Novo Atleta</h1>
          <p className="text-base text-muted-foreground">Cadastre um novo perfil na base de dados</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive border border-destructive/20">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-[2rem] border border-border bg-card p-8 shadow-md">

        {/* Upload de Foto */}
        <div className="flex flex-col items-center gap-4">
          <label htmlFor="fotoInput" className="flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-dashed border-border bg-muted transition-all hover:border-primary shadow-inner">
            {preview ? (
              <img src={preview} className="h-full w-full object-cover" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground/50" />
            )}
          </label>
          <input id="fotoInput" type="file" accept="image/*" className="hidden" onChange={handleFoto} />
          <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Foto do Atleta</span>
        </div>

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
            <label className={labelClass}>Nome Completo *</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} onBlur={(e) => setNome(capitalizeName(e.target.value))} required className={inputClass} placeholder="Nome completo do jogador" />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Nome na Camisa</label>
            <input value={nomeCurto} onChange={(e) => setNomeCurto(e.target.value)} onBlur={(e) => setNomeCurto(capitalizeName(e.target.value))} className={inputClass} placeholder="Ex: R. Gaúcho" />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Apelido</label>
            <input value={apelido} onChange={(e) => setApelido(e.target.value)} onBlur={(e) => setApelido(capitalizeName(e.target.value))} className={inputClass} placeholder="Ex: Bruxo" />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Data de Nascimento</label>
            <input name="data_nascimento" type="date" className={inputClass} />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Pé Dominante *</label>
            <select name="pe_dominante" required defaultValue="D" className={inputClass}>
              <option value="D">Direito</option>
              <option value="E">Esquerdo</option>
              <option value="A">Ambidestro</option>
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
            <label className={labelClass}>Clube Atual</label>
            <select name="clube_atual_id" className={inputClass}>
              <option value="">Sem clube</option>
              {clubes?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Altura (m)</label>
            <input name="altura" type="number" step="0.01" className={inputClass} placeholder="Ex: 1.85" />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Peso (kg)</label>
            <input name="peso" type="number" step="0.1" className={inputClass} placeholder="Ex: 78.5" />
          </div>

          {/* Localidade */}
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
            <select name="cidade_id" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedEstado} className={inputClass}>
              <option value="">Selecione</option>
              {filteredCidades.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="border-t border-border/50 pt-8 flex flex-col gap-6">
          <h3 className="text-lg font-black uppercase tracking-widest text-primary">Redes Sociais</h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>WhatsApp</label>
              <div className="relative">
                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500/60" />
                <input value={whatsapp} onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))} className={`${inputClass} w-full pl-12`} placeholder="+55 (88) 9.9999-9999" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Instagram (@usuario)</label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-500/60" />
                <input value={instagram} onChange={(e) => setInstagram(e.target.value.replace("@", ""))} className={`${inputClass} w-full pl-12`} placeholder="ex: liandrochaves" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>TikTok (@usuario)</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
                <input value={tiktok} onChange={(e) => setTiktok(e.target.value.replace("@", ""))} className={`${inputClass} w-full pl-12`} placeholder="ex: liandro_ecl" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>X / Twitter (@usuario)</label>
              <div className="relative">
                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-500/60" />
                <input value={twitter} onChange={(e) => setTwitter(e.target.value.replace("@", ""))} className={`${inputClass} w-full pl-12`} placeholder="ex: chaves_volante" />
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className={labelClass}>Facebook (usuario)</label>
              <div className="relative">
                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600/60" />
                <input value={facebook} onChange={(e) => setFacebook(e.target.value)} className={`${inputClass} w-full pl-12`} placeholder="seu.nome.perfil" />
              </div>
            </div>
          </div>
        </div>

        {/* Mídia & Scout */}
        <div className="border-t border-border/50 pt-8 flex flex-col gap-6">
          <h3 className="text-lg font-black uppercase tracking-widest text-primary">Mídia & Scout</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Link de Vídeo</label>
              <div className="relative">
                <Video className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                <input value={video} onChange={(e) => setVideo(e.target.value)} className={`${inputClass} w-full pl-12`} placeholder="https://..." />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Observações Técnicas</label>
              <div className="relative">
                <Notebook className="absolute left-4 top-4 h-5 w-5 text-muted-foreground/40" />
                <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="min-h-32 w-full rounded-xl border border-input bg-background pl-12 pr-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring transition-all" placeholder="Análise tática, pontos fortes, histórico médico resumido..." />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-primary text-lg font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50">
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
          Cadastrar Atleta
        </button>
      </form>
    </div>
  );
}