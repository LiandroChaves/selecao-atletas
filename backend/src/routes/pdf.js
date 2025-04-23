// routes/pdf.js
import express from "express";
import PDFDocument from "pdfkit";
import models from "../database/models/index.js"; // ajuste conforme seu setup
import dayjs from "dayjs";

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

router.get("/gerar-pdf/:id", async (req, res) => {
    try {
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
            ]
        });


        if (!jogador) return res.status(404).json({ error: "Jogador não encontrado" });

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${jogador.apelido || jogador.nome}.pdf"`);

        doc.pipe(res);

        // Título
        doc.fontSize(16).text("FICHA INDIVIDUAL DO ATLETA", { align: "center" });
        doc.moveDown();

        // Dados básicos
        doc.fontSize(12).text(`Nome completo: ${jogador.nome}`);
        doc.text(`Nome curto: ${jogador.nome.split(" ")[0] || jogador.apelido}`);
        doc.text(`Naturalidade | Cidade: ${jogador.cidade?.nome ?? "Não informada"}`);
        doc.text(`Apelido: ${jogador.apelido}`);
        doc.text(`Data de nascimento: ${dayjs(jogador.data_nascimento).format("DD/MM/YYYY")}`);
        doc.text(`Idade: ${jogador.data_nascimento ? calcularIdade(jogador.data_nascimento) : "Não informada"}`);
        doc.text(`Altura: ${jogador.altura} m`);
        doc.text(`Peso: ${jogador.peso} kg`);
        doc.moveDown();

        // Pé e ambidestria
        doc.text(`Pé dominante: ${jogador.pe_dominante === "E" ? "Esquerdo" : "Direito"}`);
        doc.text(`Grau de ambidestria: ${jogador.nivel_ambidestria?.descricao || "Não informado"}`);
        doc.moveDown();

        // Posições
        doc.text(`Posição principal: ${jogador.posicao?.nome || "Não informada"}`);
        doc.text(`Posição secundária: ${jogador.posicao_secundaria?.nome || "Não informada"}`);
        doc.moveDown();

        // Características principais
        doc.text("Características principais:");
        if (jogador.caracteristicas.length > 0) {
            jogador.caracteristicas.forEach((c, i) => {
                doc.text(`• ${c.descricao}`);
            });
        } else {
            doc.text("Nenhuma característica cadastrada.");
        }
        doc.moveDown();

        // Espaço para histórico
        doc.text("Histórico de clubes:", { underline: true });
        doc.moveDown().moveDown().moveDown().moveDown();

        doc.text("__________________________", { align: "left" });
        doc.text("__________________________", { align: "left" });
        doc.text("__________________________", { align: "left" });

        doc.end();
    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        res.status(500).json({ error: "Erro ao gerar PDF" });
    }
});

export default router;
