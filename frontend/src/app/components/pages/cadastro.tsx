// app/cadastrar/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    FaUserShield,
} from "react-icons/fa";

const cadastros = [
    { label: "Países", icon: <FaFlag /> },
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
    { label: "Agentes", icon: <FaUserShield /> },
    { label: "Jogadores - Agentes", icon: <FaUserShield /> },
];

// Função utilitária para transformar label em slug
function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9]+/g, "-")     // Substitui espaços/acentos por hífen
        .replace(/(^-|-$)+/g, "");       // Remove hífens extras no início/fim
}

export default function CadastroOptions() {
    const router = useRouter();

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-teal-200 to-teal-300 p-4 font-[Inter]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-teal-800 text-center p-8 rounded-2xl shadow-2xl w-full max-w-2xl"
            >
                <h1 className="text-3xl md:text-4xl font-extrabold text-lime-200 mb-6 tracking-wide">
                    O que deseja cadastrar?
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {cadastros.map(({ label, icon }, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center justify-center gap-3 bg-emerald-400 hover:bg-emerald-300 text-teal-900 font-semibold py-3 px-4 rounded-xl shadow-md transition-all duration-300"
                            onClick={() => router.push(`/routes/cadastros/${slugify(label)}`)}
                        >
                            {icon}
                            {label}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </main>
    );
}
