"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "@/utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { useLoading } from "../../../../utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";
import dayjs from "dayjs";


export default function CadastroPartidas() {
    const [data, setData] = useState("");
    const [campeonato, setCampeonato] = useState("");
    const [estadio, setEstadio] = useState("");
    const [clubeCasaId, setClubeCasaId] = useState<number | null>(null);
    const [clubeForaId, setClubeForaId] = useState<number | null>(null);
    const [clubes, setClubes] = useState<{ id: number; nome: string }[]>([]);
    const [golsCasa, setGolsCasa] = useState<number | null>(null);
    const [golsFora, setGolsFora] = useState<number | null>(null);

    const [erro, setErro] = useState("");
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();
    const [partidas, setPartidas] = useState<Partida[]>([]);

    interface Partida {
        id: number;
        data: string;
        clubeCasa?: { nome: string };
        clubeFora?: { nome: string };
        estadio?: string;
        gols_casa?: number;
        gols_fora?: number;
    }

    useEffect(() => {
        setIsLoading(false);
        buscarClubes();
    }, []);

    useEffect(() => {
        buscarPartidas();
    }, []);

    async function buscarClubes() {
        try {
            const res = await fetch("http://localhost:3001/api/clubes/pegarClubes");
            const data = await res.json();
            setClubes(data);
        } catch (error) {
            console.error("❌ Erro ao buscar clubes:", error);
        }
    }

    async function buscarPartidas() {
        try {
            const res = await fetch("http://localhost:3001/api/partidas/pegarPartidas");
            const data = await res.json();
            setPartidas(data);
        } catch (error) {
            console.error("❌ Erro ao buscar partidas:", error);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        console.log('Dados enviados:', { data, campeonato, estadio, clubeCasaId, clubeForaId });

        if (!data || !clubeCasaId || !clubeForaId) {
            setErro("⚠️ Preencha todos os campos obrigatórios.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!verificarTokenValido()) return;

        try {
            const token = localStorage.getItem("token");


            const nomeFormatado = campeonato
                .toLowerCase()
                .split(" ")
                .map((palavra, index) =>
                    index === 0 || !["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"].includes(palavra)
                        ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
                        : palavra
                )
                .join(" ");

            const nomeFormatado1 = estadio
                .toLowerCase()
                .split(" ")
                .map((palavra, index) =>
                    index === 0 || !["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"].includes(palavra)
                        ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
                        : palavra
                )
                .join(" ");

            const res = await fetch("http://localhost:3001/api/partidas/inserirPartida", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    data,
                    campeonato: nomeFormatado,
                    estadio: nomeFormatado1,
                    clube_casa_id: clubeCasaId,
                    clube_fora_id: clubeForaId,
                    gols_casa: golsCasa,
                    gols_fora: golsFora,

                }),
            });

            const resultado = await res.json();

            if (res.ok) {
                console.log("✅ Partida cadastrada:", resultado.partida);
                setData("");
                setCampeonato("");
                setEstadio("");
                setClubeCasaId(null);
                setClubeForaId(null);
                setGolsCasa(null);
                setGolsFora(null);
                buscarPartidas();
            } else {
                console.warn("⚠️ Erro ao cadastrar:", resultado.error);
            }
        } catch (error) {
            console.error("❌ Erro na requisição:", error);
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
                    Cadastro de Partidas
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                    <div className="flex flex-col gap-1">
                        <label
                            className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                            htmlFor="data"
                        >
                            Data da Partida
                        </label>
                        <input
                            id="data"
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            className="p-2 rounded text-black bg-white"
                        />
                    </div>

                    <input
                        placeholder="Campeonato"
                        value={campeonato}
                        onChange={(e) => setCampeonato(e.target.value)}
                        className="p-2 rounded text-black bg-white"
                    />
                    <input
                        placeholder="Local da partida"
                        value={estadio}
                        onChange={(e) => setEstadio(e.target.value)}
                        className="p-2 rounded text-black bg-white"
                    />
                    <select
                        value={clubeCasaId ?? ""}
                        onChange={(e) => setClubeCasaId(Number(e.target.value))}
                        className="p-2 rounded text-black bg-white"
                    >
                        <option value="">Clube Casa</option>
                        {clubes.map((c) => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                    <select
                        value={clubeForaId ?? ""}
                        onChange={(e) => setClubeForaId(Number(e.target.value))}
                        className="p-2 rounded text-black bg-white"
                    >
                        <option value="">Clube Fora</option>
                        {clubes.map((c) => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Gols Clube Casa"
                        value={golsCasa ?? ""}
                        onChange={(e) => setGolsCasa(Number(e.target.value))}
                        className="p-2 rounded text-black bg-white"
                    />
                    <input
                        type="number"
                        placeholder="Gols Clube Fora"
                        value={golsFora ?? ""}
                        onChange={(e) => setGolsFora(Number(e.target.value))}
                        className="p-2 rounded text-black bg-white"
                    />
                    {erro && <p className="text-red-400 text-sm font-medium">{erro}</p>}
                    <button
                        className={`px-4 py-2 rounded font-semibold hover:scale-105 transition ${isDarkMode
                            ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                            : "bg-gray-600 hover:bg-gray-500 text-white"
                            }`}
                    >
                        Cadastrar Partida
                    </button>
                </form>
                <ul className="space-y-2 text-left max-h-72 overflow-y-auto">
                    {partidas.map((partida) => (
                        <li
                            key={partida.id}
                            className={`p-2 rounded ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}
                        >
                            <strong>ID:</strong> {partida.id} -{" "}
                            <strong>{dayjs(partida.data).format("DD/MM/YYYY")}</strong>
                            <br />
                            <span className="text-sm">
                                <strong>Clube Casa:</strong> {partida.clubeCasa?.nome ?? "Não informado"}
                            </span>
                            <br />
                            <span className="text-sm">
                                <strong>Clube Fora:</strong> {partida.clubeFora?.nome ?? "Não informado"}
                            </span>
                            <br />
                            {partida.gols_casa && (
                                <div className="text-sm">
                                    <strong>Gols Clube Casa:</strong> {partida.gols_casa}
                                </div>
                            )}
                            {partida.gols_fora && (
                                <div className="text-sm">
                                    <strong>Gols Clube Fora:</strong> {partida.gols_fora}
                                </div>
                            )}
                            {partida.estadio && (
                                <div className="text-sm">
                                    <strong>Local da partida:</strong> {partida.estadio}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <BotaoTema />
            </motion.div>
        </main>
    );
}
