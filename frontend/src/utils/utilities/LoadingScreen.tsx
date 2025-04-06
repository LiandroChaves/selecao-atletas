"use client";
import { useLoading } from "../context/LoadingProvider";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function LoadingScreen() {
    const { isLoading } = useLoading();
    const { isDarkMode } = useTheme();

    if (!isLoading) return null;

    const bgColor =
        isDarkMode
            ? "bg-gray-900 bg-opacity-90 text-white border-white"
            : "bg-white bg-opacity-90 text-gray-900 border-gray-900";

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${bgColor}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`text-center ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
                <div className="text-3xl font-bold mb-4">Carregando...</div>
                <motion.div
                    className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto ${
                        isDarkMode
                            ? "border-white border-t-transparent"
                            : "border-gray-900 border-t-transparent"
                    }`}
                />
            </motion.div>
        </div>
    );
}
