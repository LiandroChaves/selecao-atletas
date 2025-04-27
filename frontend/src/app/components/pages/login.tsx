"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "../../../utils/context/ThemeContext";
import BotaoTema from "../../../utils/utilities/changeTheme";
import { FaSignInAlt, FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { useLoading } from "@/utils/context/LoadingProvider";
import { ModalLicencaExpirada } from "../modals/modalLicecaExpirada";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const { setIsLoading } = useLoading();
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const router = useRouter();
    const { isDarkMode } = useTheme();
    const [mostrarModalCadastro, setMostrarModalCadastro] = useState(false);
    const [novoUsuario, setNovoUsuario] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [mostrarSenhaLogin, setMostrarSenhaLogin] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json(); // <- só aqui! (UMA VEZ)

            if (response.status === 403) {
                throw new Error("Licença expirada. Favor entrar em contato com o desenvolvedor.");
            }

            if (!response.ok) {
                throw new Error(data.mensagem || "Erro ao autenticar");
            }

            // Salva token e autenticação
            localStorage.setItem("token", data.token);
            localStorage.setItem("autenticado", "true");
            localStorage.setItem("token_expira_em", Date.now() + 3600000 + ""); // +1h

            router.push("/routes/home");
        } catch (err: any) {
            console.log("Erro no login:", err.message);
            if (err.message.includes("Licença expirada")) {
                setModalAberto(true); // abre o modal
            } else {
                setErro(err.message || "Erro ao autenticar.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main
            className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900"
                : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
                }`}
        >
            <motion.form
                onSubmit={handleLogin}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className={`w-full max-w-xs md:max-w-md rounded-2xl shadow-2xl p-8 transition-all duration-500 ${isDarkMode ? "bg-teal-800" : "bg-gray-300"
                    }`}
            >
                <h2
                    className={`text-3xl md:text-4xl font-bold text-center mb-6 transition-all duration-500 ${isDarkMode ? "text-white" : "text-gray-700"
                        }`}
                >
                    Faça login
                </h2>

                {erro && (
                    <p className="text-red-400 text-sm text-center mb-4 font-medium">
                        {erro}
                    </p>
                )}

                <ModalLicencaExpirada
                    isOpen={modalAberto}
                    onClose={() => setModalAberto(false)}
                    title="Licença Expirada"
                    message="Sua licença expirou. Por favor, entre em contato com o desenvolvedor para renovação."
                />

                <div className="mb-4">
                    <label
                        className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                    >
                        Email
                    </label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        required
                    />
                </div>

                <div className="mb-6 relative">
                    <label
                        className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                    >
                        Senha
                    </label>
                    <input
                        type={mostrarSenhaLogin ? "text" : "password"}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        placeholder="Digite sua senha"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setMostrarSenhaLogin(!mostrarSenhaLogin)}
                        className={`absolute right-3 top-9 text-lg ${isDarkMode ? "text-white" : "text-gray-700"}`}
                    >
                        {mostrarSenhaLogin ? <FaEyeSlash color="gray" /> : <FaEye color="gray" />}
                    </button>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl shadow-md transition-all duration-300 ${isDarkMode
                        ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                        : "bg-gray-600 hover:bg-gray-500 text-white"
                        }`}
                >
                    <FaSignInAlt />
                    Entrar
                </motion.button>
                <motion.button
                    type="button"
                    onClick={() => setMostrarModalCadastro(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className={`mt-4 w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl shadow-md transition-all duration-300 ${isDarkMode
                        ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                        : "bg-gray-600 hover:bg-gray-500 text-white"
                        }`}
                >
                    <FaUserPlus />
                    Cadastre-se
                </motion.button>
                <AnimatePresence>
                    {mostrarModalCadastro && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 ${isDarkMode
                                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900"
                                : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
                                }`}
                        >

                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`w-full max-w-md rounded-2xl p-6 shadow-lg relative ${isDarkMode ? "bg-teal-800" : "bg-gray-300"
                                    }`}
                            >
                                <button
                                    onClick={() => setMostrarModalCadastro(false)}
                                    className="absolute top-2 right-4 text-2xl font-bold hover:text-red-400"
                                >
                                    &times;
                                </button>
                                <h3 className="text-xl font-semibold text-center mb-4">Cadastro</h3>
                                <div className="mb-4">
                                    <label className={`block text-sm mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Usuário</label>
                                    <input
                                        type="text"
                                        value={novoUsuario}
                                        onChange={(e) => setNovoUsuario(e.target.value)}
                                        className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-black border-gray-400`}
                                        placeholder="Digite seu email ou nome"
                                        required
                                    />
                                </div>
                                <div className="mb-4 relative">
                                    <label className={`block text-sm mb-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Senha</label>
                                    <input
                                        type={mostrarSenha ? "text" : "password"}
                                        value={novaSenha}
                                        onChange={(e) => setNovaSenha(e.target.value)}
                                        className="w-full p-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-black"
                                        placeholder="Digite sua senha"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                        className={`absolute right-3 top-9 text-lg ${isDarkMode ? "text-white" : "text-gray-700"}`}
                                    >
                                        {mostrarSenha ? <FaEyeSlash color="gray" /> : <FaEye color="gray" />}
                                    </button>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={async () => {
                                        try {
                                            const res = await fetch("http://localhost:3001/api/usuarios/cadastro", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ email: novoUsuario, senha: novaSenha }),
                                            });

                                            const data = await res.json();

                                            if (res.ok) {
                                                alert("Usuário cadastrado com sucesso!");
                                                setMostrarModalCadastro(false);
                                            } else {
                                                alert(data.message || "Erro ao cadastrar.");
                                            }
                                        } catch (error) {
                                            console.error("Erro ao cadastrar:", error);
                                            alert("Erro de conexão com o servidor.");
                                        }
                                    }}
                                    className={`mt-4 w-full py-2 rounded-xl font-semibold shadow-md transition-all duration-300 ${isDarkMode
                                        ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900"
                                        : "bg-gray-700 hover:bg-gray-600 text-white"
                                        }`}
                                >
                                    Cadastrar
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.form>


            <BotaoTema />
        </main>
    );
}
