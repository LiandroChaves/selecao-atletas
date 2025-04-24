"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTheme } from "../../../utils/context/ThemeContext";
import { FaUserPlus, FaSearch, FaDatabase, FaFilePdf, FaRegEdit, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import BotaoTema from "../../../utils/utilities/changeTheme";

export default function InstrucoesPage() {
    const { isDarkMode } = useTheme();
    const router = useRouter();
    const [hovered, setHovered] = useState<number | null>(null);

    const instrucoes = [
        {
            titulo: "Cadastrar",
            descricao: "Navegue até a seção de cadastro para inserir novos jogadores, clubes, estatísticas, partidas e muito mais.",
            dica: "Use os formulários com campos obrigatórios indicados por bordas coloridas. Ao final, clique em 'Cadastrar' para salvar.",
            icone: <FaUserPlus className="text-xl" />,
        },
        {
            titulo: "Busca e Edição",
            descricao: "Faça buscas por registros existentes e edite informações diretamente por meio de formulários intuitivos.",
            dica: "Pesquisa funcional por nome, clube (caso esteja buscando clubes) ou número de ID. Clique no ícone de lápis para editar e depois em 'Salvar Alterações'.",
            icone: <FaSearch className="text-xl" />,
        },
        {
            titulo: "Gerar PDFs",
            descricao: "Exporte informações como fichas de jogadores e estatísticas em PDF para arquivamento ou impressão.",
            dica: "Selecione o atleta que deseja gerar o PDF e clique em 'Gerar PDF'. Abrirá uma tela de exibição do PDF e você poderá salvar-lo onde quiser. O nome do PDF será dito automáticamente pelo nome do atela, mas você poderá editar antes de salvar-lo.",
            icone: <FaFilePdf className="text-xl" />,
        },
        {
            titulo: "Banco de Dados",
            descricao: "Acompanhe os dados já cadastrados e sua estrutura relacional (em breve).",
            dica: "Esta seção estará disponível em futuras atualizações. Fique ligado!",
            icone: <FaDatabase className="text-xl" />,
        },
        {
            titulo: "Salvar Edições",
            descricao: "Após editar um registro, clique em 'Salvar Alterações' para persistir os dados no banco.",
            dica: "Atenção: alterações não salvas serão perdidas ao sair da página.",
            icone: <FaRegEdit className="text-xl" />,
        },
        {
            titulo: "Confirmação de Sucesso",
            descricao: "Mensagens verdes aparecerão para indicar que a ação foi concluída com sucesso.",
            dica: "Essas mensagens confirmam que o banco foi atualizado corretamente.",
            icone: <FaCheckCircle className="text-green-400 text-xl" />,
        },
    ];

    return (
        <main
            className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-500 ${isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900"
                : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
                }`}
        >
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`p-8 rounded-2xl shadow-2xl w-full max-w-3xl transition-all duration-500 ${isDarkMode ? "bg-teal-800 text-white" : "bg-gray-300 text-gray-800"
                    }`}
            >
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Instruções de Uso</h1>
                <div className="space-y-6">
                    {instrucoes.map(({ titulo, descricao, dica, icone }, idx) => (
                        <motion.div
                            key={idx}
                            onMouseEnter={() => setHovered(idx)}
                            onMouseLeave={() => setHovered(null)}
                            className={`relative flex flex-col md:flex-row items-start gap-4 p-4 rounded-xl shadow-md transition-all duration-300 ${isDarkMode
                                ? "bg-teal-700"
                                : "bg-white"
                                }`}
                        >
                            <div className="mt-1">{icone}</div>
                            <div>
                                <h2 className="font-semibold text-lg">{titulo}</h2>
                                <p className="text-sm">{descricao}</p>
                            </div>

                            <AnimatePresence>
                                {hovered === idx && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className={`absolute left-0 top-full mt-2 z-10 w-full md:w-auto md:max-w-xs rounded-xl shadow-lg px-4 py-2 text-sm ${isDarkMode
                                            ? "bg-emerald-500 text-teal-900"
                                            : "bg-gray-200 text-gray-800"
                                            }`}
                                    >
                                        💡 <span className="font-semibold">Dica:</span> {dica}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-8 flex justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push("/routes/home")}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${isDarkMode
                            ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                            : "bg-gray-700 hover:bg-gray-600 text-white"
                            }`}
                    >
                        Voltar para Início
                    </motion.button>
                </div>
            </motion.div>
            <BotaoTema />
        </main>
    );
}
