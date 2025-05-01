import Titulos from "../database/models/Titulos.js";
import { Op } from "sequelize";

export const pegarTitulos = async (req, res) => {
    try {
        const search = (req.query.search || "").toString().trim(); // garante string e tira espaços
        let where = {};

        if (!isNaN(Number(search)) && search !== "") {
            where = { id: Number(search) };
        } else if (search !== "") {
            where = {
                nome: { [Op.iLike]: `%${search}%` },
            };
        }

        const titulos = await Titulos.findAll({
            where,
            order: [["id", "ASC"]],
        });

        res.status(200).json(titulos);
    } catch (error) {
        console.error("Erro ao buscar títulos:", error.message);
        res.status(500).json({ error: "Erro interno do servidor.", detalhes: error.message });
    }
};

export const pegarTitulo = async (req, res) => {
    try {
        const { id } = req.params;

        const titulo = await Titulos.findByPk(id, {
            attributes: ["id", "nome", "tipo"]
        });

        if (!titulo) {
            return res.status(404).json({ error: "Título não encontrado" });
        }

        res.json(titulo);
    } catch (error) {
        console.error("Erro ao buscar título:", error);
        res.status(500).json({ error: "Erro ao buscar título", details: error.message });
    }
};

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

export const editarTitulo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, tipo } = req.body;

        const titulo = await Titulos.findByPk(id);
        if (!titulo) {
            return res.status(404).json({ error: "Título não encontrado." });
        }

        await titulo.update({ nome, tipo });
        res.status(200).json({ mensagem: "Título atualizado com sucesso", titulo });
    } catch (error) {
        console.error("Erro ao editar título:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

export const deletarTitulo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID é obrigatório." });
        }

        const titulo = await Titulos.findByPk(id);
        if (!titulo) {
            return res.status(404).json({ error: "Título não encontrado." });
        }

        await titulo.destroy();
        res.status(200).json({ mensagem: "Título deletado com sucesso." });
    } catch (error) {
        console.error("Erro ao deletar título:", error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};