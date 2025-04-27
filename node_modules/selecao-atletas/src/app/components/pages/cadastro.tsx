"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "../../../utils/context/ThemeContext";
import BotaoTema from "../../../utils/utilities/changeTheme";
import { useLoading } from "../../../utils/context/LoadingProvider"; // certifique-se de ter isso no topo

import {
    FaFlag,
    FaStarHalfAlt,
    FaUserTag,
    FaUsers,
    FaFutbol,
    FaChartLine,
    FaHistory,
    FaBriefcaseMedical,
    FaTrophy,
    FaCity,
    FaMapMarkedAlt,
    FaIdBadge
} from "react-icons/fa";

const cadastros = [
    { label: "Países", icon: <FaFlag /> },
    { label: "Estados", icon: <FaMapMarkedAlt /> },
    { label: "Cidades", icon: <FaCity /> },
    { label: "Níveis Ambidestria", icon: <FaStarHalfAlt /> },
    { label: "Posições", icon: <FaUserTag /> },
    { label: "Clubes", icon: <FaUsers /> },
    { label: "Jogadores", icon: <FaFutbol /> },
    { label: "Estatísticas Gerais", icon: <FaChartLine /> },
    { label: "Partidas", icon: <FaFutbol /> },
    { label: "Estatísticas por Partida", icon: <FaChartLine /> },
    { label: "Histórico de Clubes", icon: <FaHistory /> },
    { label: "Histórico de Lesões", icon: <FaBriefcaseMedical /> },
    { label: "Títulos", icon: <FaTrophy /> },
    { label: "Jogadores - Títulos", icon: <FaTrophy /> },
    { label: "Caracteristica do Jogador", icon: <FaIdBadge /> },
];

function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export default function CadastroOptions() {
    const router = useRouter();
    const { setIsLoading } = useLoading(); // dentro do componente CadastroOptions
    const { isDarkMode } = useTheme();

    return (
        <main
            className={`min-h-screen flex items-center justify-center p-4 font-[Inter] transition-all duration-500 ${isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
                : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
                }`}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-2xl transition-all duration-500 ${isDarkMode ? "bg-teal-800" : "bg-gray-300"
                    }`}
            >
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-4 text-sm font-medium transition duration-200 ${isDarkMode
                        ? "text-lime-200 hover:text-lime-100"
                        : "text-gray-700 hover:text-gray-900"
                        }`}
                >
                    <FaArrowLeft />
                    Voltar
                </button>

                <h1
                    className={`text-3xl md:text-4xl font-extrabold mb-6 tracking-wide transition-all duration-500 ${isDarkMode ? "text-white" : "text-gray-700"
                        }`}
                >
                    O que deseja cadastrar?
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {cadastros.map(({ label, icon }, idx) => {
                        const rota = `/routes/cadastros/${slugify(label)}`;
                        const handleClick = () => {
                            setIsLoading(true);
                            setTimeout(() => {
                                router.push(rota);
                            }, 200); // pequeno delay para garantir exibição da animação
                        };

                        return (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className={`flex items-center justify-center gap-3 font-semibold py-3 px-4 rounded-xl shadow-md transition-all duration-300 ${isDarkMode
                                    ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                                    : "bg-gray-600 hover:bg-gray-500 text-white"
                                    }`}
                                onClick={handleClick}
                            >
                                {icon}
                                {label}
                            </motion.button>
                        );
                    })}

                </div>
            </motion.div>

            <BotaoTema />
        </main>
    );
}
