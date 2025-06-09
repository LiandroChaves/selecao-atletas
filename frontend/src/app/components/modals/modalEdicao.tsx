import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../utils/context/ThemeContext";
import { DateInput } from "./input";
import Image from "next/image";

interface ModalEdicaoProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    endpoint: string;
    onSuccess: () => void;
}

export default function ModalEdicao({ isOpen, onClose, item, endpoint, onSuccess }: ModalEdicaoProps) {
    const { isDarkMode } = useTheme();
    const [valores, setValores] = useState<{ [key: string]: any }>({});
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const [nomesRelacionados, setNomesRelacionados] = useState<{ [chave: string]: string }>({});

    const getEndpoint = (chave: string) => {
        const mapa = {
            pais_id: "paises",
            estado_id: "estados",
            cidade_id: "cidades",
            ambidestria_id: "ambidestria",
            posicao_id: "posicoes",
            clube_id: "clubes",
            jogador_id: "jogadores",
            estatistica_id: "estatisticas",
            partida_id: "partidas",
            estatistica_partida_id: "estatisticas-partidas",
            historico_clube_id: "historico-clubes",
            historico_lesao_id: "historico-lesoes",
            titulo_id: "titulos",
            jogador_titulo_id: "jogadores-titulos",
            clube_casa_id: "clubes",
            clube_fora_id: "clubes",
            caracteristica: "caracteristica-jogadores",
        };
        return mapa[chave as keyof typeof mapa] || chave.replace("_id", "") + "s";
    };

    useEffect(() => {
        if (item) {
            const valoresIniciais: any = {};
            Object.entries(item).forEach(([chave, valor]) => {
                if (typeof valor !== "object" || valor === null) {
                    valoresIniciais[chave] = valor;
                }
            });
            setValores(valoresIniciais);
        }
    }, [item]);

    useEffect(() => {
        const carregarNomesRelacionados = async () => {
            const novosNomes: { [chave: string]: string } = {};

            for (const [chave, valor] of Object.entries(valores)) {
                if (chave.endsWith("_id") && typeof valor === "number") {
                    const entidade = getEndpoint(chave);
                    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
                    const API_URL = isLocalhost
                        ? 'http://localhost:3001'
                        : `http://${window.location.hostname}:3001`;

                    const url = `${API_URL}/api/${entidade}/pegar${capitalize(getSingular(entidade))}/${valor}`;


                    console.log("URL da requisição:", url); // Adicione esse log para ver a URL gerada

                    try {
                        const res = await fetch(url);
                        const dados = await res.json();
                        if (Array.isArray(dados) && dados.length > 0) {
                            novosNomes[chave] = dados[0].nome || `ID ${valor}`;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                        }
                        else if (dados.nome) {
                            novosNomes[chave] = dados.nome;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                        }
                        else if (dados.descricao) {
                            novosNomes[chave] = dados.descricao;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                        }
                        else if (dados.titulo) {
                            novosNomes[chave] = dados.titulo;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                        }
                        else if (dados.jogador) {
                            novosNomes[chave] = dados.jogador;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                        }
                        else if (dados.clube) {
                            novosNomes[chave] = dados.clube;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                        }
                        else if (dados.posicao) {
                            novosNomes[chave] = dados.posicao;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                        }
                        else if (dados.ambidestria) {
                            novosNomes[chave] = dados.ambidestria;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                        }
                        else if (dados.estado) {
                            novosNomes[chave] = dados.estado;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                        }
                        else if (dados.cidade) {
                            novosNomes[chave] = dados.cidade;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                        }
                        else if (dados.id) {
                            novosNomes[chave] = dados.id;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave])
                        }
                        else if (dados.partida && dados.partida.data) {
                            novosNomes[chave] = dados.partida.data;
                            console.log(`Data relacionada para ${chave}:`, novosNomes[chave]);
                        }
                        else {
                            novosNomes[chave] = `Não encontrado para ID ${valor}`;
                            console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                        }

                        console.log(`Nome relacionado para ${chave}:`, novosNomes[chave]);
                    } catch (error) {
                        console.error("Erro ao buscar nome relacionado:", error);
                    }
                }
            }

            setNomesRelacionados(novosNomes);
        };

        if (Object.keys(valores).length > 0) {
            carregarNomesRelacionados();
        }
    }, [valores]);


    const getSingular = (endpoint: string) => {
        const mapa = {
            "paises": "pais",
            "estados": "estado",
            "cidades": "cidade",
            "ambidestria": "ambidestria",
            "posicoes": "posicao",
            "clubes": "clube",
            "jogadores": "jogador",
            "estatisticas": "estatisticaGeral",
            "partidas": "partida",
            "estatisticas-partidas": "estatisticaPartida",
            "historico-clubes": "historicoClube",
            "historico-lesoes": "historicoLesao",
            "titulos": "titulo",
            "jogadores-titulos": "jogadorTitulo",
            "caracteristica-jogadores": "caracteristica",
            "bandeiras": "bandeira",
        };
        return mapa[endpoint.split("/")[0] as keyof typeof mapa] || endpoint;
    };

    const singular = getSingular(endpoint);

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const handleChange = async (chave: string, valor: any) => {
        if (valor instanceof File) {
            try {
                const formData = new FormData();
                formData.append("foto", valor);

                const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
                const API_URL = isLocalhost
                    ? 'http://localhost:3001'
                    : `http://${window.location.hostname}:3001`;

                const uploadRes = await fetch(`${API_URL}/api/uploads/upload-foto`, {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await uploadRes.json();

                if (!uploadData.ok || !uploadData.path) {
                    console.error("Erro ao fazer upload da foto");
                    return;
                }

                const novoCaminho = uploadData.path; // exemplo: jogador_7/foto.jpg

                setValores((prev) => ({
                    ...prev,
                    [chave]: novoCaminho,
                }));
            } catch (error) {
                console.error("Erro ao fazer upload:", error);
            }
        } else {
            setValores((prev) => ({
                ...prev,
                [chave]: valor,
            }));
        }
    };


    const detectarTipoInput = (chave: string, valor: any) => {
        if (chave.toLowerCase().includes("imagem")) return "file";
        if (chave.toLowerCase().includes("foto")) return "file";
        if (chave.toLowerCase().includes("url_logo")) return "file";
        if (chave.toLowerCase().includes("logo_bandeira")) return "file";
        if (chave.toLowerCase().includes("foto") && chave.toLocaleLowerCase().includes("foto") == null) return "file";
        if (typeof valor === "number") return "number";
        if (chave.toLowerCase().includes("descricao") || chave.toLowerCase().includes("mensagem")) return "textarea";
        if (chave.toLowerCase().includes("data") || chave.toLowerCase().includes("date")) return "date";
        if (chave.toLowerCase().includes("contrato") || chave.toLowerCase().includes("contrato")) return "date";
        if (chave.toLowerCase().includes("pais_id") || chave.toLowerCase().includes("pais_id")) return "number";
        if (chave.toLowerCase().includes("cidade_id") || chave.toLowerCase().includes("cidade_id")) return "number";
        if (chave.toLowerCase().includes("estado_id") || chave.toLowerCase().includes("estado_id")) return "number";
        if (chave.toLowerCase().includes("posicao_secundaria_id") || chave.toLowerCase().includes("posicao_secundaria_id")) return "number";
        return "text";
    };


    const nomeFormatado = (str: string) =>
        str
            .toLowerCase()
            .split(" ")
            .map((palavra, index) =>
                index === 0 || !["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"].includes(palavra)
                    ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
                    : palavra
            )
            .join(" ");

    const handleSubmit = async () => {
        try {
            console.log("Valores recebidos:", valores);
            console.log("Item recebido:", item);
            console.log("Endpoint:", endpoint);
            console.log("Singular:", singular);

            const dadosFormatados: any = {};
            for (const chave in valores) {
                const valor = valores[chave];
                if (["created_at", "updated_at", "jogadores"].includes(chave)) continue;
                if (typeof valor === "string") {
                    dadosFormatados[chave] = nomeFormatado(valor);
                } else {
                    dadosFormatados[chave] = valor;
                }
            }

            console.log("Dados formatados:", dadosFormatados);

            // const id = item.jogador_id ?? item.id;

            const id = item?.id || Object.entries(item).find(([chave]) => chave.endsWith('_id'))?.[1];
            console.log("ID determinado:", id);

            if (!id) {
                console.error("ID do item está indefinido!");
                return;
            }

            const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
            const API_URL = isLocalhost
                ? 'http://localhost:3001'
                : `http://${window.location.hostname}:3001`;

            const url = `${API_URL}/api/${endpoint.split("/")[0]}/editar${capitalize(singular)}/${id}`;

            console.log("URL da requisição:", url);
            console.log("Body JSON:", JSON.stringify(dadosFormatados, null, 2));
            console.log("URL da requisição:", url);

            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosFormatados),
            });

            if (res.ok) {
                console.log("Resposta OK");
                setMensagemSucesso("Alterações salvas com sucesso!");
                setTimeout(() => {
                    setMensagemSucesso("");
                    onSuccess();
                    onClose();
                }, 3000);
            } else {
                const erro = await res.json();
                console.error("Erro ao atualizar:", erro);
            }
        } catch (error) {
            console.error("Erro ao atualizar item:", error);
        }
    };

    if (!isOpen || !item) return null;

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 ${isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
                : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
                }`}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`${isDarkMode ? "bg-teal-800 text-white" : "bg-gray-700 text-white"} 
                    rounded-2xl shadow-lg p-6 w-full max-w-2xl max-h-[80vh] relative overflow-hidden`}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-300 hover:text-white"
                >
                    ✖
                </button>

                <div className="text-inherit overflow-y-auto max-h-[60vh] pr-2">
                    <h2 className="text-2xl font-bold mb-4 text-center">Editar Registro</h2>
                    {Object.entries(valores)
                        .filter(([chave]) =>
                            !["createdAt", "updatedAt", "deletedAt", "created_at", "updated_at", "deleted_at","pais","estado","cidade","posicao_secundaria"].includes(chave)
                        )
                        .map(([chave, valor]) => {
                            const tipo = detectarTipoInput(chave, valor);
                            const isReadOnly = chave === "id";

                            return (
                                <div key={chave} className="mb-4">
                                    <label className="block text-sm mb-1 font-medium">{chave}</label>

                                    {tipo === "textarea" ? (
                                        <textarea
                                            value={valor ?? ""}
                                            onChange={(e) => handleChange(chave, e.target.value)}
                                            className={`w-full p-2 rounded-md ${isReadOnly ? "bg-gray-300 text-gray-500" : "bg-white text-gray-700"
                                                }`}
                                        />
                                    ) : tipo === "date" ? (
                                        <DateInput
                                            value={valor}
                                            onChange={(newValue: string) => handleChange(chave, newValue)}
                                        />
                                    ) : tipo === "file" ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col items-center">
                                                <Image
                                                    src={
                                                        valor && typeof valor === "string"
                                                            ? `http://localhost:3001/api/uploads/${valor}`
                                                            : "/assets/default-placeholder.jpg"
                                                    }
                                                    alt="Imagem atual"
                                                    className="max-w-[200px] max-h-[200px] object-cover rounded"
                                                    width={256}
                                                    height={256}
                                                />
                                                <p className="text-sm text-gray-400 mt-2">
                                                    {valor ? "Imagem atual" : "Nenhuma imagem enviada"}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={(e) => handleChange(chave, e.target.files?.[0] || "")}
                                                disabled={isReadOnly}
                                                className={`w-full p-2 rounded-md ${isReadOnly ? "bg-gray-300 cursor-not-allowed" : "bg-white text-gray-700"
                                                    }`}
                                            />
                                        </div>
                                    ) : (
                                        <input
                                            type={tipo}
                                            value={tipo === "number" ? valor ?? 0 : valor ?? ""}
                                            onChange={(e) =>
                                                handleChange(chave, tipo === "number" ? Number(e.target.value) : e.target.value)
                                            }
                                            readOnly={isReadOnly}
                                            className={`w-full p-2 rounded-md ${isReadOnly ? "bg-gray-300 text-gray-500" : "bg-white text-gray-700"
                                                }`}
                                        />
                                    )}

                                    {nomesRelacionados[chave] && (
                                        <p className="text-xs text-gray-300 mt-1">Relacionado: {nomesRelacionados[chave]}</p>
                                    )}
                                </div>
                            );
                        })}

                    {mensagemSucesso && (
                        <div className="text-green-300 text-sm text-center mb-4">{mensagemSucesso}</div>
                    )}

                    <button
                        onClick={handleSubmit}
                        className={`w-full py-2 rounded font-semibold transition ${isDarkMode
                            ? "bg-teal-400 hover:bg-teal-300 text-teal-900"
                            : "bg-gray-600 hover:bg-gray-500 text-white"
                            }`}
                    >
                        Salvar Alterações
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
