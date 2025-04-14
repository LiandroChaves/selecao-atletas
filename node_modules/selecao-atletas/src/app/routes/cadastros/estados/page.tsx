"use client";

import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTheme } from "@/utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { motion } from "framer-motion";
import { useLoading } from "../../../../utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";


export default function CadastroEstados() {
    const [nome, setNome] = useState("");
    const [uf, setUf] = useState("");
    const [paisId, setPaisId] = useState("");
    const [paises, setPaises] = useState<{ id: number; nome: string }[]>([]);
    const [estados, setEstados] = useState<{ id: number; nome: string; uf: string }[]>([]);
    const [erro, setErro] = useState("");
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchPaises();
        fetchEstados();
    }, []);

    async function fetchPaises() {
        try {
            const res = await fetch("http://localhost:3001/api/paises/pegarPaises");
            const data = await res.json();
            setPaises(data);
        } catch (err) {
            console.error("❌ Erro ao buscar países:", err);
        }
    }

    async function fetchEstados() {
        try {
            const res = await fetch("http://localhost:3001/api/estados/pegarEstados");
            const data = await res.json();
            console.log("📦 Estados recebidos:", data);
            setEstados(data);
        } catch (err) {
            console.error("❌ Erro ao buscar estados:", err);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!nome.trim() || !uf.trim() || !paisId) {
            setErro("⚠️ Preencha todos os campos.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        const ufValido = /^[A-Z]{2}$/.test(uf.trim().toUpperCase());
        if (!ufValido) {
            setErro("⚠️ A UF deve conter exatamente 2 letras maiúsculas.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        // 🔐 Verificação do token
        if (!verificarTokenValido()) return;  // Reutiliza a função para verificar o token

        // ✅ Requisição segura
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3001/api/estados/inserirEstados", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    uf: uf.trim().toUpperCase(),
                    pais_id: parseInt(paisId),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("✅ Estado cadastrado:", data.estado);
                setNome("");
                setUf("");
                setPaisId("");
                fetchEstados();
            } else {
                console.warn("⚠️ Erro ao cadastrar estado:", data.error);
            }
        } catch (err) {
            console.error("❌ Erro ao cadastrar estado:", err);
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
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-md ${isDarkMode ? "bg-teal-800" : "bg-gray-300"}`}
            >
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-4 text-sm font-medium ${isDarkMode
                        ? "text-lime-200 hover:text-lime-100"
                        : "text-gray-700 hover:text-gray-900"
                        }`}
                >
                    <FaArrowLeft />
                    Voltar
                </button>

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Cadastro de Estados
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Nome do estado"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="text"
                        placeholder="UF (Ex: SP)"
                        value={uf}
                        maxLength={2}
                        onChange={(e) => setUf(e.target.value.toUpperCase())}
                        className="p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <select
                        value={paisId}
                        onChange={(e) => setPaisId(e.target.value)}
                        className="p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="">Selecione o país</option>
                        {paises.map((pais) => (
                            <option key={pais.id} value={pais.id}>
                                {pais.nome}
                            </option>
                        ))}
                    </select>
                    {erro && <p className="text-red-400 font-medium text-sm">{erro}</p>}
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
                    {estados.map((estado) => (
                        <li
                            key={estado.id}
                            className={`p-2 rounded ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}
                        >
                            <span className="font-normal">ID:</span> {estado.id} - {estado.nome} ({estado.uf})
                        </li>
                    ))}
                </ul>
            </motion.div>

            <BotaoTema />
        </main>
    );
}
