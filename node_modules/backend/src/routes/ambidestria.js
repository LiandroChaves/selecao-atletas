import express from "express";
import NivelAmbidestria from "../database/models/Ambidestria.js";

const router = express.Router();

// GET: pegar todos os níveis
router.get("/pegarNiveis", async (req, res) => {
    try {
        const niveis = await NivelAmbidestria.findAll();
        res.json(niveis);
    } catch (error) {
        console.error("❌ Erro ao buscar níveis:", error);
        res.status(500).json({ error: "Erro ao buscar níveis." });
    }
});

// POST: inserir novo nível
router.post("/inserirNivel", async (req, res) => {
    try {
        const { descricao } = req.body;

        if (!descricao || !descricao.trim()) {
            return res.status(400).json({ error: "Descrição é obrigatória." });
        }

        const novoNivel = await NivelAmbidestria.create({
            descricao: descricao.trim(),
        });

        res.status(201).json({ nivel: novoNivel });
    } catch (error) {
        console.error("❌ Erro ao inserir nível:", error);
        res.status(500).json({ error: "Erro ao inserir nível." });
    }
});

export default router;
