"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { Trophy, Plus, Loader2, Link2, Pencil, Trash2, X } from "lucide-react";
import type { Titulo, Jogador, Clube } from "@/types";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { capitalizeName } from "@/lib/utils";

export default function TitulosPage() {
  const { data: titulos, mutate } = useSWR<Titulo[]>("/titulos", fetcher);
  const { data: jogadores } = useSWR<Jogador[]>("/jogadores", fetcher);
  const { data: clubes } = useSWR<Clube[]>("/clubes", fetcher);

  const [showCreate, setShowCreate] = useState(false);
  const [showVinculo, setShowVinculo] = useState(false);
  const [editingTitulo, setEditingTitulo] = useState<Titulo | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputNomeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTitulo) {
      setNome(editingTitulo.nome);
    } else {
      setNome("");
    }
  }, [editingTitulo]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      await apiFetch("/titulos", {
        method: "POST",
        body: JSON.stringify({
          nome: nome.trim(),
          tipo: fd.get("tipo"),
        }),
      });

      await mutate();

      setNome("");
      inputNomeRef.current?.focus();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar titulo");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingTitulo) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      await apiFetch(`/titulos/${editingTitulo.id}`, {
        method: "PUT",
        body: JSON.stringify({
          nome: nome.trim(),
          tipo: fd.get("tipo"),
        }),
      });
      mutate();
      setEditingTitulo(null);
      setNome("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar titulo");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoading(true);
    setError("");
    try {
      await apiFetch(`/titulos/${deleteId}`, { method: "DELETE" });
      mutate();
      setDeleteId(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao excluir titulo");
    } finally {
      setLoading(false);
    }
  }

  async function handleVincular(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData(e.currentTarget);
      await apiFetch("/titulos/vincular", {
        method: "POST",
        body: JSON.stringify({
          jogador_id: Number(fd.get("jogador_id")),
          titulo_id: Number(fd.get("titulo_id")),
          clube_id: Number(fd.get("clube_id")),
          ano: Number(fd.get("ano")),
        }),
      });
      setShowVinculo(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao vincular titulo");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-12 rounded-xl border border-input bg-background px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Titulos</h1>
          <p className="text-base text-muted-foreground">{titulos?.length ?? 0} titulos cadastrados no sistema</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowVinculo(!showVinculo); setShowCreate(false); setEditingTitulo(null); }}
            className="flex h-12 items-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-bold text-foreground hover:bg-accent shadow-sm"
          >
            <Link2 className="h-5 w-5" />
            Vincular a Jogador
          </button>
          <button
            onClick={() => {
              const nextState = !showCreate;
              setShowCreate(nextState);
              setShowVinculo(false);
              setEditingTitulo(null);
              setNome("");
              if (nextState) setTimeout(() => inputNomeRef.current?.focus(), 100);
            }}
            className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Novo Titulo
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm font-medium text-destructive border border-destructive/20">{error}</div>
      )}

      {(showCreate || editingTitulo) && (
        <form onSubmit={editingTitulo ? handleUpdate : handleCreate} className="rounded-2xl border border-border bg-card p-6 relative shadow-md">
          <button
            type="button"
            onClick={() => { setShowCreate(false); setEditingTitulo(null); setNome(""); }}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-2"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="mb-6 text-lg font-bold text-card-foreground">
            {editingTitulo ? "Editar Titulo" : "Criar Titulo"}
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Nome do Titulo *</label>
              <input
                ref={inputNomeRef}
                name="nome"
                required
                value={nome}
                onChange={(e) => setNome(capitalizeName(e.target.value))}
                className={inputClass}
                placeholder="Ex: Champions League"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Tipo *</label>
              <select name="tipo" required defaultValue={editingTitulo?.tipo || ""} className={inputClass}>
                <option value="">Selecione o tipo</option>
                <option value="Nacional">Nacional</option>
                <option value="Internacional">Internacional</option>
                <option value="Individual">Individual</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="mt-6 flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {editingTitulo ? "Salvar Alteracoes" : "Confirmar e Próximo"}
          </button>
        </form>
      )}

      {showVinculo && (
        <form onSubmit={handleVincular} className="rounded-2xl border border-border bg-card p-6 relative shadow-md">
          <button
            type="button"
            onClick={() => setShowVinculo(false)}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-2"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="mb-6 text-lg font-bold text-card-foreground">Vincular Titulo a Jogador</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Jogador *</label>
              <select name="jogador_id" required className={inputClass}>
                <option value="">Selecione</option>
                {jogadores?.map((j) => (
                  <option key={j.id} value={j.id}>{j.nome}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Titulo *</label>
              <select name="titulo_id" required className={inputClass}>
                <option value="">Selecione</option>
                {titulos?.map((t) => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Clube *</label>
              <select name="clube_id" required className={inputClass}>
                <option value="">Selecione</option>
                {clubes?.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-foreground">Ano *</label>
              <input name="ano" type="number" required className={inputClass} placeholder="2024" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="mt-6 flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            Vincular Agora
          </button>
        </form>
      )}

      {titulos && titulos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {titulos.map((t) => (
            <div key={t.id} className="group relative flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-lg font-bold text-card-foreground">{t.nome}</p>
                <span className="inline-block rounded-lg bg-muted px-3 py-1 text-xs font-bold text-muted-foreground uppercase">{t.tipo}</span>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditingTitulo(t); setShowCreate(false); setShowVinculo(false); }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteId(t.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 shadow-inner">
          <Trophy className="mb-4 h-12 w-12 text-muted-foreground/20" />
          <p className="text-lg font-medium text-muted-foreground">Nenhum titulo cadastrado ainda</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Excluir Titulo"
        message="Tem certeza que deseja excluir este titulo? Se houver jogadores vinculados, a exclusao pode afetar o historico deles."
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={loading}
      />
    </div>
  );
}