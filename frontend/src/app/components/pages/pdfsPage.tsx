// frontend/src/app/components/pages/pdfsPage.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";
import { useTheme } from "../../../utils/context/ThemeContext";
import { useLoading } from "../../../utils/context/LoadingProvider";
import { saveAs } from 'file-saver';
import BotaoTema from "../../../utils/utilities/changeTheme";
import { SketchPicker, ColorResult } from 'react-color';

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
    const [corTituloeBorda, setCorTituloeBorda] = useState("#2957A4"); // valor padrão
    const [corSegundaBorda, setSegundaBorda] = useState("#22c0d4"); // valor padrão
    const [mostrarPickerTitulo, setMostrarPickerTitulo] = useState(false);
    const [mostrarPickerSegunda, setMostrarPickerSegunda] = useState(false);

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

            const res = await fetch(`${API_URL}/api/clubes/pegarClubesComLogo`);
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

        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        const API_URL = isLocalhost
            ? 'http://localhost:3001'
            : `http://${window.location.hostname}:3001`;

        const params = new URLSearchParams({
            clube: clube,
            categoria: categoria,
            corTituloeBorda: corTituloeBorda,
            corSegundaBorda: corSegundaBorda,
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
            setCorTituloeBorda("#2957A4");
            setSegundaBorda("#22c0d4");
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
                <div className={`fixed overflow-y-auto inset-0 ${isDarkMode
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
                    : "bg-gradient-to-br from-white via-gray-100 to-gray-200"} flex items-center justify-center z-50"`} onClick={(e) => e.stopPropagation()}>
                    <div
                        className={`p-6 rounded-lg shadow-lg w-[90%] max-w-md ${isDarkMode ? "bg-teal-800" : "bg-gray-300"}`} onClickCapture={(e) => {
                            // Verifica se o clique foi fora do picker e dos botões "Escolher cor"
                            const target = e.target as HTMLElement;

                            const clicouForaDoPickerTitulo = !target.closest(".picker-titulo");
                            const clicouForaDoBotaoTitulo = !target.closest(".btn-titulo");

                            const clicouForaDoPickerSegunda = !target.closest(".picker-segunda");
                            const clicouForaDoBotaoSegunda = !target.closest(".btn-segunda");

                            if (clicouForaDoPickerTitulo && clicouForaDoBotaoTitulo) {
                                setMostrarPickerTitulo(false);
                            }

                            if (clicouForaDoPickerSegunda && clicouForaDoBotaoSegunda) {
                                setMostrarPickerSegunda(false);
                            }
                        }}
                    >
                        <h2 className={`text-xl font-bold mb-4 text-center ${isDarkMode ? "text-white" : "text-gray-700"}`}>Configurar PDF</h2>

                        {/* Campo Clube */}
                        <div className="mb-4">
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Logo-escudo do PDF</label>
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
                        {/* Campo Cor do Título e primeira borda*/}
                        <div>
                            {/* Primeira cor */}
                            <div className="mb-4">
                                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Cor do Título e primeira borda</label>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-10 h-10 border cursor-pointer rounded btn-titulo"
                                        style={{ backgroundColor: corTituloeBorda }}
                                        onClick={() => setMostrarPickerTitulo(!mostrarPickerTitulo)}
                                    />
                                    <button
                                        type="button"
                                        className={`text-sm ${isDarkMode ? "text-white" : "text-gray-700"} underline btn-titulo`}
                                        onClick={() => setMostrarPickerTitulo(!mostrarPickerTitulo)}
                                    >
                                        {mostrarPickerTitulo ? "Fechar" : "Escolher cor"}
                                    </button>
                                </div>

                                {mostrarPickerTitulo && (
                                    <div className="mt-2 w-full picker-titulo">
                                        <SketchPicker
                                            className="text-black "
                                            color={corTituloeBorda}
                                            onChangeComplete={(color: ColorResult) => setCorTituloeBorda(color.hex)}
                                            width="60%"
                                            presetColors={[
                                                "#2957A4", "#22c0d4", "#FFD700", "#FF8C00", "#DC143C", "#32CD32", "#8A2BE2", "#4B0082",
                                                "#000000", "#808080", "#FFFFFF", "#F5F5F5", "#00CED1", "#20B2AA",
                                                "#FF5733", "#C70039", "#900C3F", "#581845", "#1ABC9C", "#3498DB", "#2ECC71",
                                                "#F39C12", "#E74C3C", "#9B59B6", "#34495E", "#16A085", "#27AE60",
                                                "#F4D03F", "#7D3C98", "#1F618D", "#D5DBDB", "#85929E", "#F7DC6F", "#E67E22",
                                                "#BFC9CA", "#8E44AD", "#2980B9", "#9AE3D3", "#A6ACAF", "#DFFF00", "#F1C40F",
                                                "#2E4053", "#C39BD3", "#2F4F4F" // Adicionando nova cor para evitar duplicação
                                            ]}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Segunda cor */}
                            <div className="mb-4">
                                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Cor da segunda borda</label>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-10 h-10 border cursor-pointer rounded btn-segunda"
                                        style={{ backgroundColor: corSegundaBorda }}
                                        onClick={() => setMostrarPickerSegunda(!mostrarPickerSegunda)}
                                    />
                                    <button
                                        type="button"
                                        className={`text-sm ${isDarkMode ? "text-white" : "text-gray-700"} underline btn-segunda`}
                                        onClick={() => setMostrarPickerSegunda(!mostrarPickerSegunda)}
                                    >
                                        {mostrarPickerSegunda ? "Fechar" : "Escolher cor"}
                                    </button>
                                </div>

                                {mostrarPickerSegunda && (
                                    <div className="mt-2 w-full picker-segunda">
                                        <SketchPicker
                                            className="text-black"
                                            color={corSegundaBorda}
                                            onChangeComplete={(color: ColorResult) => setSegundaBorda(color.hex)}
                                            width="60%"
                                            presetColors={[
                                                "#2957A4", "#22c0d4", "#FFD700", "#FF8C00", "#DC143C", "#32CD32", "#4B0082",
                                                "#000000", "#808080", "#FFFFFF", "#F5F5F5", "#00CED1", "#20B2AA",
                                                "#FF5733", "#C70039", "#900C3F", "#581845", "#1ABC9C", "#3498DB", "#2ECC71",
                                                "#E74C3C", "#9B59B6", "#34495E", "#16A085", "#27AE60",
                                                "#F4D03F", "#7D3C98", "#1F618D", "#D5DBDB", "#85929E", "#F7DC6F", "#E67E22",
                                                "#BFC9CA", "#8E44AD", "#2980B9", "#9AE3D3", "#A6ACAF", "#DFFF00", "#F1C40F",
                                                "#2E4053", "#C39BD3", "#8A2BE2" // Adicionando nova cor para evitar duplicação
                                            ]}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Campo Categoria */}
                        <div className="mb-4">
                            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-white" : "text-gray-700"}`}>Categoria da ficha</label>
                            <select
                                className={`w-full border rounded p-2 text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white`}
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            >
                                <option value="Profissional">Profissional</option>
                                <option value="Base">Base</option>
                                <option value="Amador">Amador</option>
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
