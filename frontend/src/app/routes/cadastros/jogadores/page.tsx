"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "@/utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { useLoading } from "@/utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";

export default function CadastroJogadores() {
    const [nome, setNome] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [paisId, setPaisId] = useState("");
    const [nacionalidade, setNacionalidade] = useState("");
    const [estadoId, setEstadoId] = useState("");
    const [cidadeId, setCidadeId] = useState("");
    const [altura, setAltura] = useState("");
    const [peso, setPeso] = useState("");
    const [peDominante, setPeDominante] = useState("");
    const [nivelAmbidestriaId, setNivelAmbidestriaId] = useState("");
    const [posicaoId, setPosicaoId] = useState("");
    const [clubeId, setClubeId] = useState("");
    const [contratoInicio, setContratoInicio] = useState("");
    const [contratoFim, setContratoFim] = useState("");
    const [foto, setFoto] = useState("");
    const [jogadores, setJogadores] = useState<any[]>([]);
    const [erro, setErro] = useState("");
    const [niveis, setNiveis] = useState<{ id: number; descricao: string }[]>([]);
    const [paises, setPaises] = useState<any[]>([]);
    const [estados, setEstados] = useState<any[]>([]);
    const [cidades, setCidades] = useState<any[]>([]);
    const [clubes, setClubes] = useState<any[]>([]);
    const [posicoes, setPosicoes] = useState<any[]>([]);
    const { setIsLoading } = useLoading();
    const { isDarkMode } = useTheme();
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        fetchPaises();
        fetchEstados();
        fetchCidades();
        fetchClubes();
        fetchPosicoes();
        fetchNiveis();
        fetchJogadores();
    }, []);

    const fetchPaises = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/paises/pegarPaises");
            const data = await res.json();
            setPaises(data);
        } catch (err) {
            console.error("Erro ao buscar países:", err);
        }
    };

    const fetchEstados = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/estados/pegarEstados");
            const data = await res.json();
            setEstados(data);
        } catch (err) {
            console.error("Erro ao buscar estados:", err);
        }
    };

    const fetchCidades = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/cidades/pegarCidades");
            const data = await res.json();
            setCidades(data);
        } catch (err) {
            console.error("Erro ao buscar cidades:", err);
        }
    };

    const fetchClubes = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/clubes/pegarClubes");
            const data = await res.json();
            setClubes(data);
        } catch (err) {
            console.error("Erro ao buscar clubes:", err);
        }
    };

    const fetchPosicoes = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/posicoes/pegarPosicoes");
            const data = await res.json();
            setPosicoes(data);
        } catch (err) {
            console.error("Erro ao buscar posições:", err);
        }
    };

    const fetchNiveis = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/ambidestria/pegarNiveis");
            const data = await res.json();
            setNiveis(data);
        } catch (error) {
            console.error("Erro ao buscar níveis:", error);
        }
    };

    const fetchJogadores = async () => {
        try {
            const res = await fetch("http://localhost:3001/api/jogadores/pegarJogadores");
            const data = await res.json();
            setJogadores(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Erro ao buscar jogadores:", error);
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome.trim() || !dataNascimento.trim() || !paisId || !cidadeId || !altura.trim() || !peso.trim() || !peDominante || !nivelAmbidestriaId || !posicaoId || !clubeId) {
            setErro("⚠️ Todos os campos são obrigatórios.");
            setTimeout(() => setErro(""), 3000);
            return;
        }

        if (!verificarTokenValido()) return;
        const token = localStorage.getItem("token");

        const nomeFormatado = nome
            .toLowerCase()
            .split(" ")
            .map((palavra, index) =>
                index === 0 || !["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"].includes(palavra)
                    ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
                    : palavra
            )
            .join(" ");

        try {
            const res = await fetch("http://localhost:3001/api/jogadores/inserirJogador", {
                method: "POST",
                body: JSON.stringify({
                    nome: nomeFormatado,
                    data_nascimento: dataNascimento,
                    pais_id: parseInt(paisId),
                    nacionalidade,
                    estado_id: estadoId ? parseInt(estadoId) : null,
                    cidade_id: parseInt(cidadeId),
                    altura: parseFloat(altura),
                    peso: parseFloat(peso),
                    pe_dominante: peDominante,
                    nivel_ambidestria_id: parseInt(nivelAmbidestriaId),
                    posicao_id: parseInt(posicaoId),
                    clube_atual_id: parseInt(clubeId),
                    contrato_inicio: contratoInicio,
                    contrato_fim: contratoFim,
                    foto: foto,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Jogador inserido com sucesso:", data);
                setNome("");
                setDataNascimento("");
                setPaisId("");
                setNacionalidade("");
                setEstadoId("");
                setCidadeId("");
                setAltura("");
                setPeso("");
                setPeDominante("");
                setNivelAmbidestriaId("");
                setPosicaoId("");
                setClubeId("");
                setContratoInicio("");
                setContratoFim("");
                setFoto("");
                fetchJogadores();
            } else {
                setErro("⚠️ " + (data.error || "Erro ao inserir jogador."));
                setTimeout(() => setErro(""), 3000);
            }
        } catch (error) {
            console.error("Erro ao inserir jogador:", error);
        }
    };

    return (
        <main
            className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900"
                : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
                }`}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-500 ${isDarkMode ? "bg-teal-800" : "bg-gray-300"}`}
            >
                <button
                    onClick={() => router.back()}
                    className={`flex items-center gap-2 mb-4 text-sm font-medium transition duration-200 ${isDarkMode
                        ? "text-lime-200 hover:text-lime-100"
                        : "text-gray-700 hover:text-gray-900"
                        }`}
                >
                    <FaArrowLeft />
                    <span>Voltar</span>
                </button>

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-700"}`}>
                    Cadastro de Jogadores
                </h2>

                <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4">
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome do jogador"
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                    <label className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        Data de nascimento
                        <input
                            value={dataNascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            type="date"
                            className="mt-1 p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white w-full"
                        />
                    </label>
                    <select
                        value={paisId}
                        onChange={(e) => setPaisId(e.target.value)}
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                        <option value="">Selecione o país</option>
                        {paises.map((pais) => (
                            <option key={pais.id} value={pais.id}>
                                {pais.nome}
                            </option>
                        ))}
                    </select>
                    <div className="mb-4">
                        <label className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Nacionalidade</label>
                        <input
                            type="text"
                            value={nacionalidade}
                            onChange={(e) => setNacionalidade(e.target.value)}
                            className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            placeholder="Ex: Brasileiro"
                        />
                    </div>
                    <select
                        value={estadoId}
                        onChange={(e) => setEstadoId(e.target.value)}
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                        <option value="">Selecione o estado</option>
                        {estados.map((estado) => (
                            <option key={estado.id} value={estado.id}>
                                {estado.nome}
                            </option>
                        ))}
                    </select>
                    <select
                        value={cidadeId}
                        onChange={(e) => setCidadeId(e.target.value)}
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                        <option value="">Selecione a cidade</option>
                        {cidades.map((cidade) => (
                            <option key={cidade.id} value={cidade.id}>
                                {cidade.nome}
                            </option>
                        ))}
                    </select>
                    <input
                        value={altura}
                        onChange={(e) => setAltura(e.target.value)}
                        placeholder="Altura"
                        type="number"
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                    <input
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                        placeholder="Peso"
                        type="number"
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                    <select
                        value={peDominante}
                        onChange={(e) => setPeDominante(e.target.value)}
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                        <option value="">Selecione o pé dominante</option>
                        <option value="D">Direito</option>
                        <option value="E">Esquerdo</option>
                        <option value="A">Ambidestro</option>
                    </select>
                    <select
                        value={nivelAmbidestriaId}
                        onChange={(e) => setNivelAmbidestriaId(e.target.value)}
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                        <option value="">Selecione o nível de ambidestria</option>
                        {niveis.map((nivel) => (
                            <option key={nivel.id} value={nivel.id}>
                                {nivel.descricao}
                            </option>
                        ))}
                    </select>
                    <select
                        value={posicaoId}
                        onChange={(e) => setPosicaoId(e.target.value)}
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                        <option value="">Selecione a posição</option>
                        {posicoes.map((posicao) => (
                            <option key={posicao.id} value={posicao.id}>
                                {posicao.nome}
                            </option>
                        ))}
                    </select>
                    <select
                        value={clubeId}
                        onChange={(e) => setClubeId(e.target.value)}
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                        <option value="">Selecione o clube</option>
                        {clubes.map((clube) => (
                            <option key={clube.id} value={clube.id}>
                                {clube.nome}
                            </option>
                        ))}
                    </select>
                    <label className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        Início do contrato do atleta
                        <input
                            value={contratoInicio}
                            onChange={(e) => setContratoInicio(e.target.value)}
                            type="date"
                            className="mt-1 p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white w-full"
                        />
                    </label>
                    <label className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        Fim do contrato do atleta
                        <input
                            value={contratoFim}
                            onChange={(e) => setContratoFim(e.target.value)}
                            type="date"
                            className="mt-1 p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white w-full"
                        />
                    </label>
                    <input
                        value={foto}
                        onChange={(e) => setFoto(e.target.value)}
                        placeholder="URL da foto"
                        className="p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                    {erro && <p className="text-red-500">{erro}</p>}
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded font-semibold transition duration-300 hover:scale-[1.03] ${isDarkMode ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900" : "bg-gray-600 hover:bg-gray-500 text-white"}`}>
                        Cadastrar Jogador
                    </button>
                </form>
                <ul className="space-y-2 text-left">
                    {jogadores.map((jogador) => {
                        // Função para calcular a idade com base na data de nascimento
                        const calcularIdade = (dataNascimento: string | Date) => {
                            const hoje = new Date();
                            const nascimento = new Date(dataNascimento);
                            let idade = hoje.getFullYear() - nascimento.getFullYear();
                            const mes = hoje.getMonth();
                            const dia = hoje.getDate();

                            if (mes < nascimento.getMonth() || (mes === nascimento.getMonth() && dia < nascimento.getDate())) {
                                idade--;
                            }

                            return idade;
                        };

                        return (
                            <li
                                key={jogador.id}
                                className={`p-2 rounded ${isDarkMode
                                    ? "bg-teal-600 text-white"
                                    : "bg-white text-black border border-gray-300"
                                    }`}
                            >
                                <strong>ID:</strong> {jogador.id} - <strong>{jogador.nome}</strong>
                                <br />
                                <div className="text-sm">
                                    <span>
                                        Nascimento:{" "}
                                        {jogador.data_nascimento
                                            ? new Date(jogador.data_nascimento).toLocaleDateString("pt-BR")
                                            : "Não informado"}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    Idade:{" "}
                                    {jogador.data_nascimento ? calcularIdade(jogador.data_nascimento) : "Não informada"}
                                </div>
                                <div className="text-sm">
                                    Nacionalidade: {jogador.nacionalidade ?? "Não informada"}
                                </div>
                                <div className="text-sm">
                                    Altura: {jogador.altura ? `${jogador.altura} m` : "Não informado"} | Peso:{" "}
                                    {jogador.peso ? `${jogador.peso} kg` : "Não informado"}
                                </div>
                                <div className="text-sm">
                                    Posição: {jogador.posicao?.nome ?? "Não informada"} | Pé dominante:{" "}
                                    {jogador.pe_dominante === "D"
                                        ? "Direito"
                                        : jogador.pe_dominante === "E"
                                            ? "Esquerdo"
                                            : jogador.pe_dominante === "A"
                                                ? "Ambos"
                                                : "Não informado"}
                                </div>
                                <div className="text-sm">
                                    Clube atual: {jogador.clube?.nome ?? "Sem clube"}
                                </div>
                                {jogador.contrato_inicio && (
                                    <div className="text-sm">
                                        Início do contrato:{" "}
                                        {new Date(jogador.contrato_inicio).toLocaleDateString()}
                                    </div>
                                )}
                                {jogador.contrato_fim && (
                                    <div className="text-sm">
                                        Fim do contrato:{" "}
                                        {new Date(jogador.contrato_fim).toLocaleDateString()}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>

            </motion.div>
            <BotaoTema />
        </main>
    );
};
