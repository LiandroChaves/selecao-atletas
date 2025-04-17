import Titulos from "../database/models/Titulos.js";

export const inserirTitulo = async (req, res) => {
    try {
        const { nome, tipo } = req.body;

        if (!nome || !tipo) {
            return res.status(400).json({ error: "Nome e tipo são obrigatórios." });
        }

        const novoTitulo = await Titulos.create({ nome, tipo });
        res.status(201).json(novoTitulo);
    } catch (error) {
        console.error("Erro ao inserir título:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

export const pegarTitulos = async (req, res) => {
    try {
        const titulos = await Titulos.findAll({
            order: [["id", "ASC"]],
        });
        res.json(titulos);
    } catch (error) {
        console.error("Erro ao buscar títulos:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};
