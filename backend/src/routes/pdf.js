// backend/src/routes/pdf.js

import express from "express";
import PDFDocument from "pdfkit";
import models from "../database/models/index.js"; // ajuste conforme seu setup
import dayjs from "dayjs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import LogosClubes from "../database/models/LogoClubes.js";

const router = express.Router();
const calcularIdade = (dataNascimento) => {
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// raiz = backend/src
const basePath = path.join(__dirname, "..", "assets", "pdf");

function safeImage(doc, imgPath, x, y, opts = {}) {
    if (!imgPath) return;                 // valor nulo/undefined
    if (fs.existsSync(imgPath)) {
        doc.image(imgPath, x, y, opts);
    } else {
        console.warn("Imagem não encontrada:", imgPath);
    }
}


// caminhos auxiliares -------------------------------------------------------
const ASSETS = {
    logo: path.join(basePath, "logo-ecl.png"),
    pe: {
        E: path.join(basePath, "pe_esquerdo.png"),
        D: path.join(basePath, "pe_direito.png"),
    },
    campo: pos => path.join(basePath, `campo_${pos}.png`),
    bandeiraBrasil: path.join(basePath, "brasil.png"),
};

router.get("/gerar-pdf/:id", async (req, res) => {
    try {
        const { categoria, corTituloeBorda = "#2957A4", corSegundaBorda, clube, bandeira } = req.query;
        const jogador = await models.Jogador.findByPk(req.params.id, {
            include: [
                { model: models.Pais, as: "pais" },
                { model: models.Estados, as: "estado" },
                { model: models.Cidades, as: "cidade" },
                { model: models.Posicoes, as: "posicao" },
                { model: models.Posicoes, as: "posicao_secundaria" },
                { model: models.Clubes, as: "clube" },
                { model: models.NivelAmbidestria, as: "nivel_ambidestria" },
                { model: models.Caracteristicas, as: "caracteristicas" },
                {
                    model: models.HistoricoClubes,
                    as: "historico",
                    include: [
                        {
                            model: models.Clubes,
                            as: "clube",
                            attributes: ["nome", "pais_id"],
                            include: [
                                {
                                    model: models.Pais,
                                    as: "pais",
                                    attributes: ["nome"],
                                    include: [
                                        {
                                            model: models.Bandeiras,
                                            as: "bandeira",
                                            attributes: ["logo_bandeira"] // ou "arquivo", depende do seu model
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    order: [["data_entrada", "DESC"]],
                },
                {
                    model: models.JogadoresTitulos,
                    as: "titulos",
                    include: [
                        { model: models.Titulos, as: "titulo" },
                        { model: models.Clubes, as: "clube" }
                    ],
                    order: [["ano", "ASC"]],
                },
            ]
        });

        const estatisticas = await models.EstatisticasPartidas.findAll({
            where: { jogador_id: jogador.id },
            include: [
                {
                    model: models.Partidas, as: "partida", include: [
                        { model: models.Clubes, as: "clubeCasa" },
                        { model: models.Clubes, as: "clubeFora" }
                    ]
                }
            ],
            order: [["partida_id", "ASC"]]
        });

        const historicoLesoes = await models.HistoricoLesoes.findAll({
            where: { jogador_id: jogador.id },
            order: [["data_inicio", "ASC"]]
        });

        if (!jogador) return res.status(404).json({ error: "Jogador não encontrado" });

        let logoPath = null;

        if (req.query.clube) {
            const clube = await models.Clubes.findOne({
                where: {
                    nome: req.query.clube
                }
            });

            if (clube) {
                const logoClube = await LogosClubes.findOne({
                    where: {
                        clube_id: clube.id
                    }
                });

                if (logoClube) {
                    const fullPath = path.join(basePath, logoClube.url_logo);
                    if (fs.existsSync(fullPath)) {
                        logoPath = fullPath;
                    }
                }
            }
        }

        const filename = `${(jogador.nome || jogador.apelido).replace(/\s+/g, '_')}.pdf`;
        res.set('Content-Disposition',
            `inline; filename="${filename}"` +
            `; filename*=UTF-8''${encodeURIComponent(filename)}`);

        const doc = new PDFDocument({ margin: 40 });
        doc.pipe(res);

        // ---------- cabeçalho ----------

        if (req.query.clube) {
            // Logo do clube
            if (logoPath) {
                doc.image(logoPath, 40, 40, {
                    fit: [90, 90],
                    align: 'left',
                    valign: 'top'
                });
            }

            const largura = 180;
            const altura = 10;

            doc.save();

            doc.translate(490, -15);  // ponto de rotação (ajuste conforme necessário)
            doc.rotate(30); // rotaciona -30 graus (negativo inclina para esquerda)

            // Primeira faixa (cor principal)
            doc.fillColor(corSegundaBorda)
                .moveTo(0, 0)
                .lineTo(largura, 0)
                .lineTo(largura - 10, altura)
                .lineTo(-10, altura)
                .closePath()
                .fill();

            // Segunda faixa (cor secundária)
            doc.fillColor(corTituloeBorda)
                .moveTo(-10, altura)
                .lineTo(largura - 10, altura)
                .lineTo(largura - 20, altura * 2)
                .lineTo(-20, altura * 2)
                .closePath()
                .fill();

            doc.restore();

            // Título com cor
            doc.fillColor(corTituloeBorda)
                .font('Helvetica-Bold')
                .fontSize(16)
                .text(`${formatarNomeClube(req.query.clube)}`, 0, 50, { align: 'center' });

            doc.fontSize(13)
                .text(`Ficha Individual do Atleta – ${categoria}`, { align: 'center' });

        } else {
            // Cabeçalho sem logo, sem cor e sem faixa
            doc.fillColor('black')
                .font('Helvetica-Bold')
                .fontSize(16)
                .text(`Ficha Individual do Atleta`, 0, 50, { align: 'center' });

            doc.fontSize(13)
                .text(`${categoria}`, { align: 'center' });
        }

        // Volta para o estilo padrão (texto preto, sem negrito)
        doc.fillColor('black')
            .font('Helvetica');

        // espaço para a foto
        if (jogador.foto) {
            doc.image(`uploads/${jogador.foto}`, 480, 95, { width: 100, height: 120, fit: [100, 120] });
        } else {
            doc.rect(430, 120, 100, 120).stroke();
        }

        doc.moveDown(2);

        // ---------- dados básicos ----------
        doc.fontSize(11)

            // linha 1  – nome completo
            .text(`Nome completo: ${jogador.nome || "Não informado"}`, { align: "center" })
            .moveDown()

            // linha 2  – nome curto  |  naturalidade
            .text(
                `Nome curto: ${jogador.nome_curto || jogador.apelido || "Não informado"}  |  ` +
                `Naturalidade: ${jogador.cidade?.nome ?? "Não informada"} - ${jogador.estado?.uf ?? "Sem UF"}`,
                { align: "center" }
            )
            .moveDown()

            // linha 3  – apelido  |  data nasc.  |  idade
            .text(
                `Apelido: ${jogador.apelido || "Nenhum"} | ` +
                `Data nasc.: ${jogador.data_nascimento ? dayjs(jogador.data_nascimento).format("DD/MM/YYYY") : "Data não informada"}  |  ` +
                `Idade: ${jogador.data_nascimento ? calcularIdade(jogador.data_nascimento) + " anos": "Não informada"}`,
                { align: "center" }
            )
            .moveDown()

            // linha 4  – altura  |  peso
            .text(
                `Altura: ${jogador.altura || "Não informado"} m    |    Peso: ${jogador.peso || "Não informado"} kg`,
                { align: "center" }
            )
            .moveDown()

        // ---------- campos de posição ----------
        // Coordenada Y base dos textos
        const ycamposText = doc.y + 10;

        // Posição principal
        doc.text(`Posição principal: ${jogador.posicao?.nome}`, 90, ycamposText - 15);
        safeImage(doc, ASSETS.campo(jogador.posicao?.id), 150, ycamposText, { width: 180 });

        // Altura da imagem (aproximada) + espaço entre as seções
        const imagemAltura = 120;
        const espacoEntre = 30; // inclui espaço entre texto e imagem seguinte

        // Posição secundária, mais abaixo
        const yCamposSecundaria = ycamposText + imagemAltura + espacoEntre;
        doc.text(`Posição secundária: ${jogador.posicao_secundaria?.nome ? jogador.posicao_secundaria?.nome : "Posição não informada"}`, 90, yCamposSecundaria + 110);
        safeImage(doc, ASSETS.campo(jogador.posicao_secundaria?.id), 150, yCamposSecundaria + 120, { width: 180 });


        // ---------- ambidestria ----------
        // ---------- pé dominante ----------
        doc.text(
            `Grau de ambidestria: ${jogador.nivel_ambidestria?.descricao ?? "Não informado"}`,
            360, ycamposText + 115, { align: "left" }
        );
        doc.text(
            `Pé dominante: ${jogador.pe_dominante === "E"
                ? "Esquerdo"
                : jogador.pe_dominante === "D"
                    ? "Direito"
                    : "Não informado"
            }`,
            360, ycamposText + 130,
        );

        // Determine o caminho da imagem do pé dominante
        let imagemPe = null;

        if (jogador.pe_dominante === "E") {
            imagemPe = ASSETS.pe.E;
        } else if (jogador.pe_dominante === "D") {
            imagemPe = ASSETS.pe.D;
        } else if (jogador.pe_dominante === "A") {
            // Se quiser mostrar os dois pés para ambidestro, você pode compor os dois
            imagemPe = null; // ou uma imagem específica para ambidestro, se tiver: ASSETS.pe.A
        }

        // Renderiza a imagem no PDF, se aplicável
        if (imagemPe) {
            doc.image(imagemPe, 360, ycamposText + 150, { width: 140 }); // ajuste o tamanho e posição conforme necessário
        }

        // Histórico clubes
        doc.addPage()

        function formatarNomeClube(nome) {
            if (!nome.includes("-")) return nome
            const [antes, depois] = nome.split("-")
            const depoisTrimado = depois.trim()
            const depoisFormatado = depoisTrimado
                .split(" ")
                .map((palavra) => {
                    if (palavra.length === 2) return palavra.toUpperCase()
                    return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
                })
                .join(" ")
            return `${antes.trim()} - ${depoisFormatado}`
        }

        // Separar histórico por categoria usando o campo categoria do banco
        const historicoAmador = []
        const historicoProfissional = []
        const historicoBase = []

        jogador.historico.forEach((h) => {
            const categoria = h.categoria || "Profissional" // fallback para registros antigos

            switch (categoria) {
                case "Amador":
                    historicoAmador.push(h)
                    break
                case "Base":
                    historicoBase.push(h)
                    break
                case "Profissional":
                default:
                    historicoProfissional.push(h)
                    break
            }
        })

        // Função para desenhar o cabeçalho das colunas
        function desenharCabecalho(x, colAno, colClube, colJogos, larguraTotal) {
            doc.font("Helvetica-Bold").fontSize(10)
            const y = doc.y
            doc.text("Ano", x, y, { width: colAno, align: "left" })
            doc.text("Clube", x + colAno, y, { width: colClube, align: "left" })
            doc.text("Jogos", x + colAno + colClube, y, { width: colJogos, align: "right" })
            doc
                .moveTo(x - 15, y + 12)
                .lineTo(x + larguraTotal + 15, y + 12)
                .stroke()
            doc.y = y + 18
            doc.font("Helvetica")
        }

        // Função para renderizar o histórico
        function renderHistorico(titulo, historicoArray) {
            if (historicoArray.length === 0) return

            if (doc.y > 50) doc.moveDown(2)

            const margemEsquerda = doc.page.margins.left
            const larguraDisponivel = doc.page.width - doc.page.margins.left - doc.page.margins.right

            doc.font("Helvetica-Bold").fontSize(13).text(titulo, margemEsquerda, doc.y, {
                width: larguraDisponivel,
                align: "center",
                underline: true,
            })
            doc.moveDown()

            const larguraColunaAno = 50
            const larguraColunaClube = 250
            const larguraColunaJogos = 50
            const totalLargura = larguraColunaAno + larguraColunaClube + larguraColunaJogos
            const posicaoInicialX = (doc.page.width - totalLargura) / 2

            desenharCabecalho(posicaoInicialX, larguraColunaAno, larguraColunaClube, larguraColunaJogos, totalLargura)

            // Ordenar por ano DESC
            const historico = [...historicoArray].sort((a, b) => {
                const dataA = a.data_entrada ?? 0
                const dataB = b.data_entrada ?? 0
                if (dataA !== dataB) return dataB - dataA
                return (b.id ?? 0) - (a.id ?? 0)
            })

            // Agrupar por ano
            const gruposPorAno = {}
            historico.forEach((h) => {
                const ano = h.data_entrada ? h.data_entrada.toString() : "Sem data"
                if (!gruposPorAno[ano]) gruposPorAno[ano] = []
                gruposPorAno[ano].push(h)
            })

            doc.font("Helvetica").fontSize(10)
            Object.keys(gruposPorAno)
                .sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
                .forEach((ano) => {
                    const lista = gruposPorAno[ano]
                    lista.forEach((h, idx) => {
                        const alturaLinha = 14
                        const limiteInferior = doc.page.height - doc.page.margins.bottom

                        if (doc.y + alturaLinha > limiteInferior) {
                            doc.addPage()
                            desenharCabecalho(posicaoInicialX, larguraColunaAno, larguraColunaClube, larguraColunaJogos, totalLargura)
                        }

                        const clube = h.clube?.nome ? formatarNomeClube(h.clube.nome) : "Clube desconhecido"
                        const jogos = h.jogos ?? 0
                        const yAtual = doc.y

                        let caminhoBandeira = ASSETS.bandeiraBrasil
                        const logoPath = h.clube?.pais?.bandeira?.logo_bandeira
                        if (logoPath) {
                            const fullPath = path.join(basePath, logoPath)
                            if (fs.existsSync(fullPath)) {
                                caminhoBandeira = fullPath
                            }
                        }

                        safeImage(doc, caminhoBandeira, posicaoInicialX + larguraColunaAno - 15, yAtual, {
                            width: 12,
                            height: 8,
                        })

                        const textoAno = idx === 0 ? ano : ""
                        doc.text(textoAno, posicaoInicialX, yAtual, {
                            width: larguraColunaAno,
                            align: "left",
                        })

                        doc.text(clube, posicaoInicialX + larguraColunaAno, yAtual, {
                            width: larguraColunaClube,
                            align: "left",
                        })

                        doc.text(jogos.toString(), posicaoInicialX + larguraColunaAno + larguraColunaClube, yAtual, {
                            width: larguraColunaJogos,
                            align: "right",
                        })
                    })
                    doc.moveDown(0.3)
                })
        }

        // Renderizar cada categoria de histórico
        if (historicoProfissional.length > 0) {
            renderHistorico("Histórico de clubes (PROFISSIONAL):", historicoProfissional)
        }

        if (historicoBase.length > 0) {
            renderHistorico("Histórico de clubes (BASE):", historicoBase)
        }

        if (historicoAmador.length > 0) {
            renderHistorico("Histórico de clubes (AMADOR):", historicoAmador)
        }

        // Caso não haja nenhum histórico
        if (historicoProfissional.length === 0 && historicoBase.length === 0 && historicoAmador.length === 0) {
            const larguraColunaAno = 50
            const larguraColunaClube = 250
            const larguraColunaJogos = 50
            const totalLargura = larguraColunaAno + larguraColunaClube + larguraColunaJogos
            const posicaoInicialX = (doc.page.width - totalLargura) / 2
            doc.text("Sem histórico informado", posicaoInicialX, doc.y)
        }

        doc.moveDown(2)

        // voltar ao estilo padrão
        doc.font("Helvetica").fontSize(10);
        doc.fillColor("black");

        doc.addPage();
        // ---------- títulos jogadores ----------
        doc.moveDown(2).text("Títulos conquistados:", 245, doc.y, { underline: true });

        // Cabeçalho das colunas
        doc.font("Helvetica-Bold").fontSize(10);

        const larguraColunaAnoTit = 50;
        const larguraColunaTitulo = 200;
        const larguraColunaClubeTit = 150;
        const totalLarguraTit = larguraColunaAnoTit + larguraColunaTitulo + larguraColunaClubeTit;

        const posicaoInicialXTit = (doc.page.width - totalLarguraTit) / 2;
        let posYTit = doc.y;

        // Cabeçalho
        doc.text("Ano", posicaoInicialXTit, posYTit, {
            width: larguraColunaAnoTit,
            align: "left"
        });
        doc.text("Título", posicaoInicialXTit + larguraColunaAnoTit, posYTit, {
            width: larguraColunaTitulo,
            align: "left"
        });
        doc.text("Clube", posicaoInicialXTit + larguraColunaAnoTit + larguraColunaTitulo, posYTit, {
            width: larguraColunaClubeTit,
            align: "left"
        });

        // Linha horizontal após o cabeçalho
        doc.moveTo(posicaoInicialXTit - 15, doc.y)
            .lineTo(posicaoInicialXTit + totalLarguraTit + 15, doc.y)
            .stroke();

        doc.moveDown();

        if (jogador.titulos.length) {
            const titulosOrdenados = [...jogador.titulos].sort((a, b) => {
                const anoA = a.ano ?? 0;
                const anoB = b.ano ?? 0;
                return anoA - anoB;
            });

            doc.font("Helvetica").fontSize(10);

            titulosOrdenados.forEach((t, idx) => {
                const ano = t.ano ? String(t.ano) : "Sem ano";
                const nomeTitulo = t.titulo?.nome ?? "Título desconhecido";
                const nomeClube = formatarNomeClube(t.clube?.nome) ?? "Clube desconhecido";

                const yAtual = doc.y;

                doc.text(ano, posicaoInicialXTit, yAtual, {
                    width: larguraColunaAnoTit,
                    align: "left"
                });

                doc.text(nomeTitulo, posicaoInicialXTit + larguraColunaAnoTit, yAtual, {
                    width: larguraColunaTitulo,
                    align: "left"
                });

                doc.text(nomeClube, posicaoInicialXTit + larguraColunaAnoTit + larguraColunaTitulo, yAtual, {
                    width: larguraColunaClubeTit,
                    align: "left"
                });
                doc.moveDown(0.3);
            });
        } else {
            doc.text("Sem títulos conquistados", posicaoInicialXTit, doc.y);
        }

        doc.moveDown(2);

        // Título da página
        doc.fontSize(14)
            .fillColor(req.query.clube ? corTituloeBorda : 'black')
            .text("Dados Específicos do Atleta", 50, doc.y);
        doc.moveDown();

        // voltar tudo ao estilo padrão
        doc.font("Helvetica").fontSize(10);
        doc.fillColor("black");
        // ---------- características ----------
        doc.fontSize(12).fillColor("black").text("Características principais:", doc.x, doc.y, { underline: true });
        doc.moveDown()
        doc.font("Helvetica").fontSize(10);
        doc.fillColor("black");

        (jogador.caracteristicas.length
            ? jogador.caracteristicas
            : [{ descricao: "Sem características informadas." }])
            .forEach(c => doc.text(`${c.descricao}`, doc.x, doc.y));


        // Estatísticas por partida
        doc.moveDown(3).fontSize(12).fillColor("black").text("Estatísticas por partida:", { underline: true });
        doc.moveDown();

        if (estatisticas.length) {
            estatisticas.forEach((e) => {
                const partida = e.partida;
                const dataPartida = dayjs(partida?.data).format("DD/MM/YYYY");
                const estadio = partida?.estadio || "Local não informado";
                const campeonato = partida?.campeonato || "Campeonato não informado";
                const clubeCasa = partida?.clubeCasa?.nome || "Clube Casa";
                const clubeFora = partida?.clubeFora?.nome || "Clube Fora";
                const placar = `${clubeCasa}: ${partida?.gols_casa} x ${partida?.gols_fora} :${clubeFora}`;

                doc
                    .fontSize(11)
                    .fillColor("black")
                    .text(`Partida realizada em: ${dataPartida}  |  Local: ${estadio}`, { bold: true })
                doc.moveDown()
                    .fillColor("black")
                    .fontSize(10)
                    .text(`Campeonato: ${campeonato}`)
                    .text(`Placar: ${placar}`)
                    .text(`Minutos jogados: ${e.minutos_jogados}`)
                    .text(`Gols: ${e.gols}`)
                    .text(`Assistências: ${e.assistencias}`)
                    .text(`Passes: ${e.passes_totais} (${e.passes_certos} certos, ${e.passes_errados} errados)`)
                    .text(`Finalizações: ${e.finalizacoes} (${e.finalizacoes_no_alvo} no alvo)`)
                    .text(`Desarmes: ${e.desarmes}`)
                    .text(`Faltas cometidas: ${e.faltas_cometidas}`)
                    .text(`Cartões: ${e.cartoes_amarelos} Amarelos, ${e.cartoes_vermelhos} Vermelhos`)
                    .moveDown();
            });
        } else {
            doc.fontSize(10).text("Sem estatísticas registradas.");
        }

        // Lesões
        doc.moveDown(2).fontSize(12).text("Histórico de lesões:", { underline: true });
        doc.moveDown();

        if (historicoLesoes.length) {
            historicoLesoes.forEach(l => {
                const inicio = dayjs(l.data_inicio).format("DD/MM/YYYY");
                const retorno = l.data_retorno ? dayjs(l.data_retorno).format("DD/MM/YYYY") : "Não informado";
                doc.fontSize(10).text(
                    `Tipo: ${l.tipo_lesao}\nInício: ${inicio} | Retorno: ${retorno}\n${l.descricao ?? ""}`,
                    { align: "left" }
                );
            });
        } else {
            doc.fontSize(10).text("Sem lesões registradas.");
        }

        doc.end();
    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        res.status(500).json({ error: "Erro ao gerar PDF" });
    }
});

export default router;