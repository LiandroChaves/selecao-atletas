"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "../../../utils/context/ThemeContext";
import { useLoading } from "../../../utils/context/LoadingProvider";
import BotaoTema from "../../../utils/utilities/changeTheme";
import { FaFilePdf } from "react-icons/fa";

export default function PdfsPage() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();
    const [jogadores, setJogadores] = useState<Jogador[]>([]);
    
    useEffect(() => {
        setIsLoading(false);
    }, []);
    
    interface Jogador {
        id: string | number;
        nome_curto: string;
        nome: string;
    }

    useEffect(() => {
        const fetchJogadores = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/jogadores/pegarJogadores");
                const data = await res.json();
                setJogadores(data);
            } catch (err) {
                console.error("Erro ao buscar jogadores:", err);
            }
        };

        fetchJogadores();
    }, []);


    const gerarPdf = (id: string | number) => {
        window.open(`http://localhost:3001/api/pdf/gerar-pdf/${id}`, "_blank");
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

                <ul className="text-left space-y-2 max-h-[400px] overflow-auto">
                    {jogadores.map((jogador) => (
                        <li key={jogador.id} className="flex justify-between items-center bg-white p-2 rounded-md shadow-md">
                            <span className={`flex items-center justify-between p-2 ${isDarkMode ? "bg-white text-gray-700" : "bg-white text-gray-700"
                                }`}>{jogador.nome}</span>
                            <button
                                onClick={() => gerarPdf(jogador.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex flex-col items-center justify-center"
                            >
                                <FaFilePdf /> Gerar PDF
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <BotaoTema />
        </main>
    );
}
