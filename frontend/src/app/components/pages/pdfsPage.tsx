"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";
import { useTheme } from "../../../utils/context/ThemeContext";
import { useLoading } from "../../../utils/context/LoadingProvider";
import { saveAs } from 'file-saver';
import BotaoTema from "../../../utils/utilities/changeTheme";

export default function PdfsPage() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();
    const [jogadores, setJogadores] = useState<Jogador[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJogador, setSelectedJogador] = useState<Jogador | null>(null);
    const [clube, setClube] = useState("");
    const [categoria, setCategoria] = useState("Base"); // Base ou Profissional
    const [clubes, setClubes] = useState<any[]>([]);

    interface Jogador {
        id: string | number;
        nome_curto: string;
        nome: string;
    }

    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const fetchJogadores = async () => {
            try {
                const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
                const API_URL = isLocalhost
                    ? 'http://localhost:3001'
                    : `http://${window.location.hostname}:3001`;

                const res = await fetch(`${API_URL}/api/jogadores/pegarJogadores`);
                const data = await res.json();
                setJogadores(data);
            } catch (err) {
                console.error("Erro ao buscar jogadores:", err);
            }
        };

        fetchJogadores();
    }, []);

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

    useEffect(() => {
        if (isModalOpen) {
            fetchClubes();
        }
    }, [isModalOpen]);


    const abrirModal = (jogador: Jogador) => {
        setSelectedJogador(jogador);
        setIsModalOpen(true);
    };

    const gerarPdf = async () => {
        if (!selectedJogador) return;

        const isLocalhost = window.location.hostname === 'localhost';
        const API_URL = isLocalhost ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`;

        const params = new URLSearchParams({
            clube: clube,
            categoria: categoria
        });

        const pdfUrl = `${API_URL}/api/pdf/gerar-pdf/${selectedJogador.id}?${params.toString()}`;

        try {
            const response = await fetch(pdfUrl);
            if (!response.ok) throw new Error("Erro ao gerar PDF");

            const blob = await response.blob();
            const filename = `${selectedJogador.nome.replace(/\s+/g, '_')}-ficha-atleta.pdf`;
            saveAs(blob, filename);

            // Fechar o modal após o download
            setIsModalOpen(false);
            setSelectedJogador(null);
            setClube("");
            setCategoria("Base");
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
        }
    };

    return (
        <main className={`min-h-screen flex items-center justify-center p-4 font-[Inter] transition-all duration-500 ${isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
            : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
            }`}>
            <div className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-2xl ${isDarkMode ? "bg-teal-800" : "bg-gray-300"}`}>
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-4 text-sm font-medium ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}
                >
                    <FaArrowLeft />
                    Voltar
                </button>

                <h1 className={`text-3xl md:text-4xl font-extrabold mb-6 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Gerar PDFs dos Jogadores
                </h1>

                {jogadores.length <= 0 ? (
                    <p className={`text-center text-lg font-semibold my-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                        Nenhum jogador disponível para gerar PDF.
                    </p>
                ) : (
                    <ul className="text-left space-y-2 max-h-[400px] overflow-auto">
                        {jogadores.map((jogador) => (
                            <li key={jogador.id} className="flex justify-between items-center bg-white p-2 rounded-md shadow-md">
                                <span className={`flex items-center justify-between p-2 ${isDarkMode ? "bg-white text-gray-700" : "bg-white text-gray-700"}`}>
                                    {jogador.nome}
                                </span>
                                <button
                                    onClick={() => abrirModal(jogador)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex flex-col items-center justify-center"
                                >
                                    <FaFilePdf /> Gerar PDF
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className={`fixed inset-0 ${isDarkMode
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
                    : "bg-gradient-to-br from-white via-gray-100 to-gray-200"} flex items-center justify-center z-50"`}>
                    <div
                        className={`p-6 rounded-lg shadow-lg w-[90%] max-w-md ${isDarkMode ? "bg-teal-800" : "bg-gray-300"}`}
                    >
                        <h2 className="text-xl font-bold mb-4 text-center">Configurar PDF</h2>

                        {/* Campo Clube */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Clube</label>
                            <select
                                className={`w-full border rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white w-full'
                                    }`}
                                value={clube}
                                onChange={(e) => setClube(e.target.value)}
                            >
                                <option value="">Selecione um clube</option>
                                {clubes.map((clube) => (
                                    <option key={clube.id} value={clube.nome}>
                                        {clube.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Campo Categoria */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Categoria</label>
                            <select
                                className={`w-full border rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white`}
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            >
                                <option value="Base">Base</option>
                                <option value="Profissional">Profissional</option>
                            </select>
                        </div>

                        {/* Botões */}
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedJogador(null);
                                    setClube("");
                                    setCategoria("Base");
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded"
                                onClick={gerarPdf}
                            >
                                Gerar PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <BotaoTema />
        </main >
    );
}
