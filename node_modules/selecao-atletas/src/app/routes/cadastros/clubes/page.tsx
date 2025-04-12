"use client";

import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTheme } from "@/utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { motion } from "framer-motion";
import { useLoading } from "@/utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";

export default function CadastroClubes() {
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [paisId, setPaisId] = useState("");
    const [fundacao, setFundacao] = useState("");
    const [estadio, setEstadio] = useState("");
    const [clubes, setClubes] = useState<any[]>([]);
    const [paises, setPaises] = useState<any[]>([]);
    const [erro, setErro] = useState("");
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        setIsLoading(false);
        fetchPaises();
        fetchClubes();
    }, []);

    async function fetchPaises() {
        try {
            const res = await fetch("http://localhost:3001/api/paises/pegarPaises");
            const data = await res.json();
            setPaises(data);
        } catch (error) {
            console.error("Erro ao buscar países:", error);
        }
    }

    async function fetchClubes() {
        try {
            const res = await fetch("http://localhost:3001/api/clubes/pegarClubes");
            const data = await res.json();
            setClubes(data);
        } catch (error) {
            console.error("Erro ao buscar clubes:", error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!nome || !paisId) {
            setErro("⚠️ ID, nome e país são obrigatórios.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!verificarTokenValido()) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:3001/api/clubes/inserirClube", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: Number(id),
                    nome,
                    pais_id: Number(paisId),
                    fundacao: fundacao ? Number(fundacao) : null,
                    estadio: estadio || null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("✅ Clube inserido:", data.clube);
                setId("");
                setNome("");
                setPaisId("");
                setFundacao("");
                setEstadio("");
                fetchClubes();
            } else {
                console.warn("Erro ao inserir clube:", data.error);
                setErro(data.error || "Erro ao inserir clube.");
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

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Cadastro de Clubes
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                    <input placeholder="Nome do clube" value={nome} onChange={(e) => setNome(e.target.value)} className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <select value={paisId} onChange={(e) => setPaisId(e.target.value)} className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option value="">Selecione o país</option>
                        {paises.map((pais) => (
                            <option key={pais.id} value={pais.id}>{pais.nome}</option>
                        ))}
                    </select>
                    <input type="number" placeholder="Ano de fundação (opcional)" value={fundacao} onChange={(e) => setFundacao(e.target.value)} className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <input placeholder="Estádio (opcional)" value={estadio} onChange={(e) => setEstadio(e.target.value)} className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />

                    {erro && <p className="text-red-400 font-medium text-sm">{erro}</p>}

                    <button type="submit" className={`px-4 py-2 rounded font-semibold transition duration-300 hover:scale-[1.03] ${isDarkMode ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900" : "bg-gray-600 hover:bg-gray-500 text-white"}`}>
                        Cadastrar
                    </button>
                </form>

                <ul className="space-y-2 text-left">
                    {clubes.map((clube) => (
                        <li key={clube.id} className={`p-2 rounded ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}>
                            <strong>ID:</strong> {clube.id} - <strong>{clube.nome}</strong><br />
                            <span className="text-sm">País: {clube.pais?.nome ?? "Não informado"}</span>
                            {clube.fundacao && <div className="text-sm">Fundado em: {clube.fundacao}</div>}
                            {clube.estadio && <div className="text-sm">Estádio: {clube.estadio}</div>}
                        </li>
                    ))}
                </ul>
            </motion.div>

            <BotaoTema />
        </main>
    );
}
