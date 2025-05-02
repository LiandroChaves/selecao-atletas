"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "@/utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { useLoading } from "../../../../utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";

export default function CadastroNiveisAmbidestria() {
    const [descricao, setDescricao] = useState("");
    const [niveis, setNiveis] = useState<{ id: number; descricao: string }[]>([]);
    const [erro, setErro] = useState("");
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault(); // evita comportamento padrão como abrir dropdown
                const form = document.querySelector("form");
                if (form) {
                    form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    async function fetchNiveis() {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/ambidestria/pegarNiveis`);

            const data = await res.json();
            setNiveis(data);
        } catch (error) {
            console.error("❌ Erro ao buscar níveis:", error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!descricao.trim()) {
            setErro("⚠️ A descrição é obrigatória.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        // Formata: primeira letra maiúscula, o resto minúsculo
        const descricaoFormatada =
            descricao.charAt(0).toUpperCase() + descricao.slice(1).toLowerCase();

        // 🔐 Verificação do token
        if (!verificarTokenValido()) return;  // Reutiliza a função para verificar o token

        // ✅ Requisição segura
        try {
            const token = localStorage.getItem("token");

            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/ambidestria/inserirNivel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ descricao: descricaoFormatada }),
            });


            const data = await res.json();

            if (res.ok) {
                console.log("✅ Nível inserido com sucesso:", data.nivel);
                setDescricao("");
                fetchNiveis();
            } else {
                console.warn("⚠️ Falha ao inserir nível:", data.error);
            }
        } catch (error) {
            console.error("❌ Erro ao inserir nível:", error);
        }
    }

    useEffect(() => {
        fetchNiveis();
    }, []);

    return (
        <main
            className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900"
                : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
                }`}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-500 ${isDarkMode ? "bg-teal-800" : "bg-gray-200"}`}
            >
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-4 text-sm font-medium transition duration-200 ${isDarkMode
                        ? "text-lime-200 hover:text-lime-100"
                        : "text-gray-700 hover:text-gray-900"
                        }`}
                >
                    <FaArrowLeft />
                    <span className="text-sm font-medium">Voltar</span>
                </button>

                <h2 className={`text-2xl font-bold mb-4 transition-all duration-500 ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}>
                    Cadastro de Níveis de Ambidestria
                </h2>

                <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
                    <input
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Descrição do nível (ex: Total, Parcial)"
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                    {erro && (
                        <p className="text-red-400 font-medium text-sm">{erro}</p>
                    )}
                    <button
                        className={`px-4 py-2 rounded font-semibold transition duration-300 hover:scale-[1.03] ${isDarkMode
                            ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                            : "bg-gray-600 hover:bg-gray-500 text-white"
                            }`}
                    >
                        Cadastrar
                    </button>
                </form>

                <ul className="space-y-2 text-left max-h-72 overflow-y-auto">
                    {niveis.map((nivel) => (
                        <li
                            key={nivel.id}
                            className={`p-2 rounded transition-all ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}
                        >
                            <span className="font-normal">ID:</span> {nivel.id} - {nivel.descricao}
                        </li>
                    ))}
                </ul>
            </motion.div>

            <BotaoTema />
        </main>
    );
}
