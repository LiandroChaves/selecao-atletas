import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
    const [autenticado, setAutenticado] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const expiracao = localStorage.getItem("expiracao");

        if (!token || !expiracao) {
            router.push("/routes/login");
            return;
        }

        const agora = Date.now();
        if (agora > parseInt(expiracao)) {
            localStorage.removeItem("token");
            localStorage.removeItem("expiracao");
            router.push("/routes/login");
            return;
        }

        setAutenticado(true);
    }, [router]);

    return autenticado;
}
