"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface SessionExpiredModalProps {
    isOpen: boolean;
    onConfirm: () => void;
}

export function SessionExpiredModal({ isOpen, onConfirm }: SessionExpiredModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md [&>button]:hidden" onPointerDownOutside={(e: any) => e.preventDefault()} onEscapeKeyDown={(e: any) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <LogOut className="h-5 w-5" />
                        Sessão Expirada
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-base">
                        Sua sessão de 2 horas expirou por motivos de segurança. Por favor, faça login novamente para continuar.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end pt-4">
                    <Button onClick={onConfirm} variant="default" className="w-full sm:w-auto">
                        Voltar para o Login
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
