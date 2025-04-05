import { Router } from "express";
import Pais from "../database/models/Pais.js"; // ajuste o caminho conforme seu projeto
import sequelize from "../database/db.js"; // garante que a conexão está ativa

const router = Router();

// Listar países
router.get("/pegarPaises", async (req, res) => {
    try {
        const paises = await Pais.findAll({ order: [["id", "ASC"]] });
        res.json(paises);
    } catch (error) {
        console.error("Erro ao buscar países:", error.message);
        res.status(500).json({ error: "Erro ao buscar países" });
    }
});

// Cadastrar país
router.post("/inserirPaises", async (req, res) => {
    const { nome } = req.body;

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ error: "O nome do país é obrigatório" });
    }

    try {
        const novoPais = await Pais.create({ nome });
        res.status(201).json({
            mensagem: "País cadastrado com sucesso!",
            pais: novoPais,
        });
    } catch (error) {
        console.error("Erro ao cadastrar país:", error);
        res.status(500).json({ error: "Erro ao cadastrar país" });
    }
});


export default router;
