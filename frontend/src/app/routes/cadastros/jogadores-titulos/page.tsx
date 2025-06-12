"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "@/utils/context/ThemeContext";
import { useLoading } from "@/utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";
import BotaoTema from "@/utils/utilities/changeTheme";
import { motion } from "framer-motion";
import { useDisableOnSubmit } from "@/utils/hooks/useDisableOnSubmit";

export default function CadastroJogadoresTitulos() {
    const [form, setForm] = useState({
        jogador_id: "",
        titulo_id: "",
        ano: "",
        clube_id: "",
    });
    const [erro, setErro] = useState("");
    const [jogadores, setJogadores] = useState<any[]>([]);
    const [titulos, setTitulos] = useState<any[]>([]);
    const [clubes, setClubes] = useState<any[]>([]);
    const [jogadoresTitulos, setJogadoresTitulos] = useState<any[]>([]);
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();
    const router = useRouter();
    const { isSubmitting, handleSubmitWrapper } = useDisableOnSubmit();

    useEffect(() => {
        setIsLoading(false);
        fetchJogadores();
        fetchTitulos();
        fetchClubes();
        fetchJogadoresTitulos();
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

    const fetchJogadores = async () => {
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        const API_URL = isLocalhost
            ? 'http://localhost:3001'
            : `http://${window.location.hostname}:3001`;

        const res = await fetch(`${API_URL}/api/jogadores/pegarJogadores`);
        const data = await res.json();
        setJogadores(data);
    };

    const fetchTitulos = async () => {
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        const API_URL = isLocalhost
            ? 'http://localhost:3001'
            : `http://${window.location.hostname}:3001`;

        const res = await fetch(`${API_URL}/api/titulos/pegarTitulos`);
        const data = await res.json();
        setTitulos(data);
    };

    const fetchClubes = async () => {
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        const API_URL = isLocalhost
            ? 'http://localhost:3001'
            : `http://${window.location.hostname}:3001`;

        const res = await fetch(`${API_URL}/api/clubes/pegarClubes`);
        const data = await res.json();
        setClubes(data);
    };

    const fetchJogadoresTitulos = async () => {
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        const API_URL = isLocalhost
            ? 'http://localhost:3001'
            : `http://${window.location.hostname}:3001`;

        const res = await fetch(`${API_URL}/api/jogadores-titulos/pegarJogadoresTitulos`);

        const data = await res.json();
        setJogadoresTitulos(data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    async function submitForm() {
        if (!form.jogador_id || !form.titulo_id || !form.ano || !form.clube_id) {
            setErro("⚠️ Preencha todos os campos.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!verificarTokenValido()) return;
        const token = localStorage.getItem("token");

        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/jogadores-titulos/inserirJogadorTitulo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    jogador_id: Number(form.jogador_id),
                    titulo_id: Number(form.titulo_id),
                    ano: Number(form.ano),
                    clube_id: Number(form.clube_id),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setForm({
                    jogador_id: "",
                    titulo_id: "",
                    ano: "",
                    clube_id: "",
                });
                fetchJogadoresTitulos();
            } else {
                setErro(data.error || "Erro ao cadastrar título do jogador.");
                setTimeout(() => setErro(""), 3000);
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            setErro("Erro ao cadastrar.");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmitWrapper(submitForm);
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
                    Cadastro de Títulos de Jogadores
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
                        name="titulo_id"
                        value={form.titulo_id}
                        onChange={handleChange}
                        className="p-2 rounded text-black bg-white"
                    >
                        <option value="">Selecione o título</option>
                        {titulos.map((t) => (
                            <option key={t.id} value={t.id}>{t.nome} ({t.tipo})</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="ano"
                        placeholder="Ano do título"
                        value={form.ano}
                        onChange={handleChange}
                        className="p-2 rounded text-black bg-white"
                    />

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

                    {erro && <p className="text-red-400 text-sm font-medium">{erro}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded font-semibold transition duration-300 hover:scale-[1.03] ${isDarkMode
                            ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                            : "bg-gray-600 hover:bg-gray-500 text-white"
                            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>

                <ul className="space-y-2 text-left max-h-72 overflow-y-auto">
                    {jogadoresTitulos.map((jt, index) => (
                        <li
                            key={index}
                            className={`p-2 rounded ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}
                        >
                            <strong>Jogador:</strong> {jt.jogador_id ? jogadores.find((j) => j.id === jt.jogador_id)?.nome : "N/A"}
                            <br />
                            <strong>Título:</strong> {jt.titulo_id ? titulos.find((t) => t.id === jt.titulo_id)?.nome : "N/A"}
                            <br />
                            <strong>Ano:</strong> {jt.ano}
                            <br />
                            <strong>Clube:</strong> {jt.clube_id ? clubes.find((c) => c.id === jt.clube_id)?.nome : "N/A"}
                        </li>
                    ))}
                </ul>
            </motion.div>
            <BotaoTema />
        </main>
    );
}
