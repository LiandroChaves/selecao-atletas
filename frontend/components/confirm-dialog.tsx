"use client";

import { Loader2, AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    danger?: boolean;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = "Confirmar",
    onConfirm,
    onCancel,
    loading = false,
    danger = true,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!loading ? onCancel : undefined}
            />

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full ${danger ? "bg-destructive/10" : "bg-primary/10"
                            }`}
                    >
                        <AlertTriangle
                            className={`h-7 w-7 ${danger ? "text-destructive" : "text-primary"}`}
                        />
                    </div>

                    <div>
                        <h3 className="text-base font-bold text-card-foreground">{title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
                    </div>

                    <div className="flex w-full gap-3">
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 rounded-lg border border-border bg-background py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 ${danger
                                    ? "bg-destructive hover:bg-destructive/90"
                                    : "bg-primary hover:bg-primary/90"
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                confirmLabel
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
