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
      window.location.href = "/routes/login";
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Token inválido:", error);
    localStorage.removeItem("token");
    window.location.href = "/routes/login";
    return false;
  }
}
