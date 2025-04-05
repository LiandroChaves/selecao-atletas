"use client";

import { useState, useEffect } from "react";

export default function CadastroPaises() {
    const [nome, setNome] = useState("");
    const [paises, setPaises] = useState<{ id: number; nome: string }[]>([]);

    async function fetchPaises() {
        const res = await fetch("/api/paises");
        const data = await res.json();
        setPaises(data);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await fetch("/api/paises", {
            method: "POST",
            body: JSON.stringify({ nome }),
            headers: { "Content-Type": "application/json" },
        });
        setNome("");
        fetchPaises();
    }

    useEffect(() => {
        fetchPaises();
    }, []);

    return (
        <div className="p-6 text-white bg-gray-800 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Cadastro de Países</h2>
            <form onSubmit={handleSubmit} className="mb-6">
                <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do país"
                    className="p-2 rounded text-black mr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                />
                <button className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-400 font-bold">
                    Cadastrar
                </button>
            </form>
            <ul className="space-y-2">
                {paises.map((pais) => (
                    <li key={pais.id} className="bg-teal-700 p-2 rounded">{pais.nome}</li>
                ))}
            </ul>
        </div>
    );
}
