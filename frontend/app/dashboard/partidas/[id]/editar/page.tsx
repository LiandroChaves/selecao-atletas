"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { ArrowLeft, Loader2, Save, Trophy, MapPin, Calendar, Hash } from "lucide-react";
import Link from "next/link";
import type { Clube, Partida } from "@/types";
import { capitalizeName } from "@/lib/utils";

export default function EditarPartidaPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const { data: clubes } = useSWR<Clube[]>("/clubes", fetcher);
    const { data: partida, isLoading } = useSWR<Partida>(`/partidas/${id}`, fetcher);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        data: "",
        campeonato: "",
        estadio: "",
        clube_casa_id: "",
        clube_fora_id: "",
        gols_casa: 0,
        gols_fora: 0,
    });

    useEffect(() => {
        if (partida) {
            setFormData({
                data: partida.data ? new Date(partida.data).toISOString().split('T')[0] : "",
                campeonato: partida.campeonato || "",
                estadio: partida.estadio || "",
                clube_casa_id: String(partida.clube_casa_id || ""),
                clube_fora_id: String(partida.clube_fora_id || ""),
                gols_casa: partida.gols_casa || 0,
                gols_fora: partida.gols_fora || 0,
            });
        }
    }, [partida]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (name: "campeonato" | "estadio", value: string) => {
        setFormData(prev => ({ ...prev, [name]: capitalizeName(value) }));
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.clube_casa_id === formData.clube_fora_id) {
            setError("Os clubes de confronto devem ser diferentes.");
            setLoading(false);
            return;
        }

        try {
            const body = {
                data: formData.data,
                campeonato: formData.campeonato.trim() || undefined,
                estadio: formData.estadio.trim() || undefined,
                clube_casa_id: Number(formData.clube_casa_id),
                clube_fora_id: Number(formData.clube_fora_id),
                gols_casa: Number(formData.gols_casa),
                gols_fora: Number(formData.gols_fora),
            };
            await apiFetch(`/partidas/${id}`, { method: "PUT", body: JSON.stringify(body) });
            router.push(`/dashboard/partidas/${id}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erro ao atualizar partida");
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "h-12 rounded-xl border border-input bg-background px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner placeholder:text-muted-foreground/40";
    const labelClass = "text-sm font-black text-foreground uppercase tracking-widest ml-1";

    if (isLoading || !partida) {
        return (
            <div className="mx-auto max-w-3xl flex flex-col gap-6 p-8">
                <div className="h-10 w-48 animate-pulse rounded-xl bg-muted" />
                <div className="h-[500px] animate-pulse rounded-[2.5rem] bg-muted" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl mb-12">
            <div className="mb-8 flex items-center gap-4 px-2">
                <Link href={`/dashboard/partidas/${id}`} className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] border border-border bg-card text-muted-foreground hover:bg-accent transition-all shadow-sm">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none">Editar Partida</h1>
                    <p className="text-sm font-bold text-muted-foreground tracking-[0.2em] uppercase opacity-50 mt-2">Ajuste de Dados e Placar</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl bg-destructive/10 p-4 text-sm font-bold text-destructive border border-destructive/20 flex items-center gap-3">
                    <Hash className="h-5 w-5" /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-[2.5rem] border border-border bg-card p-10 shadow-2xl shadow-black/5">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div className="flex flex-col gap-2.5">
                        <label className={labelClass}>Data do Jogo *</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                            <input name="data" type="date" required className={`${inputClass} w-full pl-12`} value={formData.data} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label className={labelClass}>Campeonato</label>
                        <div className="relative">
                            <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                            <input name="campeonato" className={`${inputClass} w-full pl-12`} placeholder="Ex: Libertadores" value={formData.campeonato} onChange={handleChange} onBlur={(e) => handleBlur("campeonato", e.target.value)} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5 sm:col-span-2">
                        <label className={labelClass}>Estádio / Local</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
                            <input name="estadio" className={`${inputClass} w-full pl-12`} placeholder="Nome do estádio" value={formData.estadio} onChange={handleChange} onBlur={(e) => handleBlur("estadio", e.target.value)} />
                        </div>
                    </div>

                    <div className="h-px bg-border/50 sm:col-span-2 my-2" />

                    <div className="flex flex-col gap-4 bg-muted/20 p-6 rounded-[2rem] border border-border/50">
                        <label className={labelClass}>Mandante *</label>
                        <select name="clube_casa_id" required className={inputClass} value={formData.clube_casa_id} onChange={handleChange}>
                            <option value="">Selecione</option>
                            {clubes?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground px-1 tracking-widest text-center">Gols Mandante</label>
                            <input name="gols_casa" type="number" min="0" className={`${inputClass} text-center text-2xl font-black`} value={formData.gols_casa} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 bg-muted/20 p-6 rounded-[2rem] border border-border/50">
                        <label className={labelClass}>Visitante *</label>
                        <select name="clube_fora_id" required className={inputClass} value={formData.clube_fora_id} onChange={handleChange}>
                            <option value="">Selecione</option>
                            {clubes?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground px-1 tracking-widest text-center">Gols Visitante</label>
                            <input name="gols_fora" type="number" min="0" className={`${inputClass} text-center text-2xl font-black`} value={formData.gols_fora} onChange={handleChange} />
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
                            Atualizando...
                        </>
                    ) : (
                        <>
                            <Save className="h-6 w-6" />
                            Salvar Alterações
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}