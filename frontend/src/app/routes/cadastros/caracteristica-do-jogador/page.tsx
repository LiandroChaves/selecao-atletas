"use client";

import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTheme } from "@/utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { motion } from "framer-motion";
import { useLoading } from "@/utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";

export default function CadastroDescricaoJogador() {
    const [jogadorId, setJogadorId] = useState("");
    const [descricao, setDescricao] = useState("");
    const [caracteristicas, setCaracteristicas] = useState<any[]>([]);
    const [jogadores, setJogadores] = useState<any[]>([]);
    const [erro, setErro] = useState("");
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        setIsLoading(false);
        fetchCaracteristicas();
        fetchJogadores();
    }, []);

    async function fetchCaracteristicas() {
        try {
            const res = await fetch("http://localhost:3001/api/caracteristica-jogadores/pegarCaracteristicas");
            const data = await res.json();
            setCaracteristicas(data);
        } catch (error) {
            console.error("Erro ao buscar descrições:", error);
        }
    }

    async function fetchJogadores() {
        try {
            const res = await fetch("http://localhost:3001/api/jogadores/pegarJogadores");
            const data = await res.json();
            setJogadores(data);
        } catch (error) {
            console.error("Erro ao buscar jogadores:", error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!jogadorId || !descricao) {
            setErro("⚠️ Jogador e descrição são obrigatórios.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!verificarTokenValido()) return;
        const token = localStorage.getItem("token");

        const nomeFormatado = descricao
            .toLowerCase()
            .split(" ")
            .map((palavra, index) =>
                index === 0 || !["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"].includes(palavra)
                    ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
                    : palavra
            )
            .join(" ");

        try {
            const res = await fetch("http://localhost:3001/api/caracteristica-jogadores/inserirCaracteristicas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    jogador_id: Number(jogadorId),
                    descricao: nomeFormatado,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("✅ Característica inserida:", data.caracteristica);
                setJogadorId("");
                setDescricao("");
                fetchCaracteristicas();
            } else {
                console.warn("Erro ao inserir característica:", data.error);
                setErro(data.error || "Erro ao inserir descrição.");
                setTimeout(() => setErro(""), 3000);
            }
        } catch (error) {
            console.error("Erro ao enviar dados:", error);
            setErro("Erro ao enviar dados.");
        }
    }

    return (
        <main className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900" : "bg-gradient-to-br from-white via-gray-100 to-gray-200"}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-500 ${isDarkMode ? "bg-teal-800" : "bg-gray-300"}`}
            >
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-4 text-sm font-medium ${isDarkMode ? "text-lime-200 hover:text-lime-100" : "text-gray-700 hover:text-gray-900"}`}
                >
                    <FaArrowLeft />
                    <span>Voltar</span>
                </button>

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}>
                    Cadastro de Descrição do Jogador
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                    <select
                        name="jogador_id"
                        value={jogadorId}
                        onChange={(e) => setJogadorId(e.target.value)}
                        className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="">Selecione o jogador</option>
                        {jogadores.map((jogador) => (
                            <option key={jogador.id} value={jogador.id}>
                                {jogador.nome}
                            </option>
                        ))}
                    </select>

                    <input
                        placeholder="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                    {erro && <p className="text-red-400 font-medium text-sm">{erro}</p>}

                    <button
                        type="submit"
                        className={`px-4 py-2 rounded font-semibold transition duration-300 hover:scale-[1.03] ${isDarkMode ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900" : "bg-gray-600 hover:bg-gray-500 text-white"}`}
                    >
                        Cadastrar
                    </button>
                </form>

                <ul className="space-y-2 text-left max-h-72 overflow-y-auto">
                    {caracteristicas.map((caracteristica) => (
                        <li
                            key={caracteristica.id}
                            className={`p-2 rounded ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}
                        >
                            <strong>Jogador:</strong> {caracteristica.jogador.nome}<br />
                            <strong>Característica:</strong> {caracteristica.descricao}<br />
                        </li>
                    ))}
                </ul>
            </motion.div>
            <BotaoTema />
        </main>
    );
}
