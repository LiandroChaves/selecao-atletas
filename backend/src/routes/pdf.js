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
    borda: path.join(basePath, "borda.png")
};


router.get("/gerar-pdf/:id", async (req, res) => {
    try {
        const { categoria } = req.query;
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
        doc.image(logoPath, 40, 40, { width: 90 });
        doc.image(ASSETS.borda, 410, -60, { width: 250 });
        doc.fillColor('#2957A4')
            .font('Helvetica-Bold')        // ← negrito
            .fontSize(16)
            .text('ESPORTE CLUBE LIMOEIRO', 0, 50, { align: 'center' });

        doc.fontSize(13)
            .text(`Ficha Individual do Atleta – ${categoria}`, { align: 'center' });

        // voltar ao estilo normal/preto depois
        doc.fillColor('black')
            .font('Helvetica');


        // espaço para a foto
        if (jogador.foto) {
            doc.image(`uploads/${jogador.foto}`, 480, 110, { width: 100, height: 120, fit: [100, 120] });
        } else {
            doc.rect(430, 120, 100, 120).stroke();
        }

        doc.moveDown(2);

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
            .moveDown(3);        // espaçamento extra antes do próximo bloco


        // ---------- pé dominante ----------
        doc.text(
            `Grau de ambidestria: ${jogador.nivel_ambidestria?.descricao ?? "—"}`,
            { align: "center" }
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
            { align: "center" }
        );
        doc.moveDown(2);
        const imgPe = ASSETS.pe[jogador.pe_dominante];
        safeImage(doc, imgPe, doc.x + 240, doc.y - 15, { width: 100 });
        doc.moveDown(7);

        // ---------- ambidestria ----------
        doc.moveDown();

        // ---------- campos de posição ----------
        doc.text("Posição principal / secundária:", { align: "center" });
        doc.moveDown();
        const yCampos = doc.y + 5;
        safeImage(doc, ASSETS.campo(jogador.posicao?.id), 140, yCampos, { width: 120 });
        safeImage(doc, ASSETS.campo(jogador.posicao_secundaria?.id), 340, yCampos, { width: 120 });
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
        const listaClubes =
            jogador.historico.length
                ? jogador.historico.map(h => {
                    let ano;
                    if (h.data_saida) {
                        ano = dayjs(h.data_saida).format("YYYY");
                    } else if (h.data_entrada) {
                        ano = `${dayjs(h.data_entrada).format("YYYY")} - Atual`;
                    } else {
                        ano = "Sem data";
                    }
                    return `${h.clube?.nome} - (${ano})`;
                })
                : ["Sem histórico informado"];

        listaClubes.forEach(item => doc.text(`• ${item}`, { align: "center" }));

        doc.end();
    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        res.status(500).json({ error: "Erro ao gerar PDF" });
    }
});

export default router;
