"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "../../../utils/context/ThemeContext";
import { useLoading } from "../../../utils/context/LoadingProvider";
import Modal from "../modals/modalPesquisaeEdicao";
import {
    FaFlag, FaStarHalfAlt, FaUserTag, FaUsers,
    FaFutbol, FaChartLine, FaHistory,
    FaBriefcaseMedical, FaTrophy, FaCity, FaMapMarkedAlt,
    FaEdit, FaTrash, FaIdBadge
} from "react-icons/fa";
import BotaoTema from "../../../utils/utilities/changeTheme";
import ModalEdicao from "../modals/modalEdicao";

const cadastros = [
    { label: "Países", icon: <FaFlag />, endpoint: "paises/pegarPaises" },
    { label: "Estados", icon: <FaMapMarkedAlt />, endpoint: "estados/pegarEstados" },
    { label: "Cidades", icon: <FaCity />, endpoint: "cidades/pegarCidades" },
    { label: "Níveis Ambidestria", icon: <FaStarHalfAlt />, endpoint: "ambidestria/pegarAmbidestria" },
    { label: "Posições", icon: <FaUserTag />, endpoint: "posicoes/pegarPosicoes" },
    { label: "Clubes", icon: <FaUsers />, endpoint: "clubes/pegarClubes" },
    { label: "Jogadores", icon: <FaFutbol />, endpoint: "jogadores/pegarJogadores" },
    { label: "Caracteristica do Jogador", icon: <FaIdBadge />, endpoint: "caracteristica-jogadores/pegarCaracteristicas" },
    { label: "Estatísticas Gerais", icon: <FaChartLine />, endpoint: "estatisticas/pegarEstatisticasGerais" },
    { label: "Partidas", icon: <FaFutbol />, endpoint: "partidas/pegarPartidas" },
    { label: "Estatísticas por Partida", icon: <FaChartLine />, endpoint: "estatisticas-partidas/pegarEstatisticasPartida" },
    { label: "Histórico de Clubes", icon: <FaHistory />, endpoint: "historico-clubes/pegarHistoricoClubes" },
    { label: "Histórico de Lesões", icon: <FaBriefcaseMedical />, endpoint: "historico-lesoes/pegarHistoricoLesoes" },
    { label: "Títulos", icon: <FaTrophy />, endpoint: "titulos/pegarTitulos" },
    { label: "Jogadores - Títulos", icon: <FaTrophy />, endpoint: "jogadores-titulos/pegarJogadoresTitulos" },
];

export default function BuscaEedicao() {
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();
    const [selected, setSelected] = useState<{ label: string; endpoint: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<any | null>(null);


    const handleSelect = (item: { label: string; endpoint: string }) => {
        setSelected(prev => (prev?.label === item.label ? null : item));
        setSearchTerm("");
    };

    const handleSearch = async () => {
        if (!selected) return;
        try {
            setIsLoading(true);
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/${selected.endpoint}?search=${searchTerm}`);
            console.log("Url: ", res);
            const data = await res.json();
            setResults(data);
            setModalOpen(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={`min-h-screen flex items-center justify-center p-4 font-[Inter] transition-all duration-500 ${isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
            : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
            }`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-2xl ${isDarkMode ? "bg-teal-800" : "bg-gray-300"}`}
            >
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-4 text-sm font-medium ${isDarkMode ? "text-lime-200 hover:text-lime-100" : "text-gray-700 hover:text-gray-900"
                        }`}
                >
                    <FaArrowLeft />
                    Voltar
                </button>

                <h1 className={`text-3xl md:text-4xl font-extrabold mb-6 tracking-wide ${isDarkMode ? "text-white" : "text-gray-700"
                    }`}>
                    O que deseja buscar?
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {cadastros.map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.03 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <button
                                onClick={() => handleSelect(item)}
                                className={`flex items-center justify-center gap-3 font-semibold py-3 px-4 rounded-xl shadow-md w-full transition-all duration-300 ${isDarkMode
                                    ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                                    : "bg-gray-600 hover:bg-gray-500 text-white"
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </button>

                            {selected?.label === item.label && (
                                <div className="flex flex-col w-full gap-2 mt-2">
                                    <input
                                        type="text"
                                        placeholder={`Pesquisar ${item.label}...`}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={`p-2 rounded-md shadow-md outline-none ${isDarkMode
                                            ? "bg-white text-gray-700 placeholder-gray-500"
                                            : "bg-white text-gray-700 placeholder-gray-500"
                                            }`}
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className={`px-4 py-2 rounded font-semibold transition duration-300 hover:scale-[1.03] ${isDarkMode
                                            ? "bg-teal-400 hover:bg-teal-300 text-teal-900"
                                            : "bg-gray-600 hover:bg-gray-500 text-white"
                                            }`}
                                    >
                                        Buscar
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
            <BotaoTema />
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <h2 className={`text-center text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-white"}`}>
                    Resultados
                </h2>
                <div className="flex flex-col gap-2">
                    {results.length > 0 ? (
                        results.map((item, idx) => {
                            // Função para detectar o ID de forma inteligente
                            const getIdFromItem = (item: any) => {
                                return item?.id || Object.entries(item).find(([key]) => key.endsWith("_id"))?.[1];
                            };

                            const getNomeExibicao = (item: any) => {
                                if (!item) return "Item desconhecido";

                                // ⚽ Se for partida
                                if (item.data && (item.gols_casa !== undefined || item.gols_fora !== undefined)) {
                                    const clubeCasa = item.clubeCasa?.nome || "Casa";
                                    const clubeFora = item.clubeFora?.nome || "Fora";
                                    return `${item.data} - ${clubeCasa} ${item.gols_casa} x ${item.gols_fora} ${clubeFora}`;
                                }

                                // 👤 Se for jogador relacionado
                                if (item.nome) return item.nome;
                                if (item.nome_completo) return item.nome_completo;
                                if (item.jogadores?.nome) return item.jogadores.nome;
                                if (item.jogador?.nome) return item.jogador.nome;

                                // 🏥 Se for histórico de lesão
                                if (item.tipo_lesao) return item.tipo_lesao;
                                if (item.descricao) return item.descricao;

                                // 📅 Se tiver só data
                                if (item.data) return item.data;


                                if (item.titulo?.nome) return item.titulo.nome;

                                // 🔢 Se não achar nada, tenta pegar ID
                                if (item.id) return `ID: ${item.id}`;


                                // 📦 Se ainda assim não tiver nada, joga o JSON
                                return JSON.stringify(item);
                            };

                            const id = getIdFromItem(item);

                            return (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between p-2 rounded-md shadow-md ${isDarkMode ? "bg-white text-gray-700" : "bg-white text-gray-700"
                                        }`}
                                >
                                    <span>{getNomeExibicao(item)}</span>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditItem(item);
                                                setEditModalOpen(true);
                                            }}
                                            className={`p-2 rounded-md hover:scale-105 transition ${isDarkMode ? "text-teal-900 hover:bg-teal-100" : "text-gray-800 hover:bg-gray-200"
                                                }`}
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const confirm = window.confirm(`Tem certeza que deseja deletar o item: ${getNomeExibicao(item)}?`);

                                                if (confirm && selected) {
                                                    try {
                                                        const endpointMap: Record<string, string> = {
                                                            "paises/pegarPaises": "paises/deletarPais",
                                                            "estados/pegarEstados": "estados/deletarEstado",
                                                            "cidades/pegarCidades": "cidades/deletarCidade",
                                                            "ambidestria/pegarAmbidestria": "ambidestria/deletarAmbidestria",
                                                            "posicoes/pegarPosicoes": "posicoes/deletarPosicao",
                                                            "clubes/pegarClubes": "clubes/deletarClube",
                                                            "jogadores/pegarJogadores": "jogadores/deletarJogador",
                                                            "estatisticas/pegarEstatisticasGerais": "estatisticas/deletarEstatisticaGeral",
                                                            "partidas/pegarPartidas": "partidas/deletarPartida",
                                                            "estatisticas-partidas/pegarEstatisticasPartida": "estatisticas-partidas/deletarEstatisticaPartida",
                                                            "historico-clubes/pegarHistoricoClubes": "historico-clubes/deletarHistoricoClube",
                                                            "historico-lesoes/pegarHistoricoLesoes": "historico-lesoes/deletarHistoricoLesao",
                                                            "titulos/pegarTitulos": "titulos/deletarTitulo",
                                                            "jogadores-titulos/pegarJogadoresTitulos": "jogadores-titulos/deletarJogadorTitulo",
                                                            "caracteristica-jogadores/pegarCaracteristicas": "caracteristica-jogadores/deletarCaracteristicas"
                                                        };

                                                        const deleteEndpoint = endpointMap[selected.endpoint];

                                                        if (!deleteEndpoint) {
                                                            console.error("Endpoint de deleção não mapeado:", selected.endpoint);
                                                            return;
                                                        }

                                                        if (!id) {
                                                            console.error("ID do item não encontrado para deletar:", item);
                                                            return;
                                                        }

                                                        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
                                                        const API_URL = isLocalhost
                                                            ? 'http://localhost:3001'
                                                            : `http://${window.location.hostname}:3001`;

                                                        await fetch(`${API_URL}/api/${deleteEndpoint}/${id}`, {
                                                            method: "DELETE",
                                                        });


                                                        handleSearch(); // Atualiza os resultados após deletar
                                                    } catch (error) {
                                                        console.error("Erro ao deletar:", error);
                                                    }
                                                }
                                            }}
                                            className={`p-2 rounded-md hover:scale-105 transition ${isDarkMode ? "text-red-300 hover:bg-red-100" : "text-red-700 hover:bg-red-200"
                                                }`}
                                            title="Deletar"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-600 dark:text-gray-300">
                            Nenhum resultado encontrado.
                        </p>
                    )}
                </div>

            </Modal>
            <ModalEdicao
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                item={editItem}
                endpoint={selected?.endpoint || ""}
                onSuccess={handleSearch} // Atualiza os dados após edição
            />
        </main>

    );
}
