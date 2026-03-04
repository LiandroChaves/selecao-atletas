"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { ArrowLeft, Upload, Loader2, Save } from "lucide-react";
import Link from "next/link";
import type { Clube, Pais } from "@/types";
import { API_URL, capitalizeName } from "@/lib/utils";

export default function EditarClubePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const { data: clube, isLoading } = useSWR<any>(`/clubes/${id}`, fetcher);
    const { data: paises } = useSWR<Pais[]>("/localidades/paises", fetcher);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [nome, setNome] = useState("");
    const [estadio, setEstadio] = useState("");
    const [fundacao, setFundacao] = useState("");
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");

    useEffect(() => {
        if (clube) {
            setNome(clube.nome);
            setEstadio(clube.estadio || "");
            setFundacao(clube.fundacao?.toString() || "");
            if (clube.inicio_contrato) setInicio(clube.inicio_contrato.split('T')[0]);
            if (clube.fim_contrato) setFim(clube.fim_contrato.split('T')[0]);
        }
    }, [clube]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData(e.currentTarget);
            const formattedNome = capitalizeName(nome.trim());
            const formattedEstadio = capitalizeName(estadio.trim());
            fd.set("nome", formattedNome);
            fd.set("estadio", formattedEstadio);
            fd.set("fundacao", fundacao);
            if (logo) fd.set("logo", logo);

            await apiFetch(`/clubes/${id}`, { method: "PUT", body: fd });
            router.push(`/dashboard/clubes/${id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "h-12 rounded-xl border border-input bg-background px-4 text-base focus:ring-2 focus:ring-ring";
    const labelClass = "text-sm font-bold text-foreground ml-1";

    if (isLoading || !clube) return <div className="p-8">Carregando...</div>;

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex items-center gap-4">
                <Link href={`/dashboard/clubes/${id}`} className="flex h-11 w-11 items-center justify-center rounded-xl border border-border">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-3xl font-bold">Editar {clube.nome}</h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 shadow-md">
                <div className="flex flex-col items-center gap-4">
                    <label htmlFor="logoInput" className="flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-muted shadow-inner">
                        {preview ? <img src={preview} className="h-full w-full object-contain p-2" /> : (clube.logos?.[0]?.url_logo ? <img src={`${API_URL}/files/${clube.logos[0].url_logo}`} crossOrigin="anonymous" className="h-full w-full object-contain p-2" /> : <Upload className="h-8 w-8" />)}
                    </label>
                    <input id="logoInput" type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { setLogo(f); setPreview(URL.createObjectURL(f)); }
                    }} />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 sm:col-span-2">
                        <label className={labelClass}>Nome do Clube *</label>
                        <input name="nome" required value={nome} onChange={(e) => setNome(e.target.value)} onBlur={(e) => setNome(capitalizeName(e.target.value))} className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>País *</label>
                        <select name="pais_id" required defaultValue={clube.pais_id} className={inputClass}>
                            {paises?.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Ano de Fundação</label>
                        <input name="fundacao" type="number" value={fundacao} onChange={(e) => setFundacao(e.target.value)} className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Início do Contrato</label>
                        <input name="inicio_contrato" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>Fim do Contrato</label>
                        <input name="fim_contrato" type="date" value={fim} onChange={(e) => setFim(e.target.value)} className={inputClass} />
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                        <label className={labelClass}>Estádio</label>
                        <input name="estadio" value={estadio} onChange={(e) => setEstadio(e.target.value)} onBlur={(e) => setEstadio(capitalizeName(e.target.value))} className={inputClass} />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="flex h-14 items-center justify-center gap-3 rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Salvar Alterações
                </button>
            </form>
        </div>
    );
}