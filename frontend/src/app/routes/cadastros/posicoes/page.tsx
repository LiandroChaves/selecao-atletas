"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "../../../../utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { useLoading } from "../../../../utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";


export default function CadastroPosicoes() {
    const [nome, setNome] = useState("");
    const [posicoes, setPosicoes] = useState<{ id: number; nome: string }[]>([]);
    const [erro, setErro] = useState("");
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchPosicoes();
    }, []);

    async function fetchPosicoes() {
        try {
            const res = await fetch("http://localhost:3001/api/posicoes/pegarPosicoes");
            const data = await res.json();
            setPosicoes(data);
        } catch (err) {
            console.error("Erro ao buscar posições:", err);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!nome.trim()) {
            setErro("⚠️ Preencha o nome da posição.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        // Capitaliza a primeira letra de cada palavra, exceto algumas
        const nomeFormatado = nome
            .toLowerCase()
            .split(" ")
            .map((palavra, index) => {
                const palavrasMinusculas = ["de", "do", "da", "em", "no", "na"];
                if (index === 0 || !palavrasMinusculas.includes(palavra)) {
                    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
                }
                return palavra;
            })
            .join(" ");

        // 🔐 Verificação do token
        if (!verificarTokenValido()) return;  // Reutiliza a função para verificar o token

        // ✅ Requisição segura
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3001/api/posicoes/inserirPosicao", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nome: nomeFormatado }),
            });

            const data = await res.json();

            if (res.ok) {
                setNome("");
                fetchPosicoes();
            } else {
                console.warn("⚠️ Erro ao cadastrar posição:", data.error);
            }
        } catch (err) {
            console.error("Erro ao cadastrar posição:", err);
        }
    }


    return (
        <main className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900"
            : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
            }`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-md ${isDarkMode ? "bg-teal-800" : "bg-gray-300"}`}
            >
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-4 text-sm font-medium ${isDarkMode ? "text-lime-200 hover:text-lime-100" : "text-gray-700 hover:text-gray-900"}`}
                >
                    <FaArrowLeft />
                    <span>Voltar</span>
                </button>

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Cadastro de Posições
                </h2>

                <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome da posição"
                        className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    {erro && <p className="text-red-400 text-sm">{erro}</p>}

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
                    {posicoes.map((posicao) => (
                        <li
                            key={posicao.id}
                            className={`p-2 rounded transition-all ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}
                        >
                            <span className="font-normal">ID:</span> {posicao.id} - {posicao.nome}
                        </li>
                    ))}
                </ul>
            </motion.div>
            <BotaoTema />
        </main>
    );
}
