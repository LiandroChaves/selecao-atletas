// File: backend/src/controllers/clubesController.js

import Clubes from "../database/models/Clubes.js"
import Paises from "../database/models/Pais.js"
import { Op } from "sequelize"
import LogosClubes from "../database/models/LogoClubes.js"

export const inserirClube = async (req, res) => {
    try {
        const { nome, pais_id, fundacao, estadio, inicio_contrato, fim_contrato } = req.body;

        // Verifica se já existe um clube com esse nome e país
        const clubeExistente = await Clubes.findOne({
            where: {
                nome,
                pais_id
            }
        });

        if (clubeExistente) {
            return res.status(200).json({
                mensagem: "Clube já existente. Retornando dados existentes.",
                clube: clubeExistente
            });
        }

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
                nome: { [Op.iLike]: `%${search}%` },
            };
        }

        const clubes = await Clubes.findAll({
            include: [
                {
                    model: Paises,
                    as: "pais",
                    attributes: ["id", "nome"],
                },
                {
                    model: LogosClubes,
                    as: "logo",
                    attributes: ["id", "url_logo"], // pegando id tbm pra edição/filtro
                    required: false,
                },
            ],
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
            include: [
                {
                    model: Paises,
                    as: "pais",
                    attributes: ["id", "nome"],
                },
                {
                    model: LogosClubes,
                    as: "logo",
                    attributes: ["id", "url_logo"],
                    required: false,
                },
            ],
        });

        if (!clube) {
            return res.status(404).json({ error: "Clube não encontrado" });
        }

        const response = {
            id: clube.id,
            nome: clube.nome,
            pais_id: clube.pais_id,
            fundacao: clube.fundacao,
            estadio: clube.estadio,
            inicio_contrato: clube.inicio_contrato,
            fim_contrato: clube.fim_contrato,
            created_at: clube.created_at,
            updated_at: clube.updated_at,
            pais: clube.pais,
            logo: clube.logo,
        };

        res.json(response);
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
            include: [
                {
                    model: Paises,
                    as: "pais",
                    attributes: ["nome"],
                },
                {
                    model: LogosClubes,
                    as: "logo",
                    attributes: ["id", "url_logo"],
                    required: false,
                },
            ],
        });

        if (!clube) {
            return res.status(404).json({ error: "Clube não encontrado" });
        }

        res.status(200).json(clube);
    } catch (error) {
        console.error("Erro ao buscar clube:", error);
        res.status(500).json({ error: "Erro interno ao buscar clube." });
    }
};

export const pegarClubesComLogo = async (_req, res) => {
    try {
        const clubes = await Clubes.findAll({
            include: [
                {
                    model: LogosClubes,
                    as: "logo",
                    attributes: ["url_logo"],
                    required: true, // só clubes que têm logo
                },
                {
                    model: Paises,
                    as: "pais",
                    attributes: ["nome"],
                },
            ],
            order: [["id", "ASC"]],
        });

        res.status(200).json(clubes);
    } catch (error) {
        console.error("Erro ao buscar clubes com logo:", error);
        res.status(500).json({ error: "Erro interno ao buscar clubes com logo." });
    }
};
