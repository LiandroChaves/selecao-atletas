import Posicoes from "../database/models/Posicoes.js";

export const pegarPosicoes = async (req, res) => {
    try {
        const posicoes = await Posicoes.findAll();
        res.json(posicoes);
    } catch (error) {
        console.error("Erro ao buscar posições:", error);
        res.status(500).json({ error: "Erro ao buscar posições" });
    }
};

export const inserirPosicao = async (req, res) => {
    const { nome } = req.body;

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ error: "Nome da posição é obrigatório" });
    }

    try {
        const novaPosicao = await Posicoes.create({ nome });
        res.status(201).json({ message: "Posição cadastrada com sucesso", posicao: novaPosicao });
    } catch (error) {
        console.error("Erro ao cadastrar posição:", error);
        res.status(500).json({ error: "Erro ao cadastrar posição" });
    }
};
