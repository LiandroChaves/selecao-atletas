"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaSearch, FaDatabase, FaInfoCircle } from "react-icons/fa";

export default function Home() {
    const router = useRouter();

    const buttons = [
        { label: "Cadastrar", icon: <FaUserPlus />, onClick: () => router.push("/routes/cadastros") },
        { label: "Busca e Edição", icon: <FaSearch />, onClick: () => alert("Indo para Busca e Edição") },
        { label: "Banco de Dados", icon: <FaDatabase />, onClick: () => alert("Indo para Banco de Dados") },
        { label: "Instruções", icon: <FaInfoCircle />, onClick: () => alert("Indo para Instruções") },
    ];

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-teal-200 to-teal-300 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-teal-800 text-center p-8 rounded-2xl shadow-2xl w-full max-w-xs md:max-w-md"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-lime-200 mb-8 tracking-wide">
                    Cadastro de Atletas
                </h1>

                <div className="flex flex-col space-y-4">
                    {buttons.map(({ label, icon, onClick }, idx) => (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            key={idx}
                            onClick={onClick}
                            className="flex items-center justify-center gap-3 bg-emerald-400 hover:bg-emerald-300 text-teal-900 font-bold py-3 rounded-xl shadow-md transition-all duration-300"
                        >
                            {icon}
                            {label}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </main>
    );
}
