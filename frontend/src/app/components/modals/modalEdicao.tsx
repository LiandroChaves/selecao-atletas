"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "../../../utils/context/ThemeContext"
import { DateInput } from "./input"
import Image from "next/image"

interface ModalEdicaoProps {
    isOpen: boolean
    onClose: () => void
    item: any
    endpoint: string
    onSuccess: () => void
}

export default function ModalEdicao({ isOpen, onClose, item, endpoint, onSuccess }: ModalEdicaoProps) {
    const { isDarkMode } = useTheme()
    const [valores, setValores] = useState<{ [key: string]: any }>({})
    const [mensagemSucesso, setMensagemSucesso] = useState("")
    const [nomesRelacionados, setNomesRelacionados] = useState<{ [chave: string]: string }>({})
    const [arquivosPendentes, setArquivosPendentes] = useState<{ [key: string]: File }>({})
    const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({})

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
            logo_bandeira: "bandeiras",
            bandeira_id: "bandeiras",
            logo_clube_id: "logos-clubes",
        }
        return mapa[chave as keyof typeof mapa] || chave.replace("_id", "") + "s"
    }

    useEffect(() => {
        if (item) {
            console.log("=== PROCESSANDO ITEM NO MODAL ===")
            console.log("Item completo:", item)
            console.log("Endpoint:", endpoint)

            const valoresIniciais: any = {}

            // Processar propriedades diretas (não objetos)
            Object.entries(item).forEach(([chave, valor]) => {
                if (typeof valor !== "object" || valor === null) {
                    valoresIniciais[chave] = valor
                    console.log(`Campo direto: ${chave} = ${valor}`)
                }
            })

            // PROCESSAMENTO ESPECÍFICO PARA OBJETOS RELACIONADOS

            // 1. Logo do clube
            if (item.logo && typeof item.logo === "object") {
                console.log("Logo encontrada:", item.logo)
                if (item.logo.url_logo) {
                    valoresIniciais.url_logo = item.logo.url_logo
                    console.log(`Logo extraída: url_logo = ${item.logo.url_logo}`)
                }
            }

            // 2. Bandeira (para países)
            if (item.bandeira && typeof item.bandeira === "object") {
                console.log("Bandeira encontrada:", item.bandeira)
                if (item.bandeira.logo_bandeira) {
                    valoresIniciais.logo_bandeira = item.bandeira.logo_bandeira
                    console.log(`Bandeira extraída: logo_bandeira = ${item.bandeira.logo_bandeira}`)
                }
            }

            // 3. País (se necessário mostrar nome)
            if (item.pais && typeof item.pais === "object") {
                console.log("País encontrado:", item.pais)
                if (item.pais.nome) {
                    valoresIniciais.pais_nome = item.pais.nome
                    console.log(`País extraído: pais_nome = ${item.pais.nome}`)
                }
            }

            // 4. Estado (se existir)
            if (item.estado && typeof item.estado === "object") {
                console.log("Estado encontrado:", item.estado)
                if (item.estado.nome) {
                    valoresIniciais.estado_nome = item.estado.nome
                    console.log(`Estado extraído: estado_nome = ${item.estado.nome}`)
                }
            }

            // 5. Cidade (se existir)
            if (item.cidade && typeof item.cidade === "object") {
                console.log("Cidade encontrada:", item.cidade)
                if (item.cidade.nome) {
                    valoresIniciais.cidade_nome = item.cidade.nome
                    console.log(`Cidade extraída: cidade_nome = ${item.cidade.nome}`)
                }
            }

            // 6. Clube atual (para jogadores)
            if (item.clube_atual && typeof item.clube_atual === "object") {
                console.log("Clube atual encontrado:", item.clube_atual)
                if (item.clube_atual.nome) {
                    valoresIniciais.clube_atual_nome = item.clube_atual.nome
                    console.log(`Clube atual extraído: clube_atual_nome = ${item.clube_atual.nome}`)
                }
            }

            // 7. Posição (se existir)
            if (item.posicao && typeof item.posicao === "object") {
                console.log("Posição encontrada:", item.posicao)
                if (item.posicao.posicao) {
                    valoresIniciais.posicao_nome = item.posicao.posicao
                    console.log(`Posição extraída: posicao_nome = ${item.posicao.posicao}`)
                }
            }

            console.log("Valores iniciais processados:", valoresIniciais)
            setValores(valoresIniciais)
        }
    }, [item])

    useEffect(() => {
        const carregarNomesRelacionados = async () => {
            const novosNomes: { [chave: string]: string } = {}
            for (const [chave, valor] of Object.entries(valores)) {
                if (chave.endsWith("_id") && typeof valor === "number") {
                    const entidade = getEndpoint(chave)
                    const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost"
                    const API_URL = isLocalhost ? "http://localhost:3001" : `http://${window.location.hostname}:3001`
                    const url = `${API_URL}/api/${entidade}/pegar${capitalize(getSingular(entidade))}/${valor}`
                    try {
                        const res = await fetch(url)
                        const dados = await res.json()
                        if (Array.isArray(dados) && dados.length > 0) {
                            novosNomes[chave] = dados[0].nome || `ID ${valor}`
                        } else if (dados.nome) {
                            novosNomes[chave] = dados.nome
                        } else if (dados.descricao) {
                            novosNomes[chave] = dados.descricao
                        } else if (dados.titulo) {
                            novosNomes[chave] = dados.titulo
                        } else if (dados.jogador) {
                            novosNomes[chave] = dados.jogador
                        } else if (dados.clube) {
                            novosNomes[chave] = dados.clube
                        } else if (dados.posicao) {
                            novosNomes[chave] = dados.posicao
                        } else if (dados.ambidestria) {
                            novosNomes[chave] = dados.ambidestria
                        } else if (dados.estado) {
                            novosNomes[chave] = dados.estado
                        } else if (dados.cidade) {
                            novosNomes[chave] = dados.cidade
                        } else if (dados.id) {
                            novosNomes[chave] = dados.id
                        } else if (dados.partida && dados.partida.data) {
                            novosNomes[chave] = dados.partida.data
                        } else {
                            novosNomes[chave] = `Não encontrado para ID ${valor}`
                        }
                    } catch (error) {
                        console.error("Erro ao buscar nome relacionado:", error)
                    }
                }
            }
            setNomesRelacionados(novosNomes)
        }

        if (Object.keys(valores).length > 0) {
            carregarNomesRelacionados()
        }
    }, [valores])

    const getSingular = (endpoint: string) => {
        const mapa = {
            paises: "pais",
            estados: "estado",
            cidades: "cidade",
            ambidestria: "ambidestria",
            posicoes: "posicao",
            clubes: "clube",
            jogadores: "jogador",
            estatisticas: "estatisticaGeral",
            partidas: "partida",
            "estatisticas-partidas": "estatisticaPartida",
            "historico-clubes": "historicoClube",
            "historico-lesoes": "historicoLesao",
            titulos: "titulo",
            "jogadores-titulos": "jogadorTitulo",
            "caracteristica-jogadores": "caracteristica",
            bandeiras: "bandeira",
            logo_clubes: "logoClube",
            "logos-clubes": "logoClube",
        }
        return mapa[endpoint.split("/")[0] as keyof typeof mapa] || endpoint
    }

    const singular = getSingular(endpoint)
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

    const isLogoField = (chave: string) => {
        return (
            chave.toLowerCase().includes("logo") ||
            chave.toLowerCase().includes("url_logo")
        )
    }

    const isBandeiraField = (chave: string) => {
        return chave.toLowerCase().includes("logo_bandeira") || chave.toLowerCase().includes("bandeira")
    }

    const isFotoField = (chave: string) => {
        return chave.toLowerCase().includes("foto") || chave.toLowerCase().includes("imagem")
    }

    const handleChange = async (chave: string, valor: any) => {
        console.log(`Mudança no campo ${chave}:`, valor)

        if (valor instanceof File) {
            console.log(`Arquivo selecionado para ${chave}:`, valor.name)
            // Armazenar arquivo para upload posterior
            setArquivosPendentes((prev) => ({
                ...prev,
                [chave]: valor,
            }))

            // Criar preview local
            const reader = new FileReader()
            reader.onload = (e) => {
                setValores((prev) => ({
                    ...prev,
                    [chave]: e.target?.result as string, // URL temporária para preview
                }))
            }
            reader.readAsDataURL(valor)
        } else {
            setValores((prev) => ({
                ...prev,
                [chave]: valor,
            }))
        }
    }

    const uploadFile = async (chave: string, arquivo: File) => {
        setUploadingFiles((prev) => ({ ...prev, [chave]: true }))

        try {
            const formData = new FormData()
            const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost"
            const API_URL = isLocalhost ? "http://localhost:3001" : `http://${window.location.hostname}:3001`

            let uploadEndpoint = ""
            let fieldName = ""

            if (isBandeiraField(chave)) {
                // Upload de bandeira
                uploadEndpoint = `${API_URL}/api/bandeiras/inserirBandeira`
                fieldName = "logo_bandeira"
                formData.append(fieldName, arquivo)

                // Para bandeiras, também precisamos do nome
                const nomeBandeira = valores.nome || `Bandeira_${Date.now()}`
                formData.append("nome", nomeBandeira)

                console.log(`Upload de bandeira com nome: ${nomeBandeira}`)
            } else if (isLogoField(chave)) {
                // Upload de logo de clube
                uploadEndpoint = `${API_URL}/api/logos-clubes/inserirLogo`
                fieldName = "url_logo"
                formData.append(fieldName, arquivo)

                // Adicionar clube_id
                const clubeId = item?.clube_id || item?.id
                if (clubeId) {
                    formData.append("clube_id", clubeId.toString())
                    console.log(`Upload de logo para clube ID: ${clubeId}`)
                } else {
                    throw new Error("ID do clube não encontrado para upload da logo")
                }
            } else if (isFotoField(chave)) {
                // Upload de foto de jogador
                uploadEndpoint = `${API_URL}/api/uploads/upload-foto`
                fieldName = "foto"
                formData.append(fieldName, arquivo)
            } else {
                throw new Error(`Tipo de arquivo não reconhecido para o campo: ${chave}`)
            }

            console.log(`Fazendo upload para: ${uploadEndpoint}`)

            const uploadRes = await fetch(uploadEndpoint, {
                method: "POST",
                body: formData,
            })

            const uploadData = await uploadRes.json()
            console.log("Resposta do upload:", uploadData)

            if (!uploadData.ok && !uploadData.mensagem) {
                throw new Error(uploadData.error || "Erro no upload")
            }

            // Atualizar valores com o caminho retornado
            let novoCaminho = ""
            if (isBandeiraField(chave)) {
                novoCaminho = uploadData.bandeira?.logo_bandeira || uploadData.path
            } else if (isLogoField(chave)) {
                novoCaminho = uploadData.logo?.url_logo || uploadData.path
            } else {
                novoCaminho = uploadData.path
            }

            setValores((prev) => ({
                ...prev,
                [chave]: novoCaminho,
            }))

            console.log(`Upload concluído para ${chave}: ${novoCaminho}`)
            return novoCaminho
        } catch (error) {
            console.error(`Erro ao fazer upload de ${chave}:`, error)
            throw error
        } finally {
            setUploadingFiles((prev) => ({ ...prev, [chave]: false }))
        }
    }

    const detectarTipoInput = (chave: string, valor: any) => {
        if (chave.toLowerCase().includes("imagem")) return "file"
        if (chave.toLowerCase().includes("foto")) return "file"
        if (chave.toLowerCase().includes("url_logo")) return "file"
        if (chave.toLowerCase().includes("logo")) return "file"
        if (chave.toLowerCase().includes("logo_bandeira")) return "file"
        if (typeof valor === "number") return "number"
        if (chave.toLowerCase().includes("descricao") || chave.toLowerCase().includes("mensagem")) return "textarea"
        if (chave.toLowerCase().includes("data") || chave.toLowerCase().includes("date")) return "date"
        if (chave.toLowerCase().includes("contrato")) return "date"
        if (chave.toLowerCase().includes("pais_id")) return "number"
        if (chave.toLowerCase().includes("cidade_id")) return "number"
        if (chave.toLowerCase().includes("estado_id")) return "number"
        if (chave.toLowerCase().includes("clube_atual_id")) return "number"
        if (chave.toLowerCase().includes("posicao_secundaria_id")) return "number"
        if (chave.toLowerCase().includes("bandeira_id")) return "number"
        if (chave.toLowerCase().includes("uf")) return "uf"
        return "text"
    }

    const nomeFormatado = (str: string) =>
        str
            .toLowerCase()
            .split(" ")
            .map((palavra, index) =>
                index === 0 || !["de", "do", "da", "das", "dos", "e", "em", "no", "na", "nos", "nas"].includes(palavra)
                    ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
                    : palavra,
            )
            .join(" ")

    const handleSubmit = async () => {
        try {
            console.log("=== SUBMIT ===")
            console.log("Valores atuais:", valores)
            console.log("Arquivos pendentes:", arquivosPendentes)

            // Primeiro, fazer upload de todos os arquivos pendentes
            const valoresAtualizados = { ...valores }

            for (const [chave, arquivo] of Object.entries(arquivosPendentes)) {
                try {
                    const caminhoArquivo = await uploadFile(chave, arquivo)
                    valoresAtualizados[chave] = caminhoArquivo
                } catch (error) {
                    console.error(`Falha no upload de ${chave}:`, error)
                    // Continuar com outros uploads mesmo se um falhar
                }
            }

            // Limpar arquivos pendentes após upload
            setArquivosPendentes({})

            // Preparar dados para envio - EXCLUIR CAMPOS DE NOME EXTRAÍDOS
            const dadosFormatados: any = {}
            for (const chave in valoresAtualizados) {
                const valor = valoresAtualizados[chave]

                // Pular campos que não devem ser enviados
                if (
                    [
                        "created_at",
                        "updated_at",
                        "jogadores",
                        "pais_nome",
                        "estado_nome",
                        "cidade_nome",
                        "clube_atual_nome",
                        "posicao_nome",
                    ].includes(chave)
                ) {
                    continue
                }

                // Não formatar caminhos de arquivo
                if (detectarTipoInput(chave, valor) === "file") {
                    dadosFormatados[chave] = valor
                } else if (typeof valor === "string" && !valor.startsWith("data:")) {
                    dadosFormatados[chave] = nomeFormatado(valor)
                } else {
                    dadosFormatados[chave] = valor
                }
            }

            console.log("Dados formatados para envio:", dadosFormatados)

            const id = item?.id || Object.entries(item).find(([chave]) => chave.endsWith("_id"))?.[1]
            console.log("ID determinado:", id)

            if (!id) {
                console.error("ID do item está indefinido!")
                return
            }

            const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost"
            const API_URL = isLocalhost ? "http://localhost:3001" : `http://${window.location.hostname}:3001`

            // Para bandeiras, usar endpoint específico se houver logo_bandeira nos dados
            let url = ""
            if (endpoint.includes("bandeiras") && dadosFormatados.logo_bandeira) {
                url = `${API_URL}/api/bandeiras/editarBandeira/${id}`
                console.log("Usando endpoint específico de bandeiras para upload")
            } else {
                url = `${API_URL}/api/${endpoint.split("/")[0]}/editar${capitalize(singular)}/${id}`
            }

            console.log("URL da requisição:", url)

            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosFormatados),
            })

            if (res.ok) {
                console.log("Resposta OK")
                setMensagemSucesso("Alterações salvas com sucesso!")
                setTimeout(() => {
                    setMensagemSucesso("")
                    onSuccess()
                    onClose()
                }, 3000)
            } else {
                const erro = await res.json()
                console.error("Erro ao atualizar:", erro)
            }
        } catch (error) {
            console.error("Erro ao atualizar item:", error)
        }
    }

    const getImageSrc = (chave: string, valor: any) => {
        console.log(`getImageSrc para ${chave}:`, valor)

        // Se é uma URL de preview (data:)
        if (typeof valor === "string" && valor.startsWith("data:")) {
            return valor
        }

        // Se é um caminho de arquivo
        if (typeof valor === "string" && valor) {
            // Tanto logos de clubes quanto bandeiras ficam na mesma pasta assets/pdf
            if (isLogoField(chave)) {
                const url = `http://localhost:3001/assets/pdf/${valor}`
                console.log(`URL da imagem construída: ${url}`)
                return url
            } else {
                const url = `http://localhost:3001/api/uploads/${valor}`
                console.log(`URL da foto construída: ${url}`)
                return url
            }
        }

        console.log("Usando placeholder")
        return "/placeholder.svg?height=200&width=200"
    }

    if (!isOpen || !item) return null

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
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-300 hover:text-white">
                    ✖
                </button>
                <div className="text-inherit overflow-y-auto max-h-[60vh] pr-2">
                    <h2 className="text-2xl font-bold mb-4 text-center">Editar Registro</h2>
                    {Object.entries(valores)
                        .filter(
                            ([chave]) =>
                                ![
                                    "createdAt",
                                    "updatedAt",
                                    "deletedAt",
                                    "created_at",
                                    "updated_at",
                                    "deleted_at",
                                    "pais",
                                    "estado",
                                    "cidade",
                                    "posicao_secundaria",
                                    "clube",
                                    "pais_nome",
                                    "estado_nome",
                                    "cidade_nome",
                                    "clube_atual_nome",
                                    "posicao_nome",
                                    "bandeira", // Excluir objeto bandeira
                                ].includes(chave),
                        )
                        .map(([chave, valor]) => {
                            const tipo = detectarTipoInput(chave, valor)
                            const isReadOnly = chave === "id"
                            const isUploading = uploadingFiles[chave]

                            return (
                                <div key={chave} className="mb-4">
                                    <label className="block text-sm mb-1 font-medium">
                                        {chave} {tipo === "file" && "(Arquivo)"}
                                    </label>
                                    {tipo === "textarea" ? (
                                        <textarea
                                            value={valor ?? ""}
                                            onChange={(e) => handleChange(chave, e.target.value)}
                                            className={`w-full p-2 rounded-md ${isReadOnly ? "bg-gray-300 text-gray-500" : "bg-white text-gray-700"
                                                }`}
                                        />
                                    ) : tipo === "date" ? (
                                        <DateInput value={valor} onChange={(newValue: string) => handleChange(chave, newValue)} />
                                    ) : tipo === "file" ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col items-center">
                                                <Image
                                                    src={getImageSrc(chave, valor) || "/assets/placeholder-logo.png"}
                                                    alt={`${chave} atual`}
                                                    className="max-w-[200px] max-h-[200px] object-cover rounded border"
                                                    width={200}
                                                    height={200}
                                                    onError={(e) => {
                                                        console.error(`Erro ao carregar imagem para ${chave}`)
                                                        // Fallback para placeholder
                                                        e.currentTarget.src = "/assets/placeholder-logo.png"
                                                    }}
                                                />
                                                <p className="text-sm text-gray-400 mt-2">
                                                    {valor ? `${chave} atual` : `Nenhuma ${chave} enviada`}
                                                </p>
                                                {isUploading && <p className="text-sm text-blue-400 mt-1">Fazendo upload...</p>}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleChange(chave, e.target.files?.[0] || "")}
                                                disabled={isReadOnly || isUploading}
                                                className={`w-full p-2 rounded-md ${isReadOnly || isUploading ? "bg-gray-300 cursor-not-allowed" : "bg-white text-gray-700"
                                                    }`}
                                            />
                                        </div>
                                    ) : tipo === "uf" ? (
                                        <input
                                            type="text"
                                            value={valor ?? ""}
                                            onChange={(e) => {
                                                const upper = e.target.value.toUpperCase().slice(0, 2)
                                                handleChange(chave, upper)
                                            }}
                                            maxLength={2}
                                            readOnly={isReadOnly}
                                            className={`w-full p-2 rounded-md uppercase tracking-widest ${isReadOnly ? "bg-gray-300 text-gray-500" : "bg-white text-gray-700"}`}
                                        />
                                    ) : (
                                        <input
                                            type={tipo}
                                            value={tipo === "number" ? (valor ?? 0) : (valor ?? "")}
                                            onChange={(e) => handleChange(chave, tipo === "number" ? Number(e.target.value) : e.target.value)}
                                            readOnly={isReadOnly}
                                            className={`w-full p-2 rounded-md ${isReadOnly ? "bg-gray-300 text-gray-500" : "bg-white text-gray-700"
                                                }`}
                                        />
                                    )}
                                    {nomesRelacionados[chave] && (
                                        <p className="text-xs text-gray-300 mt-1">Relacionado: {nomesRelacionados[chave]}</p>
                                    )}
                                </div>
                            )
                        })}
                    {mensagemSucesso && <div className="text-green-300 text-sm text-center mb-4">{mensagemSucesso}</div>}
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(uploadingFiles).some((key) => uploadingFiles[key])}
                        className={`w-full py-2 rounded font-semibold transition ${isDarkMode ? "bg-teal-400 hover:bg-teal-300 text-teal-900" : "bg-gray-600 hover:bg-gray-500 text-white"
                            } ${Object.keys(uploadingFiles).some((key) => uploadingFiles[key]) ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {Object.keys(uploadingFiles).some((key) => uploadingFiles[key]) ? "Fazendo upload..." : "Salvar Alterações"}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
