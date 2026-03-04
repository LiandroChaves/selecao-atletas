"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { ArrowLeft, Upload, Loader2, Plus, CalendarIcon } from "lucide-react";
import Link from "next/link";
import type { Pais } from "@/types";
import { capitalizeName } from "@/lib/utils";

export default function NovoClubeForm() {
  const router = useRouter();
  const { data: paises } = useSWR<Pais[]>("/localidades/paises", fetcher);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [estadio, setEstadio] = useState("");
  const [fundacao, setFundacao] = useState("");

  const currentYear = new Date().getFullYear();

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const formattedNome = capitalizeName(nome.trim());
      const formattedEstadio = capitalizeName(estadio.trim());
      fd.set("nome", formattedNome);
      fd.set("estadio", formattedEstadio);
      fd.set("fundacao", fundacao);
      if (logo) fd.set("logo", logo);

      await apiFetch("/clubes", { method: "POST", body: fd });
      router.push("/dashboard/clubes");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar clube");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "h-12 rounded-xl border border-input bg-background px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all";
  const labelClass = "text-sm font-bold text-foreground ml-1";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/dashboard/clubes" className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-accent transition-all">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Novo Clube</h1>
          <p className="text-base text-muted-foreground">Preencha os dados e os períodos de contrato</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 shadow-md">
        <div className="flex flex-col items-center gap-4">
          <label htmlFor="logoInput" className="flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted hover:border-primary transition-all shadow-inner group">
            {preview ? <img src={preview} className="h-full w-full object-contain p-2" /> : <Upload className="h-8 w-8 text-muted-foreground" />}
          </label>
          <input id="logoInput" type="file" accept="image/*" className="hidden" onChange={handleLogo} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className={labelClass}>Nome do Clube *</label>
            <input name="nome" required value={nome} onChange={(e) => setNome(e.target.value)} onBlur={(e) => setNome(capitalizeName(e.target.value))} className={inputClass} />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>País *</label>
            <select name="pais_id" required className={inputClass}>
              <option value="">Selecione</option>
              {paises?.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Ano de Fundação</label>
            <input name="fundacao" type="number" value={fundacao} onChange={(e) => setFundacao(e.target.value.slice(0, 4))} className={inputClass} />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Início do Contrato</label>
            <input name="inicio_contrato" type="date" className={inputClass} />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Fim do Contrato</label>
            <input name="fim_contrato" type="date" className={inputClass} />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className={labelClass}>Estádio / Arena</label>
            <input name="estadio" value={estadio} onChange={(e) => setEstadio(e.target.value)} onBlur={(e) => setEstadio(capitalizeName(e.target.value))} className={inputClass} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="flex h-14 items-center justify-center gap-3 rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          Finalizar Cadastro
        </button>
      </form>
    </div>
  );
}