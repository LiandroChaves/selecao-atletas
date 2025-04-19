import Posicoes from "../database/models/Posicoes.js";
import { Op } from "sequelize";
import Jogador from "../database/models/Jogadores.js";


export const pegarPosicoes = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            where = {
                nome: {
                    [Op.iLike]: `%${search}%` // busca insensível a maiúsculas/minúsculas
                }
            };
        }

        const posicoes = await Posicoes.findAll(
            {
                where,
                order: [["id", "ASC"]], // Ordena por ID em ordem crescente
            }
        );
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

export const editarPosicao = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;

        if (!id || !nome || nome.trim() === "") {
            return res.status(400).json({ error: "ID e nome da posição são obrigatórios" });
        }

        const posicao = await Posicoes.findByPk(id);

        if (!posicao) {
            return res.status(404).json({ error: "Posição não encontrada" });
        }

        posicao.nome = nome;
        await posicao.save();

        res.json({ message: "Posição atualizada com sucesso", posicao });
    } catch (error) {
        console.error("Erro ao atualizar posição:", error);
        res.status(500).json({ error: "Erro ao atualizar posição" });
    }
};

export const deletarPosicao = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID da posição é obrigatório" });
        }

        const posicao = await Posicoes.findByPk(id);

        if (!posicao) {
            return res.status(404).json({ error: "Posição não encontrada" });
        }

        await posicao.destroy();

        res.json({ message: "Posição deletada com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar posição:", error);
        res.status(500).json({ error: "Erro ao deletar posição" });
    }
};

export const pegarPosicaoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID da posição é obrigatório" });
        }

        const posicao = await Posicoes.findByPk(id);

        if (!posicao) {
            return res.status(404).json({ error: "Posição não encontrada" });
        }

        res.json(posicao);
    } catch (error) {
        console.error("Erro ao buscar posição:", error);
        res.status(500).json({ error: "Erro ao buscar posição" });
    }
}

export const pegarPosicoesSecundariasPorID = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID da posição secundária é obrigatório" });
        }

        const posicao = await Posicoes.findByPk(id);

        if (!posicao) {
            return res.status(404).json({ error: "Posição secundária não encontrada" });
        }

        res.json({ nome: posicao.nome });
    } catch (error) {
        console.error("Erro ao buscar nome da posição secundária:", error);
        res.status(500).json({ error: "Erro ao buscar nome da posição secundária" });
    }
}