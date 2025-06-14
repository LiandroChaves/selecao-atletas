// routes/pdf.js
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
                    order: [["data_entrada", "ASC"]],
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

        let logoPath = ASSETS.logo;

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
                    logoPath = path.join(basePath, logoClube.url_logo);
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

        // Logo do clube
        doc.image(logoPath, 40, 40, {
            fit: [90, 90], // mantém proporção até 90x90
            align: 'left',
            valign: 'top'
        });

        // doc.image(ASSETS.borda, 410, -60, { width: 250 });

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

        // Restaura o estado do canvas
        doc.restore();

        // Título do cabeçalho
        const nomeClube = clube || "Esporte Clube Limoeiro";

        doc.fillColor(corTituloeBorda)
            .font('Helvetica-Bold')
            .fontSize(16)
            .text(`${nomeClube}`, 0, 50, { align: 'center' });

        doc.fontSize(13)
            .text(`Ficha Individual do Atleta – ${categoria}`, { align: 'center' });

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
                `Nome curto: ${jogador.nome_curto || jogador.apelido}    |    ` +
                `Naturalidade: ${jogador.cidade?.nome ?? "Não informado"}`,
                { align: "center" }
            )
            .moveDown()

            // linha 3  – apelido  |  data nasc.  |  idade
            .text(
                `Apelido: ${jogador.apelido || "Não informado"}    |   ` +
                `Data nasc.: ${dayjs(jogador.data_nascimento).format("DD/MM/YYYY")}    |    ` +
                `Idade: ${calcularIdade(jogador.data_nascimento)} anos`,
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
        doc.text("Posição principal:", 90, ycamposText + 30);
        safeImage(doc, ASSETS.campo(jogador.posicao?.id), 150, ycamposText + 45, { width: 120 });

        // Altura da imagem (aproximada) + espaço entre as seções
        const imagemAltura = 120;
        const espacoEntre = 30; // inclui espaço entre texto e imagem seguinte

        // Posição secundária, mais abaixo
        const yCamposSecundaria = ycamposText + imagemAltura + espacoEntre;
        doc.text("Posição secundária:", 90, yCamposSecundaria + 75);
        safeImage(doc, ASSETS.campo(jogador.posicao_secundaria?.id), 150, yCamposSecundaria + 90, { width: 120 });


        // ---------- ambidestria ----------
        // ---------- pé dominante ----------
        doc.text(
            `Grau de ambidestria: ${jogador.nivel_ambidestria?.descricao ?? "Não informado"}`,
            330, ycamposText + 115, { align: "left" }
        );
        doc.text(
            `Pé dominante: ${jogador.pe_dominante === "E"
                ? "Esquerdo"
                : jogador.pe_dominante === "D"
                    ? "Direito"
                    : "Não informado"
            }`,
            330, ycamposText + 130,
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
            doc.image(imagemPe, 330, ycamposText + 150, { width: 140 }); // ajuste o tamanho e posição conforme necessário
        }

        // Histórico clubes
        doc.addPage();

        // Função que detecta se o clube é profissional (tem sufixo "- Ux")
        function isProfissional(nomeClube) {
            return /- U\d+$/.test(nomeClube);
        }

        // Separar histórico em normal e profissional
        const historicoNormal = [];
        const historicoProfissional = [];

        jogador.historico.forEach(h => {
            const nomeClube = h.clube?.nome ?? "";
            if (isProfissional(nomeClube)) {
                historicoProfissional.push(h);
            } else {
                historicoNormal.push(h);
            }
        });

        // Função para desenhar o cabeçalho das colunas
        function desenharCabecalho(posicaoInicialX, larguraColunaAno, larguraColunaClube, larguraColunaJogos, totalLargura) {
            doc.font("Helvetica-Bold").fontSize(10);

            const yInicial = doc.y;

            doc.text("Ano", posicaoInicialX, yInicial, {
                width: larguraColunaAno,
                align: "left"
            });
            doc.text("Clube", posicaoInicialX + larguraColunaAno, yInicial, {
                width: larguraColunaClube,
                align: "left"
            });
            doc.text("Jogos", posicaoInicialX + larguraColunaAno + larguraColunaClube, yInicial, {
                width: larguraColunaJogos,
                align: "right"
            });

            doc.moveTo(posicaoInicialX - 15, yInicial + 12)
                .lineTo(posicaoInicialX + totalLargura + 15, yInicial + 12)
                .stroke();

            // Move para posição exata da próxima linha após o cabeçalho
            doc.y = yInicial + 18; // 12 de linha + 6 de espaçamento

            doc.font("Helvetica"); // ⚠️ Reset para fonte normal
        }
        // Função para renderizar o histórico
        function renderHistorico(titulo, historicoArray) {
            if (historicoArray.length === 0) return;

            if (doc.y > 50) doc.moveDown(2);

            const margemEsquerda = doc.page.margins.left;
            const larguraDisponivel = doc.page.width - doc.page.margins.left - doc.page.margins.right;

            doc
                .font("Helvetica-Bold")
                .fontSize(13)
                .text(titulo, margemEsquerda, doc.y, {
                    width: larguraDisponivel,
                    align: "center",
                    underline: true,
                });

            doc.moveDown();

            // Define as variáveis de largura e posição
            const larguraColunaAno = 50;
            const larguraColunaClube = 250;
            const larguraColunaJogos = 50;
            const totalLargura = larguraColunaAno + larguraColunaClube + larguraColunaJogos;
            const posicaoInicialX = (doc.page.width - totalLargura) / 2;

            // Desenha o cabeçalho passando as variáveis
            desenharCabecalho(posicaoInicialX, larguraColunaAno, larguraColunaClube, larguraColunaJogos, totalLargura);

            // Ordenar e agrupar
            const historico = [...historicoArray].sort((a, b) => {
                const paisA = a.clube?.pais?.bandeira?.logo_bandeira ?? "brasil";
                const paisB = b.clube?.pais?.bandeira?.logo_bandeira ?? "brasil";

                if (paisA < paisB) return -1;
                if (paisA > paisB) return 1;

                const dataA = a.data_entrada ? dayjs(a.data_entrada) : dayjs(0);
                const dataB = b.data_entrada ? dayjs(b.data_entrada) : dayjs(0);
                return dataB - dataA;
            });

            const gruposPorAno = {};
            historico.forEach(h => {
                const ano = h.data_entrada ? dayjs(h.data_entrada).format("YYYY") : "Sem data";
                if (!gruposPorAno[ano]) gruposPorAno[ano] = [];
                gruposPorAno[ano].push(h);
            });

            doc.font("Helvetica").fontSize(10);

            Object.keys(gruposPorAno).sort((a, b) => b.localeCompare(a)).forEach(ano => {
                const lista = gruposPorAno[ano];

                lista.forEach((h, idx) => {
                    const alturaLinha = 14; // ajuste conforme layout
                    const limiteInferior = doc.page.height - doc.page.margins.bottom;

                    // Quebra de página automática
                    if (doc.y + alturaLinha > limiteInferior) {
                        doc.addPage();
                        desenharCabecalho(posicaoInicialX, larguraColunaAno, larguraColunaClube, larguraColunaJogos, totalLargura);
                    }

                    let clube = h.clube?.nome ?? "Clube desconhecido";
                    const jogos = h.jogos ?? 0;
                    const yAtual = doc.y;

                    let caminhoBandeira = ASSETS.bandeiraBrasil;
                    const logoPath = h.clube?.pais?.bandeira?.logo_bandeira;
                    if (logoPath) {
                        const fullPath = path.join(basePath, logoPath);
                        if (fs.existsSync(fullPath)) {
                            caminhoBandeira = fullPath;
                        }
                    }

                    // Bandeira do país
                    safeImage(doc, caminhoBandeira, posicaoInicialX + larguraColunaAno - 15, yAtual, {
                        width: 12,
                        height: 8,
                    });

                    const textoAno = idx === 0 ? ano : "";

                    doc.text(textoAno, posicaoInicialX, yAtual, {
                        width: larguraColunaAno,
                        align: "left"
                    });
                    doc.text(clube, posicaoInicialX + larguraColunaAno, yAtual, {
                        width: larguraColunaClube,
                        align: "left"
                    });
                    doc.text(jogos.toString(), posicaoInicialX + larguraColunaAno + larguraColunaClube, yAtual, {
                        width: larguraColunaJogos,
                        align: "right"
                    });
                });

                doc.moveDown(0.3);
            });
        }

        // Chamar para histórico normal
        if (historicoNormal.length > 0) {
            renderHistorico("Histórico de clubes:", historicoNormal);
        }

        // Chamar para histórico profissionais
        if (historicoProfissional.length > 0) {
            renderHistorico("Histórico de clubes (profissionais):", historicoProfissional);
        }

        // Caso não haja nenhum histórico em ambos
        if (historicoNormal.length === 0 && historicoProfissional.length === 0) {
            const larguraColunaAno = 50;
            const larguraColunaClube = 250;
            const larguraColunaJogos = 50;
            const totalLargura = larguraColunaAno + larguraColunaClube + larguraColunaJogos;
            const posicaoInicialX = (doc.page.width - totalLargura) / 2;

            doc.text("Sem histórico informado", posicaoInicialX, doc.y);
        }

        doc.moveDown(2);

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
                const ano = t.ano ? dayjs(t.ano).format("YYYY") : "Sem ano";
                const nomeTitulo = t.titulo?.nome ?? "Título desconhecido";
                const nomeClube = t.clube?.nome ?? "Clube desconhecido";

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

        if (jogador.foto) {
            doc.image(`uploads/${jogador.foto}`, 460, 160, { width: 100, height: 120, fit: [100, 120] });
        }

        // Título da página
        doc.fontSize(14).fillColor(`${corTituloeBorda}`).text("Dados Específicos do Atleta", 50, doc.y);
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
            : [{ descricao: "Sem características informadas" }])
            .forEach(c => doc.text(`• ${c.descricao}`, doc.x, doc.y));


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
