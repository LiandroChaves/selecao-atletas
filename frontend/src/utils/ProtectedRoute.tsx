"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

interface TokenPayload {
    exp: number;
    iat: number;
    id: number;
    email: string;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [isChecking, setIsChecking] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decoded = jwtDecode<TokenPayload>(token);

                const isExpired = decoded.exp * 1000 < Date.now();
                if (isExpired) {
                    console.warn("⚠️ Token expirado. Redirecionando para login...");
                    localStorage.removeItem("token");
                    router.push("/routes/login");
                }
                else {
                    setHasAccess(true);
                }
            } catch (error) {
                console.error("Token inválido:", error);
                localStorage.removeItem("token");
                router.push("/routes/login");
            }
        } else {
            router.push("/routes/login");
        }

        setIsChecking(false);
    }, [router]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <p className="animate-pulse text-lg">🔐 Verificando acesso...</p>
            </div>
        );
    }


    return hasAccess ? <>{children}</> : null;
};

export default ProtectedRoute;
