"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "@/utils/context/ThemeContext";
import BotaoTema from "@/utils/utilities/changeTheme";
import { useLoading } from "@/utils/context/LoadingProvider";
import { verificarTokenValido } from "@/utils/verificarTokenValido";
import dayjs from "dayjs";
import Image from "next/image";

export default function CadastroJogadores() {
    const [nome, setNome] = useState("");
    const [apelido, setApelido] = useState("");
    const [nomeCurto, setNomeCurto] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [paisId, setPaisId] = useState("");
    const [estadoId, setEstadoId] = useState("");
    const [cidadeId, setCidadeId] = useState("");
    const [altura, setAltura] = useState("");
    const [peso, setPeso] = useState("");
    const [peDominante, setPeDominante] = useState("");
    const [nivelAmbidestriaId, setNivelAmbidestriaId] = useState("");
    const [posicaoId, setPosicaoId] = useState("");
    const [posicaoSecundariaId, setPosicaoSecundariaId] = useState("");
    const [clubeId, setClubeId] = useState("");
    const [contratoInicio, setContratoInicio] = useState("");
    const [contratoFim, setContratoFim] = useState("");
    const [foto, setFoto] = useState<string | File>("");
    const [jogadores, setJogadores] = useState<any[]>([]);
    const [erro, setErro] = useState("");
    const [niveis, setNiveis] = useState<{ id: number; descricao: string }[]>([]);
    const [paises, setPaises] = useState<any[]>([]);
    const [estados, setEstados] = useState<any[]>([]);
    const [cidades, setCidades] = useState<any[]>([]);
    const [clubes, setClubes] = useState<any[]>([]);
    const [posicoes, setPosicoes] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Referência para o input de arquivo
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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault(); // evita comportamento padrão como abrir dropdown
                const form = document.querySelector("form");
                if (form) {
                    form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const fetchPaises = async () => {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/paises/pegarPaises`); const data = await res.json();
            setPaises(data);
        } catch (err) {
            console.error("Erro ao buscar países:", err);
        }
    };

    const fetchEstados = async () => {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/estados/pegarEstados`);
            const data = await res.json();
            setEstados(data);
        } catch (err) {
            console.error("Erro ao buscar estados:", err);
        }
    };

    const fetchCidades = async () => {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/cidades/pegarCidades`);
            const data = await res.json();
            setCidades(data);
        } catch (err) {
            console.error("Erro ao buscar cidades:", err);
        }
    };

    const fetchClubes = async () => {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/clubes/pegarClubes`);
            const data = await res.json();
            setClubes(data);
        } catch (err) {
            console.error("Erro ao buscar clubes:", err);
        }
    };

    const fetchPosicoes = async () => {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/posicoes/pegarPosicoes`); const data = await res.json();
            setPosicoes(data);
        } catch (err) {
            console.error("Erro ao buscar posições:", err);
        }
    };

    const fetchNiveis = async () => {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/ambidestria/pegarNiveis`);
            const data = await res.json();
            setNiveis(data);
        } catch (error) {
            console.error("Erro ao buscar níveis:", error);
        }
    };

    const fetchJogadores = async () => {
        try {
            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/jogadores/pegarJogadores`);
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

        if (
            !nome.trim() || !dataNascimento.trim() || !paisId || !cidadeId ||
            !peDominante || !nivelAmbidestriaId || !posicaoId || !clubeId
        ) {
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

        const nomeFormatadoApe = apelido
            .toLowerCase()
            .split(" ")
            .map((palavra, index) =>
                index === 0 || !["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"].includes(palavra)
                    ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
                    : palavra
            )
            .join(" ");

        const nomeCurtoFormatado = nomeCurto
            .toLowerCase()
            .split(" ")
            .map((palavra, index) =>
                index === 0 || !["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"].includes(palavra)
                    ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
                    : palavra
            )
            .join(" ");

        let nomeArquivoFoto = "";

        try {
            let uploadData;

            if (foto) {
                const formData = new FormData();
                formData.append("foto", foto);

                const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
                const API_URL = isLocalhost
                    ? 'http://localhost:3001'
                    : `http://${window.location.hostname}:3001`;

                const uploadRes = await fetch(`${API_URL}/api/uploads/upload-foto`, {
                    method: "POST",
                    body: formData,
                });

                uploadData = await uploadRes.json();
            } else {
                const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
                const API_URL = isLocalhost
                    ? 'http://localhost:3001'
                    : `http://${window.location.hostname}:3001`;

                const uploadRes = await fetch(`${API_URL}/api/uploads/upload-foto`, {
                    method: "POST",
                });

                uploadData = await uploadRes.json();
            }

            if (!uploadData.ok || !uploadData.path) {
                setErro("⚠️ Erro ao processar a foto.");
                return;
            }

            nomeArquivoFoto = uploadData.path;
            console.log("Foto atribuída:", nomeArquivoFoto);

            const inicioFinal = contratoInicio.trim() === "" ? null : contratoInicio;
            const fimFinal = contratoFim.trim() === "" ? null : contratoFim;

            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const res = await fetch(`${API_URL}/api/jogadores/inserirJogador`, {
                method: "POST",
                body: JSON.stringify({
                    nome: nomeFormatado,
                    nome_curto: nomeCurtoFormatado,
                    apelido: nomeFormatadoApe,
                    data_nascimento: dataNascimento,
                    pais_id: parseInt(paisId),
                    estado_id: estadoId ? parseInt(estadoId) : null,
                    cidade_id: parseInt(cidadeId),
                    altura: parseFloat(altura) || 0,
                    peso: parseFloat(peso) || 0,
                    pe_dominante: peDominante,
                    nivel_ambidestria_id: parseInt(nivelAmbidestriaId),
                    posicao_id: parseInt(posicaoId),
                    posicao_secundaria_id: parseInt(posicaoSecundariaId),
                    clube_atual_id: parseInt(clubeId),
                    contrato_inicio: inicioFinal,
                    contrato_fim: fimFinal,
                    foto: nomeArquivoFoto,
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
                setApelido("");
                setDataNascimento("");
                setPaisId("");
                setEstadoId("");
                setCidadeId("");
                setAltura("");
                setPeso("");
                setPeDominante("");
                setNivelAmbidestriaId("");
                setPosicaoId("");
                setPosicaoSecundariaId("");
                setClubeId("");
                setContratoInicio("");
                setContratoFim("");
                setFoto("");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                fetchJogadores();
            } else {
                setErro("⚠️ " + (data.error || "Erro ao inserir jogador."));
                setTimeout(() => setErro(""), 3000);
            }
        } catch (error) {
            console.error("Erro ao inserir jogador:", error);
        }
    };

    // Função para validar altura
    const handleAlturaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Verifica se a entrada está em um formato válido para altura (1 digito à esquerda, 2 à direita)
        if (value === '' || /^[0-9]{1}(\.[0-9]{0,2})?$/.test(value)) {
            setAltura(value);
        }
    };

    // Função para validar peso
    const handlePesoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Verifica se a entrada está em um formato válido para peso (1-3 dígitos à esquerda, 2 à direita)
        if (value === '' || /^[0-9]{1,3}(\.[0-9]{0,2})?$/.test(value)) {
            setPeso(value);
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
                className={`text-center p-8 rounded-2xl shadow-2xl w-full max-w-4xl transition-all duration-500 ${isDarkMode ? "bg-teal-800" : "bg-gray-300"}`}
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

                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-lime-200" : "text-gray-700"}`}>
                    Cadastro de Jogadores
                </h2>

                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex flex-wrap justify-center gap-4 text-center">
                        {/* Nome */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <input
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Nome completo do jogador"
                                className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            />
                        </div>
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <input
                                value={nomeCurto}
                                onChange={(e) => setNomeCurto(e.target.value)}
                                placeholder="Nome curto do jogador (ex: Augusto)"
                                className="w-full p-2 rounded text-black bg-white"
                            />
                        </div>
                        {/* Apelido */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <input
                                value={apelido}
                                onChange={(e) => setApelido(e.target.value)}
                                placeholder="Apelido do jogador"
                                className="mb-1 w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            />
                        </div>
                        {/* Data de Nascimento */}
                        <div className="w-full -mt-[23px] md:w-[48%] lg:w-[31%]">
                            <label className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                Data de nascimento
                                <input
                                    value={dataNascimento}
                                    onChange={(e) => setDataNascimento(e.target.value)}
                                    type="date"
                                    className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                />
                            </label>
                        </div>

                        {/* País */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <select
                                value={paisId}
                                onChange={(e) => setPaisId(e.target.value)}
                                className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            >
                                <option value="">Selecione o país</option>
                                {paises.map((pais) => (
                                    <option key={pais.id} value={pais.id}>{pais.nome}</option>
                                ))}
                            </select>
                        </div>
                        {/* Estado */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <select
                                value={estadoId}
                                onChange={(e) => setEstadoId(e.target.value)}
                                className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            >
                                <option value="">Selecione o estado</option>
                                {estados.map((estado) => (
                                    <option key={estado.id} value={estado.id}>{estado.nome}</option>
                                ))}
                            </select>
                        </div>

                        {/* Cidade */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <select
                                value={cidadeId}
                                onChange={(e) => setCidadeId(e.target.value)}
                                className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            >
                                <option value="">Selecione a cidade</option>
                                {cidades.map((cidade) => (
                                    <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
                                ))}
                            </select>
                        </div>

                        {/* Altura */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <input
                                value={altura}
                                onChange={handleAlturaChange}
                                placeholder="Altura"
                                type="number"
                                step={0.01}
                                className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            />
                        </div>

                        {/* Peso */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <input
                                value={peso}
                                onChange={handlePesoChange}
                                placeholder="Peso"
                                type="number"
                                step="0.01"
                                className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            />
                        </div>

                        {/* Pé dominante */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <select
                                value={peDominante}
                                onChange={(e) => setPeDominante(e.target.value)}
                                className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            >
                                <option value="">Selecione o pé dominante</option>
                                <option value="D">Direito</option>
                                <option value="E">Esquerdo</option>
                            </select>
                        </div>

                        {/* Nível de ambidestria */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <select
                                value={nivelAmbidestriaId}
                                onChange={(e) => setNivelAmbidestriaId(e.target.value)}
                                className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            >
                                <option value="">Selecione o nível de ambidestria</option>
                                {niveis.map((nivel) => (
                                    <option key={nivel.id} value={nivel.id}>{nivel.descricao}</option>
                                ))}
                            </select>
                        </div>

                        {/* Posição */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <select
                                value={posicaoId}
                                onChange={(e) => setPosicaoId(e.target.value)}
                                className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            >
                                <option value="">Selecione a posição</option>
                                {posicoes.map((posicao) => (
                                    <option key={posicao.id} value={posicao.id}>{posicao.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <select
                                value={posicaoSecundariaId}
                                onChange={(e) => setPosicaoSecundariaId(e.target.value)}
                                className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            >
                                <option value="">Selecione a posição secundária</option>
                                {posicoes.map((posicao) => (
                                    <option key={posicao.id} value={posicao.id}>{posicao.nome}</option>
                                ))}
                            </select>
                        </div>

                        {/* Clube */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <select
                                value={clubeId}
                                onChange={(e) => setClubeId(e.target.value)}
                                className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                            >
                                <option value="">Selecione o clube</option>
                                {clubes.map((clube) => (
                                    <option key={clube.id} value={clube.id}>{clube.nome}</option>
                                ))}
                            </select>
                        </div>

                        {/* Contrato início */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <label className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                <input
                                    value={contratoInicio}
                                    onChange={(e) => setContratoInicio(e.target.value)}
                                    type="date"
                                    className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                />
                                Início do contrato do atleta (opcional)
                            </label>
                        </div>

                        {/* Contrato fim */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <label className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                <input
                                    value={contratoFim}
                                    onChange={(e) => setContratoFim(e.target.value)}
                                    type="date"
                                    className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                />
                                Fim do contrato do atleta (opcional)
                            </label>
                        </div>

                        {/* Foto */}
                        <div className="w-full md:w-[48%] lg:w-[31%]">
                            <label className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFoto(e.target.files?.[0] || "")}
                                    className="w-full p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                />
                                Foto do jogador
                            </label>
                        </div>
                    </div>

                    {/* Mensagem de erro */}
                    {erro && <p className="text-red-500 text-center mt-4">{erro}</p>}

                    {/* Botão de envio */}
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className={`px-6 py-2 rounded font-semibold transition duration-300 hover:scale-[1.03] ${isDarkMode ? "bg-emerald-400 hover:bg-emerald-300 text-teal-900" : "bg-gray-600 hover:bg-gray-500 text-white"
                                }`}
                        >
                            Cadastrar Jogador
                        </button>
                    </div>
                </form>

                <ul className="space-y-2 text-left max-h-72 overflow-y-auto">
                    {jogadores.map((jogador) => {
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
                                className={`p-4 rounded flex gap-4 items-start ${isDarkMode ? "bg-teal-600 text-white" : "bg-white text-black border border-gray-300"
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-stretch">
                                    {/* Imagem do jogador */}
                                    <Image
                                        src={
                                            jogador.foto
                                                ? `http://localhost:3001/api/uploads/${jogador.foto}`
                                                : "/assets/default-placeholder.jpg"
                                        }
                                        alt={jogador.nome}
                                        className="w-full sm:w-64 object-cover rounded-md border h-auto sm:h-full"
                                        width={256}
                                        height={256}
                                    />
                                    {/* Informações do jogador */}
                                    <div className={`flex-1 text-sm ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                        <div><strong>ID:</strong> {jogador.id} - <strong>{jogador.nome}</strong></div>

                                        <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            <strong>Nome Curto:</strong> {jogador.nome_curto ? jogador.nome_curto : "Nome curto não informado"}
                                        </div>

                                        <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            <strong>Apelido:</strong> {jogador.apelido ? jogador.apelido : "Apelido não informado"}
                                        </div>

                                        <span>
                                            Nascimento: {jogador.data_nascimento ? dayjs(jogador.data_nascimento).format("DD/MM/YYYY") : "Não informado"}
                                        </span>

                                        <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            Idade: {jogador.data_nascimento ? calcularIdade(jogador.data_nascimento) : "Não informada"}
                                        </div>

                                        <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Naturalidade | Cidade: {jogador.cidade?.nome ?? "Não informada"}</div>

                                        <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            Altura: {jogador.altura ? `${jogador.altura} m` : "Não informado"} | Peso: {jogador.peso ? `${jogador.peso} kg` : "Não informado"}
                                        </div>

                                        <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            Posição principal: {jogador.posicao?.nome ?? "Não informada"}
                                        </div>

                                        <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            Posição secundária: {jogador.posicao_secundaria?.nome ?? "Não informada"}
                                        </div>


                                        <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            Pé dominante:{" "}
                                            {jogador.pe_dominante === "D"
                                                ? "Direito"
                                                : jogador.pe_dominante === "E"
                                                    ? "Esquerdo"
                                                    : jogador.pe_dominante === "A"
                                                        ? "Ambos"
                                                        : "Não informado"}
                                        </div>

                                        <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>Clube atual: {jogador.clube?.nome ?? "Sem clube"}</div>
                                        {jogador.contrato_inicio && (
                                            <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                                Início do contrato: {dayjs(jogador.contrato_inicio).format("DD/MM/YYYY")}
                                            </div>
                                        )}

                                        {jogador.contrato_fim && (
                                            <div className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                                Fim do contrato: {dayjs(jogador.contrato_fim).format("DD/MM/YYYY")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </motion.div>
            <BotaoTema />
        </main >
    );
};
