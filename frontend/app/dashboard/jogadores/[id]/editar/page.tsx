"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { ArrowLeft, Upload, Loader2, Save, Video, Notebook, User } from "lucide-react";
import Link from "next/link";
import type { Jogador, Posicao, NivelAmbidestria, Clube, Pais, Cidade, Estado } from "@/types";
import { API_URL, capitalizeName } from "@/lib/utils";

export default function EditarJogadorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const { data: jogador, isLoading } = useSWR<any>(`/jogadores/${id}`, fetcher);
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

    // Estados controlados para capitalize e inputs
    const [nome, setNome] = useState("");
    const [nomeCurto, setNomeCurto] = useState("");
    const [apelido, setApelido] = useState("");
    const [video, setVideo] = useState("");
    const [observacoes, setObservacoes] = useState("");

    // Lógica de localidade em cascata
    const [selectedPais, setSelectedPais] = useState<string>("");
    const [selectedEstado, setSelectedEstado] = useState<string>("");

    const filteredEstados = estados?.filter(e => String(e.pais_id) === selectedPais) || [];
    const filteredCidades = cidades?.filter(c => String(c.estado_id) === selectedEstado) || [];

    useEffect(() => {
        if (jogador) {
            setNome(jogador.nome);
            setNomeCurto(jogador.nome_curto || "");
            setApelido(jogador.apelido || "");
            setVideo(jogador.video || "");
            setObservacoes(jogador.observacoes || "");
            setSelectedPais(String(jogador.pais_id || ""));
            setSelectedEstado(String(jogador.estado_id || ""));
        }
    }, [jogador]);

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
            fd.set("video", video.trim());
            fd.set("observacoes", observacoes.trim());
            if (foto) fd.set("foto", foto);

            await apiFetch(`/jogadores/${id}`, { method: "PUT", body: fd });
            router.push(`/dashboard/jogadores/${id}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erro ao atualizar jogador");
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "h-12 rounded-xl border border-input bg-background px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all";
    const labelClass = "text-sm font-bold text-foreground ml-1";

    if (isLoading || !jogador) {
        return (
            <div className="mx-auto max-w-4xl flex flex-col gap-6">
                <div className="h-10 w-64 animate-pulse rounded-xl bg-muted" />
                <div className="h-[600px] animate-pulse rounded-[2rem] bg-muted" />
            </div>
        );
    }

    const currentFotoUrl = jogador.foto ? `${API_URL}/files/${jogador.foto}` : null;
    const dataNasc = jogador.data_nascimento ? new Date(jogador.data_nascimento).toISOString().split("T")[0] : "";

    return (
        <div className="mx-auto max-w-4xl mb-12">
            <div className="mb-8 flex items-center gap-4">
                <Link href={`/dashboard/jogadores`} className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-accent transition-all shadow-sm">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">Editar Perfil</h1>
                    <p className="text-base text-muted-foreground">{jogador.nome}</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive border border-destructive/20">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-[2rem] border border-border bg-card p-8 shadow-md">
                {/* Foto Section */}
                <div className="flex flex-col items-center gap-4">
                    <label htmlFor="fotoInput" className="flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-dashed border-border bg-muted transition-all hover:border-primary shadow-inner group">
                        {preview ? (
                            <img src={preview} className="h-full w-full object-cover" />
                        ) : currentFotoUrl ? (
                            <img src={currentFotoUrl} className="h-full w-full object-cover" crossOrigin="anonymous" />
                        ) : (
                            <Upload className="h-10 w-10 text-muted-foreground" />
                        )}
                    </label>
                    <input id="fotoInput" type="file" accept="image/*" className="hidden" onChange={handleFoto} />
                    <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">Alterar Foto do Atleta</span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
                        <label className={labelClass}>Nome Completo *</label>
                        <input value={nome} onChange={(e) => setNome(e.target.value)} onBlur={(e) => setNome(capitalizeName(e.target.value))} required className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Nome na Camisa</label>
                        <input value={nomeCurto} onChange={(e) => setNomeCurto(e.target.value)} onBlur={(e) => setNomeCurto(capitalizeName(e.target.value))} className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Apelido</label>
                        <input value={apelido} onChange={(e) => setApelido(e.target.value)} onBlur={(e) => setApelido(capitalizeName(e.target.value))} className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Data de Nascimento</label>
                        <input name="data_nascimento" type="date" defaultValue={dataNasc} className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Pé Dominante *</label>
                        <select name="pe_dominante" required defaultValue={jogador.pe_dominante} className={inputClass}>
                            <option value="D">Direito</option>
                            <option value="E">Esquerdo</option>
                            <option value="A">Ambidestro</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Posição Principal *</label>
                        <select name="posicao_id" required defaultValue={jogador.posicao_id} className={inputClass}>
                            {posicoes?.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Posição Secundária</label>
                        <select name="posicao_secundaria_id" defaultValue={jogador.posicao_secundaria_id || ""} className={inputClass}>
                            <option value="">Nenhuma</option>
                            {posicoes?.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Nível de Ambidestria *</label>
                        <select name="nivel_ambidestria_id" required defaultValue={jogador.nivel_ambidestria_id} className={inputClass}>
                            {ambidestria?.map((a) => <option key={a.id} value={a.id}>{a.descricao}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Clube Atual</label>
                        <select name="clube_atual_id" defaultValue={jogador.clube_atual_id || ""} className={inputClass}>
                            <option value="">Sem clube</option>
                            {clubes?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Altura (m)</label>
                        <input name="altura" type="number" step="0.01" defaultValue={jogador.altura} className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Peso (kg)</label>
                        <input name="peso" type="number" step="0.1" defaultValue={jogador.peso} className={inputClass} />
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
                        <select name="cidade_id" defaultValue={jogador.cidade_id || ""} disabled={!selectedEstado} className={inputClass}>
                            <option value="">Selecione</option>
                            {filteredCidades.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
                        <label className={labelClass}>Link de Vídeo (Youtube/Vimeo)</label>
                        <div className="relative">
                            <Video className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                            <input value={video} onChange={(e) => setVideo(e.target.value)} className={`${inputClass} w-full pl-12`} placeholder="https://..." />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
                        <label className={labelClass}>Observações Técnicas</label>
                        <div className="relative">
                            <Notebook className="absolute left-4 top-4 h-5 w-5 text-muted-foreground/40" />
                            <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="min-h-32 w-full rounded-xl border border-input bg-background pl-12 pr-4 py-3 text-base focus:ring-2 focus:ring-ring outline-none transition-all" placeholder="Notas sobre o desempenho do atleta..." />
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-primary text-lg font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                    Salvar Alterações
                </button>
            </form>
        </div>
    );
}