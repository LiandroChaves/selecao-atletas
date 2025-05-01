import Clubes from "../database/models/Clubes.js";
import Paises from "../database/models/Pais.js";
import { Op } from "sequelize";

export const inserirClube = async (req, res) => {
    try {
        const { nome, pais_id, fundacao, estadio, inicio_contrato, fim_contrato } = req.body;

        const novoClube = await Clubes.create({
            nome,
            pais_id,
            fundacao,
            estadio,
            inicio_contrato,
            fim_contrato,
        });

        res.status(201).json({ clube: novoClube });
    } catch (error) {
        console.error("Erro ao inserir clube:", error);
        res.status(500).json({ error: "Erro interno ao inserir clube." });
    }
};


export const pegarClubes = async (_req, res) => {
    try {
        const { search } = _req.query;
        let where = {};

        if (search) {
            where = {
                nome: {
                    [Op.iLike]: `%${search}%`, // busca insensível a maiúsculas/minúsculas
                },
            };
        }

        const clubes = await Clubes.findAll({
            include: {
                model: Paises,
                as: "pais",
                attributes: ["nome"],
            },
            where,
            order: [["id", "ASC"]],
        });

        res.status(200).json(clubes);
    } catch (error) {
        console.error("Erro ao buscar clubes:", error);
        res.status(500).json({ error: "Erro interno ao buscar clubes." });
    }
};

export const pegarClube = async (req, res) => {
    try {
        const { id } = req.params;
        const clube = await Clubes.findByPk(id, {
            attributes: ["id", "nome"]
        });

        if (!clube) {
            return res.status(404).json({ error: "Clube não encontrado" });
        }

        res.json(clube);
    } catch (error) {
        console.error("Erro ao buscar clube:", error);
        res.status(500).json({ error: "Erro ao buscar clube", details: error.message });
    }
};

export const editarClube = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, pais_id, fundacao, estadio, inicio_contrato, fim_contrato } = req.body;

        const clube = await Clubes.findByPk(id);

        if (!clube) {
            return res.status(404).json({ error: "Clube não encontrado" });
        }

        await clube.update({
            nome,
            pais_id,
            fundacao,
            estadio,
            inicio_contrato,
            fim_contrato,
        });

        res.status(200).json({ mensagem: "Clube atualizado com sucesso", clube });
    } catch (error) {
        console.error("Erro ao editar clube:", error);
        res.status(500).json({ error: "Erro interno ao editar clube." });
    }
};

export const deletarClube = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID do clube é obrigatório" });
        }

        const clube = await Clubes.findByPk(id);

        if (!clube) {
            return res.status(404).json({ error: "Clube não encontrado" });
        }

        await clube.destroy();

        res.status(200).json({ mensagem: "Clube deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar clube:", error);
        res.status(500).json({ error: "Erro interno ao deletar clube." });
    }
}

export const pegarClubeAtualPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID do clube é obrigatório" });
        }

        const clube = await Clubes.findByPk(id, {
            include: {
                model: Paises,
                as: "pais",
                attributes: ["nome"],
            },
        });

        if (!clube) {
            return res.status(200).json({ error: "Clube não encontrado" });
        }

        res.status(200).json(clube);
    } catch (error) {
        console.error("Erro ao buscar clube:", error);
        res.status(500).json({ error: "Erro interno ao buscar clube." });
    }
}