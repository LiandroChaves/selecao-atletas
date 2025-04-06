"use client";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

export default function BotaoTema() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`fixed top-4 right-4 p-2 rounded-full shadow-md transition
                ${isDarkMode
                    ? "bg-teal-600 text-white hover:bg-teal-500"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
        >
            {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
    );
}
