"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "../../../../utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { useLoading } from "../../../../utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";


export default function CadastroCidades() {
    const [nome, setNome] = useState("");
    const [paisId, setPaisId] = useState("");
    const [estadoId, setEstadoId] = useState("");
    const [paises, setPaises] = useState<{ id: number; nome: string }[]>([]);
    const [estados, setEstados] = useState<{ id: number; nome: string }[]>([]);
    const [cidades, setCidades] = useState<{ id: number; nome: string; estado_id?: number; pais_id?: number }[]>([]);
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
        fetchCidades();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault(); // evita comportamento padrão como abrir dropdown
                const form = document.querySelector("form");
                if (form) {
                    form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    async function fetchPaises() {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/paises/pegarPaises`);
            const data = await res.json();
            setPaises(data);
        } catch (err) {
            console.error("Erro ao buscar países:", err);
        }
    }

    async function fetchEstados() {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/estados/pegarEstados`);
            const data = await res.json();
            setEstados(data);
        } catch (err) {
            console.error("Erro ao buscar estados:", err);
        }
    }

    async function fetchCidades() {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/cidades/pegarCidades`);

            const data = await res.json();
            setCidades(data);
        } catch (err) {
            console.error("Erro ao buscar estados:", err);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!nome.trim() || !paisId || !estadoId) {
            setErro("⚠️ Preencha todos os campos.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!verificarTokenValido()) return;

        const token = localStorage.getItem("token");

        const nomeFormatado = nome
            .toLowerCase()
            .split(" ")
            .map((palavra, index) => {
                const palavrasMinusculas = ["da", "de", "do", "das", "dos"];
                if (index === 0 || !palavrasMinusculas.includes(palavra)) {
                    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
                }
                return palavra;
            })
            .join(" ");

        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/cidades/inserirCidade`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: nomeFormatado,
                    pais_id: parseInt(paisId),
                    estado_id: parseInt(estadoId),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setNome("");
                setPaisId("");
                setEstadoId("");
                console.log("✅ Cidade cadastrada:", data.cidade);
                fetchCidades();
            } else {
                console.warn("⚠️ Erro ao cadastrar cidade:", data.error);
            }
        } catch (err) {
            console.error("Erro ao cadastrar cidade:", err);
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
                    className={`flex items-center gap-2 mb-4 text-sm font-medium ${isDarkMode ? "text-lime-200 hover:text-lime-100" : "text-gray-700 hover:text-gray-900"}`}
                >
                    <FaArrowLeft />
                    <span>Voltar</span>
                </button>

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}>
                    Cadastro de Cidades
                </h2>

                <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome da cidade"
                        className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <select
                        value={paisId}
                        onChange={(e) => setPaisId(e.target.value)}
                        className="p-2 rounded bg-white text-black"
                    >
                        <option value="">Selecione um país</option>
                        {paises.map((pais) => (
                            <option key={pais.id} value={pais.id}>{pais.nome}</option>
                        ))}
                    </select>

                    <select
                        value={estadoId}
                        onChange={(e) => setEstadoId(e.target.value)}
                        className="p-2 rounded bg-white text-black"
                    >
                        <option value="">Selecione um estado</option>
                        {estados.map((estado) => (
                            <option key={estado.id} value={estado.id}>{estado.nome}</option>
                        ))}
                    </select>

                    {erro && <p className="text-red-400 text-sm">{erro}</p>}

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
                    {cidades.map((cidade) => {
                        const estado = estados.find((estado) => estado.id === cidade.estado_id);
                        const pais = paises.find((pais) => pais.id === cidade.pais_id);
                        return (
                            <li
                                key={cidade.id}
                                className={`p-2 rounded transition-all ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}
                            >
                                <span className="font-normal">ID:</span> {cidade.id} - {cidade.nome}
                                <br />
                                <div className="flex items-center">
                                    {estado && (
                                        <span className="ml-2 text-sm italic">(Estado: {estado.nome}) -</span>
                                    )}
                                    {pais && (
                                        <span className="ml-2 text-sm italic">(País: {pais.nome})</span>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </motion.div>
            <BotaoTema />
        </main>
    );
}
