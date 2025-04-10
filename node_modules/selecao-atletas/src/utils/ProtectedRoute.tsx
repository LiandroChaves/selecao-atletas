"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/app/components/pages/login";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [isChecking, setIsChecking] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const acesso = localStorage.getItem("autenticado");

        if (acesso === "true") {
            setHasAccess(true);
        } else {
            router.push("/routes/login");
        }

        setIsChecking(false);
    }, [router]);


    if (!hasAccess) {
        return (
            <LoginPage/>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
