"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "@/utils/context/ThemeContext";
import { useLoading } from "@/utils/context/LoadingProvider";
import BotaoTema from "@/utils/utilities/changeTheme";
import { verificarTokenValido } from "@/utils/verificarTokenValido";
import { motion } from "framer-motion";

export default function CadastroTitulos() {
    const [titulos, setTitulos] = useState<any[]>([]);
    const [form, setForm] = useState({
        nome: "",
        tipo: "",
    });
    const [erro, setErro] = useState("");
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();
    const router = useRouter();

    useEffect(() => {
        setIsLoading(false);
        fetchTitulos();
    }, []);

    const fetchTitulos = async () => {
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        const API_URL = isLocalhost
            ? 'http://localhost:3001'
            : `http://${window.location.hostname}:3001`;

        const res = await fetch(`${API_URL}/api/titulos/pegarTitulos`);

        const data = await res.json();
        setTitulos(data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.nome || !form.tipo) {
            setErro("⚠️ Nome e tipo são obrigatórios.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!verificarTokenValido()) return;
        const token = localStorage.getItem("token");

        const nomeFormatado = form.nome
            .toLowerCase()
            .split(" ")
            .map((palavra, index) =>
                index === 0 || !["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"].includes(palavra)
                    ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
                    : palavra
            )
            .join(" ");


        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/titulos/inserirTitulo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: nomeFormatado,
                    tipo: form.tipo,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setForm({ nome: "", tipo: "" });
                fetchTitulos();
            } else {
                setErro(data.error || "Erro ao cadastrar título.");
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
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-500 ${isDarkMode ? "bg-teal-800" : "bg-gray-200"
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
                    <span>Voltar</span>
                </button>

                <h2
                    className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-lime-200" : "text-gray-700"
                        }`}
                >
                    Cadastro de Títulos
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome do título"
                        value={form.nome}
                        onChange={handleChange}
                        className="p-2 rounded text-black bg-white"
                    />

                    <select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        className="p-2 rounded text-black bg-white"
                    >
                        <option value="">Selecione o tipo</option>
                        <option value="Nacional">Nacional</option>
                        <option value="Internacional">Internacional</option>
                        <option value="Individual">Individual</option>
                    </select>

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
                    {titulos.map((t) => (
                        <li
                            key={t.id}
                            className={`p-2 rounded ${isDarkMode
                                ? "bg-teal-600 text-white"
                                : "bg-white text-black border border-gray-300"
                                }`}
                        >
                            <strong>Nome:</strong> {t.nome}
                            <br />
                            <strong>Tipo:</strong> {t.tipo}
                        </li>
                    ))}
                </ul>

            </motion.div>
            <BotaoTema />
        </main>
    );
}
