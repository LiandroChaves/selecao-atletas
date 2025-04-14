"use client";

import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTheme } from "@/utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { motion } from "framer-motion";
import { useLoading } from "../../../../utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";

export default function CadastroPaises() {
    const [nome, setNome] = useState("");
    const [paises, setPaises] = useState<{ id: number; nome: string }[]>([]);
    const [erro, setErro] = useState("");
    const router = useRouter();
    const { setIsLoading } = useLoading();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        setIsLoading(false);
    }, []);

    async function fetchPaises() {
        try {
            const res = await fetch("http://localhost:3001/api/paises/pegarPaises");
            const data = await res.json();
            setPaises(data);
        } catch (error) {
            console.error("❌ Erro ao buscar países:", error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!nome.trim()) {
            setErro("⚠️ O nome do país é obrigatório.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!verificarTokenValido()) return;

        const token = localStorage.getItem("token");

        const palavrasMinusculas = ["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"];

        const nomeFormatado = nome
            .toLowerCase()
            .split(" ")
            .map((palavra, index) => {
                if (index === 0 || !palavrasMinusculas.includes(palavra)) {
                    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
                } else {
                    return palavra;
                }
            })
            .join(" ");

        try {
            const res = await fetch("http://localhost:3001/api/paises/inserirPaises", {
                method: "POST",
                body: JSON.stringify({ nome: nomeFormatado }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                console.log("✅ País inserido com sucesso:", data.pais);
            } else {
                console.warn("⚠️ Falha ao inserir país:", data.error);
            }

            setNome("");
            fetchPaises();
        } catch (error) {
            console.error("❌ Erro ao inserir país:", error);
        }
    }


    useEffect(() => {
        fetchPaises();
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
                    <span className="text-sm font-medium">Voltar</span>
                </button>

                <h2 className={`text-2xl font-bold mb-4 transition-all duration-500 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Cadastro de Países
                </h2>

                <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome do país"
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
                    {paises.map((pais) => (
                        <li
                            key={pais.id}
                            className={`p-2 rounded transition-all ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}
                        >
                            <span className="font-normal">ID:</span> {pais.id} - {pais.nome}
                        </li>
                    ))}
                </ul>
            </motion.div>

            <BotaoTema />
        </main>
    );
}
