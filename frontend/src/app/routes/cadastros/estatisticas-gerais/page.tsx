"use client";

import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTheme } from "@/utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { motion } from "framer-motion";
import { useLoading } from "@/utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";

export default function CadastroEstatisticasGerais() {
    const [jogadorId, setJogadorId] = useState("");
    const [estatisticas, setEstatisticas] = useState<any[]>([]);
    const [jogadores, setJogadores] = useState<Jogador[]>([]);
    const [erro, setErro] = useState("");
    const router = useRouter();
    const { setIsLoading } = useLoading();
    const { isDarkMode } = useTheme();

    interface Jogador {
        id: number;
        nome: string;
        apelido?: string;
        posicao?: { nome: string };
    }

    useEffect(() => {
        setIsLoading(false);
        fetchEstatisticas();
    }, []);



    const [form, setForm] = useState({
        partidas_jogadas: 0,
        gols: 0,
        assistencias: 0,
        titulos: 0,
        faltas_cometidas: 0,
        cartoes_amarelos: 0,
        cartoes_vermelhos: 0,
    });

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm((prev) => ({
            ...prev,
            [field]: value === '' ? 0 : parseInt(value),
        }));
    };

    useEffect(() => {
        async function fetchJogadores() {
            try {
                const res = await fetch("http://localhost:3001/api/jogadores/pegarJogadores");
                const data = await res.json();
                setJogadores(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Erro ao buscar jogadores:", error);
                setIsLoading(false);
            }
        }
        fetchJogadores();
    }, []);


    async function fetchEstatisticas() {
        try {
            const res = await fetch("http://localhost:3001/api/estatisticas/pegarEstatisticasGerais");
            const data = await res.json();
            setEstatisticas(data);
        } catch (error) {
            console.error("❌ Erro ao buscar estatísticas:", error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!jogadorId.trim()) {
            setErro("⚠️ O ID do jogador é obrigatório.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!verificarTokenValido()) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:3001/api/estatisticas/inserirEstatisticaGeral", {
                method: "POST",
                body: JSON.stringify({
                    jogador_id: parseInt(jogadorId),
                    ...form,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });


            const data = await res.json();

            if (res.ok) {
                console.log("✅ Estatística geral inserida com sucesso:", data.estatistica);
                fetchEstatisticas();
                setForm({
                    partidas_jogadas: 0,
                    gols: 0,
                    assistencias: 0,
                    titulos: 0,
                    faltas_cometidas: 0,
                    cartoes_amarelos: 0,
                    cartoes_vermelhos: 0,
                });
            } else {
                console.warn("⚠️ Falha ao inserir estatística:", data.error);
            }

            setJogadorId("");
        } catch (error) {
            console.error("❌ Erro ao inserir estatística:", error);
        }
    }

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
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-500 ${isDarkMode ? "bg-teal-800" : "bg-gray-300"}`}
            >
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-4 text-sm font-medium transition duration-200 ${isDarkMode
                        ? "text-lime-200 hover:text-lime-100"
                        : "text-gray-700 hover:text-gray-900"
                        }`}
                >
                    <FaArrowLeft />
                    <span>Voltar</span>
                </button>

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}>
                    Estatísticas Gerais
                </h2>

                <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
                    <select
                        value={jogadorId}
                        onChange={(e) => setJogadorId(e.target.value)}
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                        <option value="">Selecione um jogador</option>
                        {jogadores.map((jogador) => (
                            <option key={jogador.id} value={jogador.id}>
                                {jogador.nome}
                                {jogador.apelido ? ` (${jogador.apelido})` : ""} - {jogador.posicao?.nome ?? "Sem posição"}
                            </option>
                        ))}
                    </select>
                    <div className="flex flex-col gap-2">
                        <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Partidas jogadas</label>
                        <input
                            type="number"
                            value={form.partidas_jogadas === 0 ? '' : form.partidas_jogadas}
                            onChange={handleChange("partidas_jogadas")}
                            className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                        <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Gols</label>
                        <input
                            type="number"
                            value={form.gols === 0 ? '' : form.gols}
                            onChange={handleChange("gols")}
                            className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                        <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Assistências</label>
                        <input
                            type="number"
                            value={form.assistencias === 0 ? '' : form.assistencias}
                            onChange={handleChange("assistencias")}
                            className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                        <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Títulos</label>
                        <input
                            type="number"
                            value={form.titulos === 0 ? '' : form.titulos}
                            onChange={handleChange("titulos")}
                            className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                        <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Faltas cometidas</label>
                        <input
                            type="number"
                            value={form.faltas_cometidas === 0 ? '' : form.faltas_cometidas}
                            onChange={handleChange("faltas_cometidas")}
                            className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                        <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Cartões amarelos</label>
                        <input
                            type="number"
                            value={form.cartoes_amarelos === 0 ? '' : form.cartoes_amarelos}
                            onChange={handleChange("cartoes_amarelos")}
                            className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />

                        <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Cartões vermelhos</label>
                        <input
                            type="number"
                            value={form.cartoes_vermelhos === 0 ? '' : form.cartoes_vermelhos}
                            onChange={handleChange("cartoes_vermelhos")}
                            className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    {erro && <p className="text-red-400 font-medium text-sm">{erro}</p>}

                    <button
                        className={`px-4 py-2 rounded font-semibold transition duration-300 hover:scale-[1.03] ${isDarkMode
                            ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                            : "bg-gray-600 hover:bg-gray-500 text-white"
                            }`}
                    >
                        Cadastrar Estatística
                    </button>
                </form>


                <ul className="space-y-2 text-left max-h-72 overflow-y-auto">
                    {estatisticas.map((e) => (
                        <li
                            key={e.jogador_id}
                            className={`p-2 rounded transition-all ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}
                        >
                            <span className="font-normal">Jogador: {e.jogadores ? e.jogadores.nome : 'Desconhecido'}</span>
                            <br />
                            <span className="font-normal">Partidas: {e.partidas_jogadas}</span>
                            <br />
                            <span className="font-normal">Gols: {e.gols}</span>
                            <br />
                            <span className="font-normal">Assistências: {e.assistencias}</span>
                            <br />
                            <span className="font-normal">Títulos: {e.titulos}</span>
                            <br />
                            <span className="font-normal">Faltas cometidas: {e.faltas_cometidas}</span>
                            <br />
                            <span className="font-normal">Cartões amarelos: {e.cartoes_amarelos}</span>
                            <br />
                            <span className="font-normal">Cartões vermelhos: {e.cartoes_vermelhos}</span>
                        </li>
                    ))}
                </ul>


            </motion.div>

            <BotaoTema />
        </main>
    );
}
