import { jwtDecode } from "jwt-decode";

export function verificarTokenValido(): boolean {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("⚠️ Você precisa estar logado para realizar essa ação.");
        window.location.href = "/routes/login";
        return false;
    }

    try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
            alert("⚠️ Sessão expirada. Faça login novamente.");
            localStorage.removeItem("token");
            setTimeout(() => {
                window.location.href = "/routes/login";
            }, 100);
            return false;
        }
        else if (token === "undefined") {
            alert("⚠️ Token inválido. Faça login novamente.");
            localStorage.removeItem("token");
            setTimeout(() => {
                window.location.href = "/routes/login";
            }, 100);
            return false;
        }
        else if (token === "null") {
            alert("⚠️ Token inválido. Faça login novamente.");
            localStorage.removeItem("token");
            setTimeout(() => {
                window.location.href = "/routes/login";
            }, 100);
            return false;
        }
        else if (token === "") {
            alert("⚠️ Token inválido. Faça login novamente.");
            localStorage.removeItem("token");
            setTimeout(() => {
                window.location.href = "/routes/login";
            }, 100);
            return false;
        }
        return true;
    } catch (error) {
        console.error("❌ Token inválido:", error);
        alert("⚠️ Token inválido. Faça login novamente.");
        localStorage.removeItem("token");
        setTimeout(() => {
            window.location.href = "/routes/login";
        }, 100);
        return false;
    }
}
