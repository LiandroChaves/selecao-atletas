"use client";

import { useState } from "react";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { Settings, Plus, Loader2, Crosshair, Hand, Globe, Trash2, Upload, MapPin, Map } from "lucide-react";
import type { Posicao, NivelAmbidestria, Pais, Estado, Cidade } from "@/types";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { API_URL, capitalizeName, simpleCapitalize } from "@/lib/utils";

type Tab = "posicoes" | "ambidestria" | "paises" | "estados" | "cidades";

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("paises");

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "paises", label: "Paises", icon: Globe },
    { id: "estados", label: "Estados", icon: Map },
    { id: "cidades", label: "Cidades", icon: MapPin },
    { id: "ambidestria", label: "Ambidestria", icon: Hand },
    { id: "posicoes", label: "Posicoes", icon: Crosshair },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-base text-muted-foreground">Gerencie posicoes, niveis e localidades do sistema</p>
      </div>

      <div className="flex gap-1 rounded-xl border border-border bg-muted/50 p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${activeTab === tab.id
              ? "bg-card text-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-2">
        {activeTab === "paises" && <PaisesTab />}
        {activeTab === "estados" && <EstadosTab />}
        {activeTab === "cidades" && <CidadesTab />}
        {activeTab === "ambidestria" && <AmbiDestriaTab />}
        {activeTab === "posicoes" && <PosicoesTab />}
      </div>
    </div>
  );
}

function PosicoesTab() {
  const { data: posicoes, mutate } = useSWR<Posicao[]>("/configuracoes/posicoes", fetcher);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiFetch(`/configuracoes/posicoes/${deleteId}`, { method: "DELETE" });
      mutate();
      setDeleteId(null);
    } catch { } finally { setDeleting(false); }
  }

  async function handleEditSubmit(e: React.FormEvent, id: number) {
    e.preventDefault();
    const formattedNome = capitalizeName(editNome.trim());
    if (!formattedNome) return;
    setSavingEdit(true);
    try {
      await apiFetch(`/configuracoes/posicoes/${id}`, {
        method: "PUT",
        body: JSON.stringify({ nome: formattedNome }),
      });
      setEditId(null);
      mutate();
    } catch { } finally { setSavingEdit(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const formattedNome = capitalizeName(nome.trim());
    if (!formattedNome) return;
    setLoading(true);
    try {
      await apiFetch("/configuracoes/posicoes", {
        method: "POST",
        body: JSON.stringify({ nome: formattedNome }),
      });
      setNome("");
      mutate();
    } catch { } finally { setLoading(false); }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-card-foreground">
        <Crosshair className="h-5 w-5 text-primary" />
        Posicoes de Jogador
      </h3>
      <form onSubmit={handleCreate} className="mb-8 flex gap-3">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={(e) => setNome(capitalizeName(e.target.value))}
          placeholder="Ex: Meio-Campo"
          className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm transition-all"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          Adicionar
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {posicoes?.map((p) => (
          <div key={p.id} className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4 hover:bg-muted/50 transition-all">
            {editId === p.id ? (
              <form onSubmit={(e) => handleEditSubmit(e, p.id)} className="flex w-full gap-2">
                <input
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  onBlur={(e) => setEditNome(capitalizeName(e.target.value))}
                  className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-ring"
                  autoFocus
                />
                <button type="submit" disabled={savingEdit} className="text-primary hover:text-primary/80 font-bold text-xs uppercase">
                  {savingEdit ? "..." : "Salvar"}
                </button>
                <button type="button" onClick={() => setEditId(null)} className="text-muted-foreground hover:text-foreground text-xs uppercase">
                  X
                </button>
              </form>
            ) : (
              <>
                <span className="text-lg font-semibold text-foreground">{p.nome}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditNome(p.nome); setEditId(p.id); }} className="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <ConfirmDialog isOpen={deleteId !== null} title="Excluir Posicao" message="Deseja realmente remover esta posicao?" confirmLabel="Excluir" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}

function AmbiDestriaTab() {
  const { data: niveis, mutate } = useSWR<NivelAmbidestria[]>("/configuracoes/ambidestria", fetcher);
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editDescricao, setEditDescricao] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiFetch(`/configuracoes/ambidestria/${deleteId}`, { method: "DELETE" });
      mutate();
      setDeleteId(null);
    } catch { } finally { setDeleting(false); }
  }

  async function handleEditSubmit(e: React.FormEvent, id: number) {
    e.preventDefault();
    const formattedDesc = capitalizeName(editDescricao.trim());
    if (!formattedDesc) return;
    setSavingEdit(true);
    try {
      await apiFetch(`/configuracoes/ambidestria/${id}`, {
        method: "PUT",
        body: JSON.stringify({ descricao: formattedDesc }),
      });
      setEditId(null);
      mutate();
    } catch { } finally { setSavingEdit(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const formattedDesc = capitalizeName(descricao.trim());
    if (!formattedDesc) return;
    setLoading(true);
    try {
      await apiFetch("/configuracoes/ambidestria", {
        method: "POST",
        body: JSON.stringify({ descricao: formattedDesc }),
      });
      setDescricao("");
      mutate();
    } catch { } finally { setLoading(false); }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-card-foreground">
        <Hand className="h-5 w-5 text-primary" />
        Niveis de Ambidestria
      </h3>
      <form onSubmit={handleCreate} className="mb-8 flex gap-3">
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          onBlur={(e) => setDescricao(capitalizeName(e.target.value))}
          placeholder="Ex: Destro"
          className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm transition-all"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          Adicionar
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {niveis?.map((n) => (
          <div key={n.id} className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4 hover:bg-muted/50 transition-all">
            {editId === n.id ? (
              <form onSubmit={(e) => handleEditSubmit(e, n.id)} className="flex w-full gap-2">
                <input
                  value={editDescricao}
                  onChange={(e) => setEditDescricao(e.target.value)}
                  onBlur={(e) => setEditDescricao(capitalizeName(e.target.value))}
                  className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-ring"
                  autoFocus
                />
                <button type="submit" disabled={savingEdit} className="text-primary hover:text-primary/80 font-bold text-xs uppercase">
                  {savingEdit ? "..." : "Salvar"}
                </button>
                <button type="button" onClick={() => setEditId(null)} className="text-muted-foreground hover:text-foreground text-xs uppercase">
                  X
                </button>
              </form>
            ) : (
              <>
                <span className="text-lg font-semibold text-foreground">{n.descricao}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditDescricao(n.descricao); setEditId(n.id); }} className="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>
                  <button onClick={() => setDeleteId(n.id)} className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <ConfirmDialog isOpen={deleteId !== null} title="Excluir Nivel" message="Remover este nível de ambidestria?" confirmLabel="Excluir" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}

function PaisesTab() {
  const { data: paises, mutate } = useSWR<Pais[]>("/localidades/paises", fetcher);
  const [nome, setNome] = useState("");
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiFetch(`/localidades/paises/${deleteId}`, { method: "DELETE" });
      mutate();
      setDeleteId(null);
    } catch { } finally { setDeleting(false); }
  }

  async function handleEditSubmit(e: React.FormEvent, id: number) {
    e.preventDefault();
    const formattedNome = capitalizeName(editNome.trim());
    if (!formattedNome) return;
    setSavingEdit(true);
    try {
      const fd = new FormData();
      fd.append("nome", formattedNome);
      if (editFile) fd.append("bandeira_file", editFile);
      await apiFetch(`/localidades/paises/${id}`, { method: "PUT", body: fd });
      setEditId(null); setEditFile(null); mutate();
    } catch { } finally { setSavingEdit(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const formattedNome = capitalizeName(nome.trim());
    if (!formattedNome) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("nome", formattedNome);
      if (createFile) fd.append("bandeira_file", createFile);
      await apiFetch("/localidades/paises", { method: "POST", body: fd });
      setNome(""); setCreateFile(null); mutate();
    } catch { } finally { setLoading(false); }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-card-foreground">
        <Globe className="h-5 w-5 text-primary" />
        Paises
      </h3>
      <form onSubmit={handleCreate} className="mb-8 flex gap-3">
        <input value={nome} onChange={(e) => setNome(e.target.value)} onBlur={(e) => setNome(capitalizeName(e.target.value))} placeholder="Nome do pais..." className="h-12 flex-1 rounded-xl border border-input bg-background px-4 text-base focus:ring-2 focus:ring-ring" />
        <label className="flex h-12 w-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-input bg-muted hover:border-primary transition-all overflow-hidden shadow-sm" title="Adicionar bandeira">
          {createFile ? <img src={URL.createObjectURL(createFile)} className="h-full w-full object-cover" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setCreateFile(e.target.files?.[0] || null)} />
        </label>
        <button type="submit" disabled={loading} className="flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          Adicionar
        </button>
      </form>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 font-bold text-sm text-muted-foreground w-16">ID</th>
              <th className="p-4 font-bold text-sm text-muted-foreground text-center w-24">Bandeira</th>
              <th className="p-4 font-bold text-sm text-muted-foreground">Nome</th>
              <th className="p-4 font-bold text-sm text-muted-foreground text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paises?.map((p) => {
              const bandeiraUrl = (p as any).bandeira?.logo_bandeira ? `${API_URL}/files/${(p as any).bandeira.logo_bandeira}` : null;
              return editId === p.id ? (
                <tr key={p.id} className="bg-primary/5">
                  <td className="p-4">{p.id}</td>
                  <td colSpan={3} className="p-4">
                    <form onSubmit={(e) => handleEditSubmit(e, p.id)} className="flex items-center gap-3">
                      <label className="flex h-10 w-20 cursor-pointer items-center justify-center rounded-lg border border-input bg-background overflow-hidden">
                        {editFile ? <img src={URL.createObjectURL(editFile)} className="h-full w-full object-cover" /> : bandeiraUrl ? <img src={bandeiraUrl} crossOrigin="anonymous" className="h-full w-full object-cover" /> : <Upload className="h-4 w-4" />}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setEditFile(e.target.files?.[0] || null)} />
                      </label>
                      <input value={editNome} onChange={(e) => setEditNome(e.target.value)} onBlur={(e) => setEditNome(capitalizeName(e.target.value))} className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm" />
                      <button type="submit" className="text-primary font-bold text-xs uppercase">Salvar</button>
                      <button type="button" onClick={() => setEditId(null)} className="text-muted-foreground text-xs uppercase">X</button>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-5 text-sm text-muted-foreground">{p.id}</td>
                  <td className="p-5">
                    <div className="mx-auto flex h-12 w-16 items-center justify-center overflow-hidden rounded-lg bg-muted border border-border shadow-sm">
                      {bandeiraUrl ? <img src={bandeiraUrl} alt={p.nome} crossOrigin="anonymous" className="h-full w-full object-cover" /> : <Globe className="h-6 w-6 text-muted-foreground/30" />}
                    </div>
                  </td>
                  <td className="p-5 text-xl font-bold text-foreground">{p.nome}</td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditId(p.id); setEditNome(p.nome); }} className="p-2.5 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                        <Settings className="h-6 w-6" />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="p-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ConfirmDialog isOpen={deleteId !== null} title="Excluir Pais" message="Deseja remover este país?" confirmLabel="Excluir" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}

function EstadosTab() {
  const { data: estados, mutate } = useSWR<Estado[]>("/localidades/estados", fetcher);
  const { data: paises } = useSWR<Pais[]>("/localidades/paises", fetcher);
  const [nome, setNome] = useState("");
  const [uf, setUf] = useState("");
  const [paisId, setPaisId] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editUf, setEditUf] = useState("");
  const [editPaisId, setEditPaisId] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiFetch(`/localidades/estados/${deleteId}`, { method: "DELETE" });
      mutate();
      setDeleteId(null);
    } catch { } finally { setDeleting(false); }
  }

  async function handleEditSubmit(e: React.FormEvent, id: number) {
    e.preventDefault();
    const formattedNome = capitalizeName(editNome.trim());
    if (!formattedNome || !editUf.trim() || !editPaisId) return;
    setSavingEdit(true);
    try {
      await apiFetch(`/localidades/estados/${id}`, { method: "PUT", body: JSON.stringify({ nome: formattedNome, uf: editUf.toUpperCase(), pais_id: Number(editPaisId) }) });
      setEditId(null); mutate();
    } catch { } finally { setSavingEdit(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const formattedNome = capitalizeName(nome.trim());
    if (!formattedNome || !uf.trim() || !paisId) return;
    setLoading(true);
    try {
      await apiFetch("/localidades/estados", { method: "POST", body: JSON.stringify({ nome: formattedNome, uf: uf.toUpperCase(), pais_id: Number(paisId) }) });
      setNome(""); setUf(""); setPaisId(""); mutate();
    } catch { } finally { setLoading(false); }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-card-foreground">
        <Map className="h-5 w-5 text-primary" />
        Estados
      </h3>
      <form onSubmit={handleCreate} className="mb-8 flex flex-wrap gap-3">
        <input value={nome} onChange={(e) => setNome(e.target.value)} onBlur={(e) => setNome(capitalizeName(e.target.value))} placeholder="Nome do estado..." className="h-12 flex-1 min-w-[200px] rounded-xl border border-input bg-background px-4 text-base transition-all" />
        <input value={uf} onChange={(e) => setUf(e.target.value.toUpperCase())} onBlur={(e) => setUf(e.target.value.toUpperCase())} placeholder="UF" maxLength={2} className="h-12 w-24 rounded-xl border border-input bg-background px-4 text-center font-bold text-base transition-all" />
        <select value={paisId} onChange={(e) => setPaisId(e.target.value)} className="h-12 w-48 rounded-xl border border-input bg-background px-4 text-base">
          <option value="">Selecione o País</option>
          {paises?.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <button type="submit" disabled={loading || !paisId} className="flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          Adicionar
        </button>
      </form>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 font-bold text-sm text-muted-foreground w-16">UF</th>
              <th className="p-4 font-bold text-sm text-muted-foreground">Nome</th>
              <th className="p-4 font-bold text-sm text-muted-foreground">País</th>
              <th className="p-4 font-bold text-sm text-muted-foreground text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {estados?.map((e) => (
              editId === e.id ? (
                <tr key={e.id} className="bg-primary/5">
                  <td colSpan={4} className="p-4">
                    <form onSubmit={(ev) => handleEditSubmit(ev, e.id)} className="flex items-center gap-3">
                      <input value={editUf} onChange={(ev) => setEditUf(ev.target.value.toUpperCase())} onBlur={(ev) => setEditUf(ev.target.value.toUpperCase())} maxLength={2} className="h-10 w-16 rounded-lg border border-input text-center font-bold" />
                      <input value={editNome} onChange={(ev) => setEditNome(ev.target.value)} onBlur={(ev) => setEditNome(capitalizeName(ev.target.value))} className="h-10 flex-1 rounded-lg border border-input px-3" />
                      <select value={editPaisId} onChange={(ev) => setEditPaisId(ev.target.value)} className="h-10 w-40 rounded-lg border border-input">
                        {paises?.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                      </select>
                      <button type="submit" className="text-primary font-bold text-xs uppercase">Salvar</button>
                      <button type="button" onClick={() => setEditId(null)} className="text-muted-foreground text-xs uppercase">X</button>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-5 font-bold text-xl text-primary">{e.uf}</td>
                  <td className="p-5 text-xl font-bold text-foreground">{e.nome}</td>
                  <td className="p-5 text-base text-muted-foreground">{e.pais?.nome}</td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditId(e.id); setEditNome(e.nome); setEditUf(e.uf); setEditPaisId(String(e.pais_id)); }} className="p-2.5 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                        <Settings className="h-6 w-6" />
                      </button>
                      <button onClick={() => setDeleteId(e.id)} className="p-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog isOpen={deleteId !== null} title="Excluir Estado" message="Deseja remover este estado?" confirmLabel="Excluir" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}

function CidadesTab() {
  const { data: cidades, mutate } = useSWR<Cidade[]>("/localidades/cidades", fetcher);
  const { data: estados } = useSWR<Estado[]>("/localidades/estados", fetcher);
  const { data: paises } = useSWR<Pais[]>("/localidades/paises", fetcher);
  const [nome, setNome] = useState("");
  const [estadoId, setEstadoId] = useState("");
  const [paisId, setPaisId] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEstadoId, setEditEstadoId] = useState("");
  const [editPaisId, setEditPaisId] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await apiFetch(`/localidades/cidades/${deleteId}`, { method: "DELETE" });
      mutate();
      setDeleteId(null);
    } catch { } finally { setDeleting(false); }
  }

  async function handleEditSubmit(e: React.FormEvent, id: number) {
    e.preventDefault();
    const formattedNome = capitalizeName(editNome.trim());
    if (!formattedNome || (!editEstadoId && !editPaisId)) return;
    setSavingEdit(true);
    try {
      await apiFetch(`/localidades/cidades/${id}`, { method: "PUT", body: JSON.stringify({ nome: formattedNome, estado_id: editEstadoId ? Number(editEstadoId) : undefined, pais_id: editPaisId ? Number(editPaisId) : undefined }) });
      setEditId(null); mutate();
    } catch { } finally { setSavingEdit(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const formattedNome = capitalizeName(nome.trim());
    if (!formattedNome || (!estadoId && !paisId)) return;
    setLoading(true);
    try {
      await apiFetch("/localidades/cidades", { method: "POST", body: JSON.stringify({ nome: formattedNome, estado_id: estadoId ? Number(estadoId) : undefined, pais_id: paisId ? Number(paisId) : undefined }) });
      setNome(""); mutate();
    } catch { } finally { setLoading(false); }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-card-foreground">
        <MapPin className="h-5 w-5 text-primary" />
        Cidades
      </h3>
      <form onSubmit={handleCreate} className="mb-8 flex flex-wrap gap-3">
        <input value={nome} onChange={(e) => setNome(e.target.value)} onBlur={(e) => setNome(capitalizeName(e.target.value))} placeholder="Nome da cidade..." className="h-12 flex-1 min-w-[200px] rounded-xl border border-input bg-background px-4 text-base focus:ring-2 focus:ring-ring transition-all" />
        <select value={estadoId} onChange={(e) => setEstadoId(e.target.value)} className="h-12 w-48 rounded-xl border border-input bg-background px-4">
          <option value="">Estado (UF)</option>
          {estados?.map(est => <option key={est.id} value={est.id}>{est.nome} ({est.uf})</option>)}
        </select>
        <span className="flex items-center text-sm font-bold text-muted-foreground px-1">ou</span>
        <select value={paisId} onChange={(e) => setPaisId(e.target.value)} className="h-12 w-48 rounded-xl border border-input bg-background px-4">
          <option value="">País Direto</option>
          {paises?.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <button type="submit" disabled={loading || (!estadoId && !paisId)} className="flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-all">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          Adicionar
        </button>
      </form>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="p-4 font-bold text-sm text-muted-foreground">Nome da Cidade</th>
              <th className="p-4 font-bold text-sm text-muted-foreground">Localização</th>
              <th className="p-4 font-bold text-sm text-muted-foreground text-right">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cidades?.map((c) => (
              editId === c.id ? (
                <tr key={c.id} className="bg-primary/5">
                  <td colSpan={3} className="p-4">
                    <form onSubmit={(ev) => handleEditSubmit(ev, c.id)} className="flex items-center gap-3">
                      <input value={editNome} onChange={(ev) => setEditNome(ev.target.value)} onBlur={(ev) => setEditNome(capitalizeName(ev.target.value))} className="h-10 flex-1 rounded-lg border border-input px-3" />
                      <select value={editEstadoId} onChange={(ev) => setEditEstadoId(ev.target.value)} className="h-10 w-32 rounded-lg border-input"><option value="">Nenhum</option>{estados?.map(est => <option key={est.id} value={est.id}>{est.uf}</option>)}</select>
                      <button type="submit" className="text-primary font-bold text-xs uppercase">Salvar</button>
                      <button type="button" onClick={() => setEditId(null)} className="text-muted-foreground text-xs uppercase">X</button>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-5 text-xl font-bold text-foreground">{c.nome}</td>
                  <td className="p-5 text-base text-muted-foreground">{c.estado ? `${c.estado.nome} (${c.estado.uf})` : (c.pais?.nome || '-')}</td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditId(c.id); setEditNome(c.nome); setEditEstadoId(c.estado_id ? String(c.estado_id) : ""); setEditPaisId(c.pais_id ? String(c.pais_id) : ""); }} className="p-2.5 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                        <Settings className="h-6 w-6" />
                      </button>
                      <button onClick={() => setDeleteId(c.id)} className="p-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog isOpen={deleteId !== null} title="Excluir Cidade" message="Remover esta cidade permanentemente?" confirmLabel="Excluir" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}