"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "@/utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { motion } from "framer-motion";
import { useLoading } from "@/utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";
import dayjs from "dayjs";

export default function CadastroEstatisticasPartidas() {
    const [estatisticas, setEstatisticas] = useState<any[]>([]);
    const [jogadores, setJogadores] = useState<any[]>([]);
    const [partidas, setPartidas] = useState<any[]>([]);
    const [form, setForm] = useState({
        jogador_id: "",
        partida_id: "",
        minutos_jogados: "",
        gols: "",
        assistencias: "",
        passes_totais: "",
        passes_certos: "",
        passes_errados: "",
        finalizacoes: "",
        finalizacoes_no_alvo: "",
        desarmes: "",
        faltas_cometidas: "",
        cartoes_amarelos: "",
        cartoes_vermelhos: "",
    });
    const [erro, setErro] = useState("");
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();
    const router = useRouter();

    useEffect(() => {
        setIsLoading(false);
        fetchJogadores();
        fetchPartidas();
        fetchEstatisticas();
    }, []);

    const fetchJogadores = async () => {
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        const API_URL = isLocalhost
            ? 'http://localhost:3001'
            : `http://${window.location.hostname}:3001`;

        const res = await fetch(`${API_URL}/api/jogadores/pegarJogadores`);
        const data = await res.json();
        setJogadores(data);
    };

    const fetchPartidas = async () => {
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        const API_URL = isLocalhost
            ? 'http://localhost:3001'
            : `http://${window.location.hostname}:3001`;

        const res = await fetch(`${API_URL}/api/partidas/pegarPartidas`);
        const data = await res.json();
        setPartidas(data);
    };

    const fetchEstatisticas = async () => {
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        const API_URL = isLocalhost
            ? 'http://localhost:3001'
            : `http://${window.location.hostname}:3001`;

        const res = await fetch(`${API_URL}/api/estatisticas-partidas/pegarEstatisticasPartida`);
        const data = await res.json();
        setEstatisticas(data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    function somaInvalida(certos: string, errados: string, total: string): boolean {
        if (certos === "" || errados === "" || total === "") return false;

        const s = Number(certos);
        const e = Number(errados);
        const t = Number(total);

        return !isNaN(s) && !isNaN(e) && !isNaN(t) && (s + e > t);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.jogador_id || !form.partida_id) {
            setErro("⚠️ Jogador e partida são obrigatórios.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (somaInvalida(form.passes_certos, form.passes_errados, form.passes_totais)) {
            setErro("⚠️ A soma de passes certos e errados não pode ser maior que os passes totais.");
            setTimeout(() => setErro(""), 4000);
            return;
        }

        // 🚫 Verificação para campos numéricos negativos
        const camposNumericos = [
            "minutos_jogados",
            "gols",
            "assistencias",
            "passes_totais",
            "passes_certos",
            "passes_errados",
            "finalizacoes",
            "finalizacoes_no_alvo",
            "desarmes",
            "faltas_cometidas",
            "cartoes_amarelos",
            "cartoes_vermelhos",
        ];

        for (const campo of camposNumericos) {
            const valor = Number(form[campo as keyof typeof form]);
            if (!isNaN(valor) && valor < 0) {
                setErro(`⚠️ O campo "${campo.replace(/_/g, " ")}" não pode ser negativo.`);
                setTimeout(() => setErro(""), 4000);
                return;
            }
        }

        if (!verificarTokenValido()) return;
        const token = localStorage.getItem("token");

        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/estatisticas-partidas/inserirEstatisticaPartida`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...form,
                    jogador_id: Number(form.jogador_id),
                    partida_id: Number(form.partida_id),
                    minutos_jogados: Number(form.minutos_jogados) || 0,
                    gols: Number(form.gols) || 0,
                    assistencias: Number(form.assistencias) || 0,
                    passes_totais: Number(form.passes_totais) || 0,
                    passes_certos: Number(form.passes_certos) || 0,
                    passes_errados: Number(form.passes_errados) || 0,
                    finalizacoes: Number(form.finalizacoes) || 0,
                    finalizacoes_no_alvo: Number(form.finalizacoes_no_alvo) || 0,
                    desarmes: Number(form.desarmes) || 0,
                    faltas_cometidas: Number(form.faltas_cometidas) || 0,
                    cartoes_amarelos: Number(form.cartoes_amarelos) || 0,
                    cartoes_vermelhos: Number(form.cartoes_vermelhos) || 0,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setForm({
                    jogador_id: "",
                    partida_id: "",
                    minutos_jogados: "",
                    gols: "",
                    assistencias: "",
                    passes_totais: "",
                    passes_certos: "",
                    passes_errados: "",
                    finalizacoes: "",
                    finalizacoes_no_alvo: "",
                    desarmes: "",
                    faltas_cometidas: "",
                    cartoes_amarelos: "",
                    cartoes_vermelhos: "",
                });
                fetchEstatisticas();
            } else {
                setErro(data.error || "Erro ao cadastrar estatística.");
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
                    className={`flex items-center gap-2 mb-4 text-sm font-medium transition duration-200 ${isDarkMode
                        ? "text-lime-200 hover:text-lime-100"
                        : "text-gray-700 hover:text-gray-900"
                        }`}
                >
                    <FaArrowLeft />
                    <span>Voltar</span>
                </button>

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}>
                    Cadastro de Estatísticas por partida
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
                        name="partida_id"
                        value={form.partida_id}
                        onChange={handleChange}
                        className="p-2 rounded text-black bg-white"
                    >
                        <option value="">Selecione a partida</option>
                        {partidas.map((p) => (
                            <option key={p.id} value={p.id}>ID {p.id} - Dia: {dayjs(p.data).format("DD/MM/YYYY")}</option>
                        ))}
                    </select>

                    {[
                        "minutos_jogados",
                        "gols",
                        "assistencias",
                        "passes_totais",
                        "passes_certos",
                        "passes_errados",
                        "finalizacoes",
                        "finalizacoes_no_alvo",
                        "desarmes",
                        "faltas_cometidas",
                        "cartoes_amarelos",
                        "cartoes_vermelhos",
                    ].map((campo) => (
                        <input
                            key={campo}
                            type="number"
                            name={campo}
                            placeholder={campo.replace(/_/g, " ")}
                            value={form[campo as keyof typeof form]}
                            onChange={handleChange}
                            className="p-2 rounded text-black bg-white"
                        />
                    ))}

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
                    {estatisticas.map((e) => (
                        <li
                            key={e.id}
                            className={`p-2 rounded ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}
                        >
                            <strong>Jogador:</strong> {e.jogador?.nome ?? "Jogador desconhecido"}
                            <br />
                            <strong>Partida:</strong> {dayjs(e.partida?.data).format("DD/MM/YYYY") ?? "Data não informada"}
                            <br />
                            Gols marcados: {e.gols}
                            <br />
                            Minutos jogados: {e.minutos_jogados} minutos
                            <br />
                            Assistências feitas: {e.assistencias}
                            <br />
                            Passes totais: {e.passes_totais}
                            <br />
                            Passes certos: {e.passes_certos} | Passes errados: {e.passes_errados}
                            <br />
                            Finalizações: {e.finalizacoes} | Finalizações no alvo: {e.finalizacoes_no_alvo}
                            <br />
                            Desarmes: {e.desarmes} | Faltas cometidas: {e.faltas_cometidas}
                            <br />
                            Cartões amarelos: {e.cartoes_amarelos} | Cartões vermelhos: {e.cartoes_vermelhos}
                        </li>
                    ))}
                </ul>
            </motion.div>
            <BotaoTema />
        </main>

    );
}
