"use client";

import { useEffect, useState, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTheme } from "@/utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { motion } from "framer-motion";
import { useLoading } from "@/utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";
import dayjs from "dayjs";


export default function CadastroClubes() {
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [paisId, setPaisId] = useState("");
    const [fundacao, setFundacao] = useState("");
    const [estadio, setEstadio] = useState("");
    const [clubes, setClubes] = useState<any[]>([]);
    const [paises, setPaises] = useState<any[]>([]);
    const [erro, setErro] = useState("");
    const [inicioContrato, setInicioContrato] = useState("");
    const [fimContrato, setFimContrato] = useState("");
    const router = useRouter();
    const [logo, setLogo] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Referência para o input de arquivo
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        setIsLoading(false);
        fetchPaises();
        fetchClubes();
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
        } catch (error) {
            console.error("Erro ao buscar países:", error);
        }
    }

    async function fetchClubes() {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/clubes/pegarClubes`);
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

        const nomeFormatado = nome
            .toLowerCase()
            .split(" ")
            .map((palavra, index) =>
                index === 0 || !["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"].includes(palavra)
                    ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
                    : palavra
            )
            .join(" ");

        const estadioFormatado = estadio
            .toLowerCase()
            .split(" ")
            .map((palavra, index) =>
                index === 0 || !["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"].includes(palavra)
                    ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
                    : palavra
            )
            .join(" ");

        if (!verificarTokenValido()) return;
        const token = localStorage.getItem("token");

        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            // Primeiro: inserir o clube
            const res = await fetch(`${API_URL}/api/clubes/inserirClube`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: Number(id),
                    nome: nomeFormatado,
                    pais_id: Number(paisId),
                    fundacao: fundacao ? Number(fundacao) : null,
                    estadio: estadioFormatado || null,
                    inicio_contrato: inicioContrato || null,
                    fim_contrato: fimContrato || null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("✅ Clube inserido:", data.clube);

                const novoClubeId = data.clube.id; // Pega o ID do clube inserido

                // Segundo: se tiver logo, envia a imagem
                if (logo) {
                    const formData = new FormData();
                    formData.append("url_logo", logo);
                    formData.append("clube_id", novoClubeId.toString());

                    const logoRes = await fetch(`${API_URL}/api/logos-clubes/inserirLogo`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            // NÃO coloca 'Content-Type': multipart/form-data aqui — o browser gera isso automaticamente
                        },
                        body: formData,
                    });

                    const logoData = await logoRes.json();

                    if (logoRes.ok) {
                        console.log("✅ Logo enviada com sucesso:", logoData.logo);
                    } else {
                        console.warn("Erro ao enviar logo:", logoData.error);
                    }
                }

                // Limpa os campos depois de tudo
                setId("");
                setNome("");
                setPaisId("");
                setFundacao("");
                setEstadio("");
                setInicioContrato("");
                setFimContrato("");
                setLogo(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
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

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}>
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
                    <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        Início do contrato do clube (opcional)
                        <input
                            type="date"
                            value={inicioContrato}
                            onChange={(e) => setInicioContrato(e.target.value)}
                            className="mt-1 p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                        />
                    </label>

                    <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        Fim do contrato do clube (opcional)
                        <input
                            type="date"
                            value={fimContrato}
                            onChange={(e) => setFimContrato(e.target.value)}
                            className="mt-1 p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                        />
                    </label>
                    <input type="number" placeholder="Ano de fundação (opcional)" value={fundacao} onChange={(e) => setFundacao(e.target.value)} className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <input placeholder="Estádio (opcional)" value={estadio} onChange={(e) => setEstadio(e.target.value)} className="p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <label className={`text-sm text-left font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        Logo do clube (opcional)
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setLogo(e.target.files[0]);
                                }
                            }}
                            className="mt-1 p-2 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                        />
                    </label>
                    {erro && <p className="text-red-400 font-medium text-sm">{erro}</p>}

                    <button type="submit" className={`px-4 py-2 rounded font-semibold transition duration-300 hover:scale-[1.03] ${isDarkMode ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900" : "bg-gray-600 hover:bg-gray-500 text-white"}`}>
                        Cadastrar
                    </button>
                </form>

                <ul className="space-y-2 text-left max-h-72 overflow-y-auto">
                    {clubes.map((clube) => (
                        <li key={clube.id} className={`p-2 rounded ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"}`}>
                            <strong>ID:</strong> {clube.id} - <strong>{clube.nome}</strong><br />
                            <span className="text-sm">País: {clube.pais?.nome ?? "Não informado"}</span>
                            {clube.inicio_contrato && <div className="text-sm">Início: {dayjs(clube.inicio_contrato).format("DD/MM/YYYY")}</div>}
                            {clube.fim_contrato && <div className="text-sm">Fim: {dayjs(clube.fim_contrato).format("DD/MM/YYYY")}</div>}
                            {clube.fundacao && <div className="text-sm">Fundado em: {clube.fundacao}</div>}
                            {clube.estadio && <div className="text-sm">Local do clube: {clube.estadio}</div>}
                        </li>
                    ))}
                </ul>
            </motion.div>

            <BotaoTema />
        </main>
    );
}
