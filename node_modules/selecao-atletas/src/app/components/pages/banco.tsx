"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../utils/context/ThemeContext";
import {
    FaUserPlus, FaDatabase, FaFutbol, FaChartBar, FaHistory,
    FaTrophy, FaSkull, FaGlobe, FaMapMarkedAlt, FaCity
} from "react-icons/fa";
import BotaoTema from "../../../utils/utilities/changeTheme";
import { JSX } from "react/jsx-runtime";
import { useRouter } from "next/navigation";

const icones = {
    jogadores: <FaUserPlus className="text-2xl text-emerald-300" />,
    clubes: <FaDatabase className="text-2xl text-blue-300" />,
    partidas: <FaFutbol className="text-2xl text-yellow-300" />,
    estatisticas_gerais: <FaChartBar className="text-2xl text-purple-300" />,
    historico_clubes: <FaHistory className="text-2xl text-pink-300" />,
    jogadores_titulos: <FaTrophy className="text-2xl text-orange-300" />,
    historico_lesoes: <FaSkull className="text-2xl text-red-400" />,
    paises: <FaGlobe className="text-2xl text-cyan-300" />,
    estados: <FaMapMarkedAlt className="text-2xl text-indigo-300" />,
    cidades: <FaCity className="text-2xl text-lime-300" />,
};

export default function BancoDeDadosPage() {
    const { isDarkMode } = useTheme();
    const [dados, setDados] = useState<{ titulo: string; total: unknown; icone: JSX.Element }[]>([]);
    const [carregando, setCarregando] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDados = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/database/contagem");
                const json = await res.json();

                const dadosConvertidos = Object.entries(json).map(([chave, valor]) => ({
                    titulo: chave.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
                    total: valor,
                    icone: icones[chave as keyof typeof icones] || <FaDatabase className="text-2xl text-gray-400" />,
                }));

                setDados(dadosConvertidos);
            } catch (error) {
                console.error("Erro ao buscar dados do banco:", error);
            } finally {
                setCarregando(false);
            }
        };

        fetchDados();
    }, []);

    return (
        <main
            className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-500 ${isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900"
                : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
                }`}
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`p-8 rounded-2xl shadow-2xl w-full max-w-6xl transition-all duration-500 ${isDarkMode ? "bg-teal-800 text-white" : "bg-gray-300 text-gray-800"
                    }`}
            >
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Painel do Banco de Dados</h1>

                {carregando ? (
                    <p className="text-center animate-pulse">Carregando dados...</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {dados.map(({ titulo, total, icone }, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-4 p-5 rounded-xl shadow-md transition-all duration-300 ${isDarkMode ? "bg-teal-700" : "bg-white"
                                    }`}
                            >
                                {icone}
                                <div>
                                    <h2 className="text-lg font-bold">{titulo}</h2>
                                    <p className="text-sm opacity-80">Total: {String(total)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
                <div className="mt-10 text-center">
                    <p className="text-sm opacity-70">
                        Em breve: ferramentas para visualização relacional, exportação de dados e administração avançada.
                    </p>
                </div>
                <div className="mt-8 flex justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push("/routes/home")}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${isDarkMode
                            ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                            : "bg-gray-700 hover:bg-gray-600 text-white"
                            }`}
                    >
                        Voltar para Início
                    </motion.button>
                </div>
            </motion.div>
            <BotaoTema />
        </main>
    );
}
