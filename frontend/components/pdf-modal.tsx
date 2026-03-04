"use client";

import { useState } from "react";
import { Loader2, FileDown, X } from "lucide-react";
import type { Clube, PDFOptions } from "@/types";

interface PDFModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (options: PDFOptions) => void;
    clubes: Clube[];
    loading?: boolean;
}

export function PDFModal({
    isOpen,
    onClose,
    onConfirm,
    clubes,
    loading = false,
}: PDFModalProps) {
    const [category, setCategory] = useState<PDFOptions["category"]>("Profissional");
    const [clubeId, setClubeId] = useState<number | undefined>(undefined);
    const [temporada, setTemporada] = useState<string>("");
    const [primaryColor, setPrimaryColor] = useState("#10b981"); // Default green
    const [secondaryColor, setSecondaryColor] = useState("#1e1e1e"); // Default dark gray

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!loading ? onClose : undefined}
            />

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-border bg-card p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-muted-foreground/40 hover:text-foreground transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-5">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                            <FileDown className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Exportar PDF</h3>
                            <p className="text-sm font-medium text-muted-foreground">Personalize o relatório do atleta</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Categoria */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Categoria do Relatório</label>
                            <div className="grid grid-cols-3 gap-3">
                                {["Base", "Amador", "Profissional"].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat as any)}
                                        className={`h-12 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${category === cat
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                            : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clube para Logo */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Clube (Logo no Cabeçalho)</label>
                            <select
                                value={clubeId || ""}
                                onChange={(e) => setClubeId(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full h-12 rounded-xl border border-border bg-muted px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all"
                            >
                                <option value="">Nenhum (Sem Logo)</option>
                                {clubes.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nome}</option>
                                ))}
                            </select>
                        </div>

                        {/* Temporada (Opcional - para filtrar stats no PDF) */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Temporada (Deixe vazio para todas)</label>
                            <input
                                value={temporada}
                                onChange={(e) => setTemporada(e.target.value)}
                                placeholder="E.g., 2024, 2024/2025"
                                className="w-full h-12 rounded-xl border border-border bg-muted px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>

                        {/* Cores */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cor Principal</label>
                                <div className="flex items-center gap-3 h-12 rounded-xl border border-border bg-muted/20 px-3">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="h-8 w-8 rounded-lg cursor-pointer bg-transparent border-0"
                                    />
                                    <span className="text-xs font-mono font-bold uppercase">{primaryColor}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cor Secundária</label>
                                <div className="flex items-center gap-3 h-12 rounded-xl border border-border bg-muted/20 px-3">
                                    <input
                                        type="color"
                                        value={secondaryColor}
                                        onChange={(e) => setSecondaryColor(e.target.value)}
                                        className="h-8 w-8 rounded-lg cursor-pointer bg-transparent border-0"
                                    />
                                    <span className="text-xs font-mono font-bold uppercase">{secondaryColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => onConfirm({ category, clube_id: clubeId, temporada: temporada || undefined, primaryColor, secondaryColor })}
                        disabled={loading}
                        className="h-16 w-full rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                <FileDown className="h-6 w-6" /> Gerar Relatório Oficial
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
