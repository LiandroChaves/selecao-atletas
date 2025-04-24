"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaSearch, FaDatabase, FaInfoCircle, FaFilePdf } from "react-icons/fa";
import BotaoTema from "../../../utils/utilities/changeTheme";
import { useTheme } from "../../../utils/context/ThemeContext";
import { useLoading } from "../../../utils/context/LoadingProvider";

export default function Home() {
    const { isDarkMode } = useTheme();
    const { setIsLoading } = useLoading();
    const router = useRouter();

    const buttons = [
        {
            label: "Cadastrar",
            icon: <FaUserPlus />,
            onClick: () => {
                setIsLoading(true);
                setTimeout(() => {
                    router.push("/routes/cadastros");
                    setIsLoading(false);
                }, 200);
            },
        },
        {
            label: "Busca e Edição", icon: <FaSearch />, onClick: () => {
                setIsLoading(true);
                setTimeout(() => {
                    router.push("/routes/buscaEedicao");
                    setIsLoading(false);
                }, 200);
            },
        },
        {
            label: "Gerar PDFs", icon: <FaFilePdf />, onClick: () => {
                setIsLoading(true);
                setTimeout(() => {
                    router.push("/routes/pdfsPage");
                    setIsLoading(false);
                }, 200);
            },
        },
        {
            label: "Banco de Dados", icon: <FaDatabase />, onClick: () => {
                setIsLoading(true);
                setTimeout(() => {
                    router.push("/routes/banco");
                    setIsLoading(false);
                }, 200);
            },
        },
        {
            label: "Instruções", icon: <FaInfoCircle />, onClick: () => {
                setIsLoading(true);
                setTimeout(() => {
                    router.push("/routes/instrucoes");
                    setIsLoading(false);
                }, 200);
            },
        },
    ];

    return (
        <main
            className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900"
                : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
                }`}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-xs md:max-w-md transition-all duration-500 ${isDarkMode ? "bg-teal-800" : "bg-gray-300"
                    }`}
            >
                <h1
                    className={`text-4xl md:text-5xl font-extrabold mb-8 tracking-wide transition-all duration-500 ${isDarkMode ? "text-white" : "text-gray-700"
                        }`}
                >
                    Cadastro de Atletas
                </h1>
                <div className="flex flex-col space-y-4">
                    {buttons.map(({ label, icon, onClick }, idx) => (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            key={idx}
                            onClick={onClick}
                            className={`flex items-center justify-center gap-3 font-bold py-3 rounded-xl shadow-md transition-all duration-300 ${isDarkMode
                                ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                                : "bg-gray-600 hover:bg-gray-500 text-white"
                                }`}
                        >
                            {icon}
                            {label}
                        </motion.button>
                    ))}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                            localStorage.removeItem("token");
                            router.push("/routes/login");
                        }}
                        className={`flex items-center justify-center gap-3 font-bold py-3 rounded-xl shadow-md transition-all duration-300 ${isDarkMode
                            ? "bg-red-500 hover:bg-red-400 text-white"
                            : "bg-red-200 hover:bg-red-300 text-red-800"
                            }`}
                    >
                        🚪 Sair
                    </motion.button>
                </div>
            </motion.div>
            <BotaoTema />
        </main>
    );
}
