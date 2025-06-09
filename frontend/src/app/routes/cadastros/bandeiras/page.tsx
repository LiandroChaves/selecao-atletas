"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTheme } from "@/utils/context/ThemeContext";
import { useLoading } from "@/utils/context/LoadingProvider";
import { motion } from "framer-motion";
import BotaoTema from "@/utils/utilities/changeTheme";
import { verificarTokenValido } from "@/utils/verificarTokenValido";
import { useRef } from "react";

export default function CadastroBandeiras() {
    const [imagem, setImagem] = useState<File | null>(null);
    const [nome, setNome] = useState("");
    const [bandeiras, setBandeiras] = useState<any[]>([]);
    const [erro, setErro] = useState("");
    const [apiUrl, setApiUrl] = useState("http://localhost:3001"); // valor default
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setIsLoading(false);

        // Definir API_URL no client-side
        if (typeof window !== "undefined") {
            const isLocalhost = window.location.hostname === "localhost";
            const url = isLocalhost
                ? "http://localhost:3001"
                : `http://${window.location.hostname}:3001`;
            setApiUrl(url);
        }
    }, []);

    useEffect(() => {
        if (apiUrl) fetchBandeiras();
    }, [apiUrl]);

    const fetchBandeiras = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/bandeiras/pegarBandeiras`);
            const data = await res.json();
            setBandeiras(data);
        } catch (err) {
            console.error("❌ Erro ao buscar bandeiras:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome.trim()) {
            setErro("⚠️ O nome da bandeira é obrigatório.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!imagem) {
            setErro("⚠️ A imagem da bandeira é obrigatória.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!verificarTokenValido()) return;

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

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("nome", nomeFormatado);
        formData.append("logo_bandeira", imagem);

        try {
            const res = await fetch(`${apiUrl}/api/bandeiras/inserirBandeira`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setNome("");
                setImagem(null);
                fetchBandeiras();
            } else {
                console.warn("⚠️ Erro:", data.error);
            }
        } catch (err) {
            console.error("❌ Erro ao inserir bandeira:", err);
        }
    };

    return (
        <main className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900" : "bg-gradient-to-br from-white via-gray-100 to-gray-200"}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-500 ${isDarkMode ? "bg-teal-800" : "bg-gray-300"}`}
            >
                <button onClick={() => router.back()} className={`flex items-center gap-2 mb-4 text-sm font-medium ${isDarkMode ? "text-lime-200 hover:text-lime-100" : "text-gray-700 hover:text-gray-900"}`}>
                    <FaArrowLeft />
                    <span>Voltar</span>
                </button>

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}>
                    Cadastro de Bandeiras
                </h2>

                <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
                    <label className="flex flex-col items-start gap-1 text-left">
                        <span className={`text-lg font-medium ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}>
                            Nome da bandeira:
                        </span>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white w-full"
                            placeholder="Ex: Brasil"
                        />
                    </label>
                    <label htmlFor="bandeiraInput" className="flex flex-col items-center gap-2">
                        <span className={`text-lg font-medium ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}>
                            Selecione a imagem da bandeira:
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={(e) => setImagem(e.target.files?.[0] ?? null)}
                            className="p-2 bg-white rounded text-black"
                            id="bandeiraInput"
                        />
                    </label>
                    {erro && <p className="text-red-400 font-medium text-sm">{erro}</p>}
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded font-semibold hover:scale-[1.03] transition ${isDarkMode ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900" : "bg-gray-600 hover:bg-gray-500 text-white"}`}
                    >
                        Cadastrar
                    </button>
                </form>

                <ul className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto">
                    {bandeiras.map((bandeira) => (
                        <li key={bandeira.id} className="flex flex-col items-center text-sm">
                            <Image
                                src={`${apiUrl}/assets/pdf/${bandeira.logo_bandeira}`}
                                alt={`Bandeira ${bandeira.id}`}
                                className="w-20 h-14 object-contain rounded shadow"
                                width={80}
                                height={56}
                            />
                            <span className="mt-1 text-white">{bandeira.id} - {(bandeira.nome).toUpperCase()}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            <BotaoTema />
        </main>
    );
}
