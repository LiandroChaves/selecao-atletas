"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
    isDarkMode: false,
    toggleTheme: () => {},
});

import { ReactNode } from "react";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            setIsDarkMode(savedTheme === "dark");
        }
    }, []);

    useEffect(() => {
        if (isDarkMode !== null) {
            document.documentElement.classList.toggle("dark", isDarkMode);
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {/* Evita piscar entre temas */}
            {isDarkMode !== null ? children : null}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
