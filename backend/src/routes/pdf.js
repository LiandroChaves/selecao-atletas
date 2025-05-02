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
    // borda: path.join(basePath, "borda.png")
};


router.get("/gerar-pdf/:id", async (req, res) => {
    try {
        const { categoria, corTituloeBorda = "#2957A4", corSegundaBorda, clube } = req.query;
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
                    as: "historico", // alias que usaremos depois
                    include: [{ model: models.Clubes, as: "clube", attributes: ["nome"] }],
                    order: [["data_entrada", "ASC"]],
                },
                {
                    model: models.JogadoresTitulos,
                    as: "titulos",
                    include: [
                        { model: models.Titulos, as: "titulo" },
                        { model: models.Clubes, as: "clube" } // <--- incluir esse
                    ],
                    order: [["ano", "ASC"]],
                },
            ]
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
        doc.image(logoPath, 40, 40, { width: 90 });

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
            doc.image(`uploads/${jogador.foto}`, 460, 95, { width: 100, height: 120, fit: [100, 120] });
        } else {
            doc.rect(430, 120, 100, 120).stroke();
        }

        doc.moveDown(4);

        // ---------- dados básicos ----------
        doc.fontSize(11)

            // linha 1  – nome completo
            .text(`Nome completo: ${jogador.nome}`, { align: "center" })
            .moveDown()

            // linha 2  – nome curto  |  naturalidade
            .text(
                `Nome curto: ${jogador.nome.split(" ")[0] || jogador.apelido}    |    ` +
                `Naturalidade: ${jogador.cidade?.nome ?? "—"}`,
                { align: "center" }
            )
            .moveDown()

            // linha 3  – data nasc.  |  idade
            .text(
                `Apelido: ${jogador.apelido}    |   ` + `Data nasc.: ${dayjs(jogador.data_nascimento).format("DD/MM/YYYY")}    |    ` +
                `Idade: ${calcularIdade(jogador.data_nascimento)} anos`,
                { align: "center" }
            )
            .moveDown()

            // linha 4  – altura  |  peso
            .text(
                `Altura: ${jogador.altura} m    |    Peso: ${jogador.peso} kg`,
                { align: "center" }
            )

            .moveDown()
        // ---------- campos de posição ----------
        const ycamposText = doc.y + 10; // y inicial para os campos
        doc.text("Posição principal / secundária:", 165, ycamposText);
        doc.moveDown(3);
        const yCampos = doc.y - 20; // y inicial para os campos
        safeImage(doc, ASSETS.campo(jogador.posicao?.id), 70, yCampos, { width: 120 });
        safeImage(doc, ASSETS.campo(jogador.posicao_secundaria?.id), 270, yCampos, { width: 120 });

        // ---------- ambidestria ----------
        // ---------- pé dominante ----------
        doc.text(
            `Grau de ambidestria: ${jogador.nivel_ambidestria?.descricao ?? "—"}`,
            0, ycamposText + 15, { align: "right" },
        );
        doc.text(
            `Pé dominante: ${jogador.pe_dominante === "E"
                ? "Esquerdo"
                : jogador.pe_dominante === "D"
                    ? "Direito"
                    : jogador.pe_dominante === "A"
                        ? "Ambos"
                        : "—"
            }`,
            0, ycamposText, { align: "right" },
        );
        doc.moveDown(2);
        const imgPe = ASSETS.pe[jogador.pe_dominante];
        safeImage(doc, imgPe, doc.x + 460, doc.y, { width: 100 });
        doc.moveDown(17);


        // ---------- características ----------
        doc.text("Características principais:", { align: "center" });
        (jogador.caracteristicas.length
            ? jogador.caracteristicas
            : [{ descricao: "Sem características informadas" }])
            .forEach(c => doc.text(`• ${c.descricao}`, { align: "center" }));

        // ---------- histórico ----------
        doc.moveDown(2).text("Histórico de clubes:", { underline: true, align: "center" });
        doc.moveDown();

        if (jogador.historico.length) {
            const linhas = [];

            // Ordena pelo ano de entrada (ascendente)
            const historicoOrdenado = [...jogador.historico].sort((a, b) => {
                const dataA = a.data_entrada ? dayjs(a.data_entrada) : dayjs(0);
                const dataB = b.data_entrada ? dayjs(b.data_entrada) : dayjs(0);
                return dataA - dataB;
            });

            historicoOrdenado.forEach(h => {
                const entrada = h.data_entrada ? dayjs(h.data_entrada).format("YYYY") : "";
                const saida = h.data_saida ? dayjs(h.data_saida).format("YYYY") : "";

                let periodo = "";
                if (!entrada && !saida) {
                    periodo = "(Sem data)";
                } else if (!saida) {
                    periodo = `(${entrada} - Atual ou data de saída não informada)`;
                } else if (entrada === saida) {
                    periodo = `(${entrada})`;
                } else {
                    periodo = `(${entrada} - ${saida})`;
                }

                linhas.push(`${h.clube?.nome ?? "Clube desconhecido"} ${periodo}`);
            });

            // Exibir dois por linha
            for (let i = 0; i < linhas.length; i += 2) {
                const linhaEsquerda = linhas[i];
                const linhaDireita = linhas[i + 1] ?? "";
                doc.text(
                    `${linhaEsquerda}${linhaDireita ? " | " + linhaDireita : ""}`,
                    { align: "center" }
                );
            }

        } else {
            doc.text("Sem histórico informado", { align: "center" });
        }

        // ---------- titulos jogadores ----------
        doc.moveDown(2).text("Títulos conquistados:", { underline: true, align: "center" });
        doc.moveDown();

        if (jogador.titulos.length) {
            const linhas = [];

            // Ordenar por ano crescente
            const titulosOrdenados = [...jogador.titulos].sort((a, b) => {
                const anoA = a.ano ?? 0;
                const anoB = b.ano ?? 0;
                return anoA - anoB;
            });

            titulosOrdenados.forEach(t => {
                const ano = t.ano ? dayjs(t.ano).format("YYYY") : "";
                const nomeTitulo = t.titulo?.nome ?? "Título desconhecido";
                const nomeClube = t.clube?.nome ?? "Clube desconhecido";
                linhas.push(`${nomeTitulo} ${ano} - ${nomeClube}`);
            });

            // Exibir dois por linha
            for (let i = 0; i < linhas.length; i += 2) {
                const linhaEsquerda = linhas[i];
                const linhaDireita = linhas[i + 1] ?? "";
                doc.text(
                    `${linhaEsquerda}${linhaDireita ? " | " + linhaDireita : ""}`,
                    { align: "center" }
                );
            }

        } else {
            doc.text("Sem títulos conquistados", { align: "center" });
        }

        doc.end();
    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        res.status(500).json({ error: "Erro ao gerar PDF" });
    }
});

export default router;
