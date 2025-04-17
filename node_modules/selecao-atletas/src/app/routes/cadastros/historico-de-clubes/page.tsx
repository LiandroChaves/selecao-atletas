"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "@/utils/context/ThemeContext";
import { useLoading } from "@/utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";
import BotaoTema from "@/utils/utilities/changeTheme";
import { motion } from "framer-motion";
import dayjs from "dayjs";

export default function CadastroHistoricoClubes() {
    const [historicos, setHistoricos] = useState<any[]>([]);
    const [jogadores, setJogadores] = useState<any[]>([]);
    const [clubes, setClubes] = useState<any[]>([]);
    const [form, setForm] = useState({
        jogador_id: "",
        clube_id: "",
        data_entrada: "",
        data_saida: "",
    });
    const [erro, setErro] = useState("");
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();
    const router = useRouter();

    useEffect(() => {
        setIsLoading(false);
        fetchJogadores();
        fetchClubes();
        fetchHistoricos();
    }, []);

    const fetchJogadores = async () => {
        const res = await fetch("http://localhost:3001/api/jogadores/pegarJogadores");
        const data = await res.json();
        setJogadores(data);
    };

    const fetchClubes = async () => {
        const res = await fetch("http://localhost:3001/api/clubes/pegarClubes");
        const data = await res.json();
        setClubes(data);
    };

    const fetchHistoricos = async () => {
        const res = await fetch("http://localhost:3001/api/historico-clubes/pegarHistorico");
        const data = await res.json();
        setHistoricos(data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.jogador_id || !form.clube_id || !form.data_entrada) {
            setErro("⚠️ Jogador, clube e data de entrada são obrigatórios.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!verificarTokenValido()) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:3001/api/historico-clubes/inserirHistorico", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    jogador_id: Number(form.jogador_id),
                    clube_id: Number(form.clube_id),
                    data_entrada: form.data_entrada,
                    data_saida: form.data_saida || null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setForm({ jogador_id: "", clube_id: "", data_entrada: "", data_saida: "" });
                fetchHistoricos();
            } else {
                setErro(data.error || "Erro ao cadastrar histórico.");
                setTimeout(() => setErro(""), 3000);
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            setErro("Erro ao cadastrar.");
        }
    };

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
                    className={`flex items-center gap-2 mb-4 text-sm font-medium ${isDarkMode ? "text-lime-200 hover:text-lime-100" : "text-gray-700 hover:text-gray-900"}`}
                >
                    <FaArrowLeft />
                    <span>Voltar</span>
                </button>

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}>
                    Cadastro de Histórico de Clubes
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                    <select
                        name="jogador_id"
                        value={form.jogador_id}
                        onChange={handleChange}
                        className="p-2 rounded text-black bg-white"
                    >
                        <option value="">Selecione o jogador</option>
                        {jogadores.map((j) => (
                            <option key={j.id} value={j.id}>{j.nome}</option>
                        ))}
                    </select>

                    <select
                        name="clube_id"
                        value={form.clube_id}
                        onChange={handleChange}
                        className="p-2 rounded text-black bg-white"
                    >
                        <option value="">Selecione o clube</option>
                        {clubes.map((c) => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                    <div className="flex flex-col gap-1">
                        <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Data de entrada no clube</label>
                        <input
                            type="date"
                            name="data_entrada"
                            value={form.data_entrada}
                            onChange={handleChange}
                            className="p-2 rounded text-black bg-white"
                            placeholder="Data de entrada"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Data de saída do clube</label>
                            <input
                                type="date"
                                name="data_saida"
                                value={form.data_saida}
                                onChange={handleChange}
                                className="p-2 rounded text-black bg-white"
                                placeholder="Data de saída"
                            />
                    </div>

                    {erro && <p className="text-red-400 text-sm font-medium">{erro}</p>}

                    <button
                        type="submit"
                        className={`px-4 py-2 rounded font-semibold hover:scale-105 transition ${isDarkMode
                            ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                            : "bg-gray-600 hover:bg-gray-500 text-white"
                            }`}
                    >
                        Cadastrar
                    </button>
                </form>

                <ul className="space-y-2 text-left max-h-72 overflow-y-auto">
                    {historicos.map((h) => (
                        <li
                            key={h.id}
                            className={`p-2 rounded ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}
                        >
                            <strong>Jogador:</strong> {h.jogador?.nome ?? "Desconhecido"}<br />
                            <strong>Clube:</strong> {h.clube?.nome ?? "Desconhecido"}<br />
                            Entrada no clube: {dayjs(h.data_entrada).format("DD/MM/YYYY")}<br />
                            Saída do clube: {h.data_saida ? dayjs(h.data_saida).format("DD/MM/YYYY") : "Atual"}
                        </li>
                    ))}
                </ul>

                <BotaoTema />
            </motion.div>
        </main>
    );
}
