"use client";

import { useState, useEffect } from "react";

export default function CadastroPaises() {
    const [nome, setNome] = useState("");
    const [paises, setPaises] = useState<{ id: number; nome: string }[]>([]);

    // PEGAR
    async function fetchPaises() {
        try {
            const res = await fetch("http://localhost:3001/api/paises/pegarPaises");
            const data = await res.json();
            setPaises(data);
            console.log("🌍 Países carregados:", data);
        } catch (error) {
            console.error("❌ Erro ao buscar países:", error);
        }
    }

    // INSERIR
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!nome.trim()) {
            console.warn("⚠️ Nome do país está vazio");
            return;
        }

        // Capitaliza a primeira letra
        const nomeFormatado = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();

        try {
            const res = await fetch("http://localhost:3001/api/paises/inserirPaises", {
                method: "POST",
                body: JSON.stringify({ nome: nomeFormatado }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (res.ok) {
                console.log("✅ País inserido com sucesso:", data.pais);
            } else {
                console.warn("⚠️ Falha ao inserir país:", data.error);
            }

            setNome("");
            fetchPaises();
        } catch (error) {
            console.error("❌ Erro ao inserir país:", error);
        }
    }

    useEffect(() => {
        fetchPaises();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white p-6">
            <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Cadastro de Países</h2>
                <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome do país"
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                    <button className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-400 font-bold text-gray-800 transition duration-200 trasition-transform transform hover:scale-103 cursor-pointer">
                        Cadastrar
                    </button>
                </form>
                <ul className="space-y-2">
                    {paises.map((pais) => (
                        <li key={pais.id} className="bg-teal-700 p-2 rounded">
                            <span className="font-semibold">ID:</span> {pais.id} -{" "}
                            {pais.nome}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
}
