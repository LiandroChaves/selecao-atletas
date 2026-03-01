"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { apiFetch, fetcher } from "@/lib/api";
import { ArrowLeft, Building2, Pencil, Trash2, Calendar, MapPin, Globe, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { Clube } from "@/types";
import { API_URL } from "@/lib/utils";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { formatDate } from "@/lib/utils";

export default function ClubeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const { data: clube, isLoading } = useSWR<any>(`/clubes/${id}`, fetcher);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        setDeleting(true);
        try {
            await apiFetch(`/clubes/${id}`, { method: "DELETE" });
            router.push("/dashboard/clubes");
        } catch (err) {
            console.error(err);
            setDeleting(false);
            setDeleteOpen(false);
        }
    }

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl flex flex-col gap-6">
                <div className="h-10 w-48 animate-pulse rounded-xl bg-muted" />
                <div className="h-64 animate-pulse rounded-3xl bg-muted" />
            </div>
        );
    }

    if (!clube) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Building2 className="h-16 w-16 text-muted-foreground/20 mb-4" />
                <p className="text-xl font-bold text-muted-foreground">Clube não encontrado</p>
                <Link href="/dashboard/clubes" className="mt-4 text-primary font-bold hover:underline">
                    Voltar para a listagem
                </Link>
            </div>
        );
    }

    const logoUrl = clube.logos?.[0]?.url_logo;

    const isContratoAtivo = () => {
        if (!clube.fim_contrato) return true;
        return new Date(clube.fim_contrato) >= new Date();
    };

    return (
        <div className="mx-auto max-w-4xl flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/clubes"
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-accent transition-all shadow-sm"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight">Detalhes do Parceiro</h1>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">ID #{clube.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/dashboard/clubes/${id}/editar`}
                        className="flex h-12 items-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-bold text-foreground transition-all hover:bg-accent hover:border-primary/50 shadow-sm"
                    >
                        <Pencil className="h-4.5 w-4.5 text-primary" />
                        Editar Dados
                    </Link>
                    <button
                        onClick={() => setDeleteOpen(true)}
                        className="flex h-12 items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-6 text-sm font-bold text-destructive transition-all hover:bg-destructive hover:text-white shadow-sm"
                    >
                        <Trash2 className="h-4.5 w-4.5" />
                        Excluir
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl shadow-black/5">
                <div className="h-3 bg-primary/80 w-full" />

                <div className="p-8 md:p-12">
                    <div className="flex flex-col gap-10 md:flex-row md:items-start">
                        {/* Logo Section */}
                        <div className="relative mx-auto md:mx-0">
                            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl bg-muted/30 border-2 border-border/50 shadow-inner">
                                {logoUrl ? (
                                    <img
                                        src={`${API_URL}/files/${logoUrl}`}
                                        alt={clube.nome}
                                        className="h-full w-full object-contain p-4"
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <Building2 className="h-16 w-16 text-muted-foreground/20" />
                                )}
                            </div>
                            {clube.fim_contrato && (
                                <div className={`absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full border-4 border-card shadow-lg ${isContratoAtivo() ? 'bg-green-500' : 'bg-amber-500'}`}>
                                    {isContratoAtivo() ? <CheckCircle2 className="h-5 w-5 text-white" /> : <AlertCircle className="h-5 w-5 text-white" />}
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="flex flex-1 flex-col gap-6 text-center md:text-left">
                            <div>
                                <h2 className="text-4xl font-black text-foreground mb-2">{clube.nome}</h2>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    {clube.pais && (
                                        <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-bold text-muted-foreground border border-border/50">
                                            {clube.pais.bandeira?.logo_bandeira && (
                                                <img
                                                    src={`${API_URL}/files/${clube.pais.bandeira.logo_bandeira}`}
                                                    alt={clube.pais.nome}
                                                    className="h-3 w-5 object-cover rounded-[1px]"
                                                    crossOrigin="anonymous"
                                                />
                                            )}
                                            {clube.pais.nome.toUpperCase()}
                                        </div>
                                    )}
                                    {clube.fundacao && (
                                        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary border border-primary/10">
                                            <Calendar className="h-4 w-4" />
                                            FUNDADO EM {clube.fundacao}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-2xl bg-muted/20 p-4 border border-border/30">
                                    <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Estádio / Arena</p>
                                        <p className="text-sm font-bold text-foreground">{clube.estadio || "Não informado"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl bg-muted/20 p-4 border border-border/30">
                                    <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Vigência da Parceria</p>
                                        <p className="text-sm font-bold text-foreground">
                                            {clube.inicio_contrato ? formatDate(clube.inicio_contrato) : '...'} até {clube.fim_contrato ? formatDate(clube.fim_contrato) : 'Indeterminado'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteOpen}
                title="Excluir Clube"
                message={`Atenção: Você está prestes a remover o clube "${clube.nome}". Todos os jogadores vinculados e o histórico de logos serão perdidos permanentemente.`}
                confirmLabel="Confirmar Exclusão"
                onConfirm={handleDelete}
                onCancel={() => setDeleteOpen(false)}
                loading={deleting}
            />
        </div>
    );
}