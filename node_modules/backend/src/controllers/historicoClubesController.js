import HistoricoClubes from "../database/models/HistoricoClubes.js";
import Jogador from "../database/models/Jogadores.js";
import Clubes from "../database/models/Clubes.js";
import { Op } from "sequelize";

export const pegarHistorico = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            // Se for número, busca por ID
            if (!isNaN(Number(search))) {
                where = {
                    id: Number(search),
                };
            } else {
                // Se for texto, busca pelo nome do jogador ou nome do clube
                where = {
                    [Op.or]: [
                        {
                            "$jogador.nome$": { [Op.iLike]: `%${search}%` }, // Busca pelo nome do jogador
                        },
                        {
                            "$clube.nome$": { [Op.iLike]: `%${search}%` }, // Busca pelo nome do clube
                        },
                    ],
                };
            }
        }

        const historico = await HistoricoClubes.findAll({
            where: where,
            include: [
                {
                    model: Jogador,
                    as: "jogador",
                    attributes: ["id", "nome", "apelido"],
                },
                {
                    model: Clubes,
                    as: "clube",
                    attributes: ["id", "nome"],
                },
            ],
            order: [["data_entrada", "DESC"]],
        });

        res.status(200).json(historico);
        console.log(`Pesquisa realizada: ${search}`);
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        res.status(500).json({ error: "Erro interno ao buscar histórico." });
    }
};

export const inserirHistorico = async (req, res) => {
    try {
        const { jogador_id, clube_id, data_entrada, data_saida } = req.body;

        const novo = await HistoricoClubes.create({
            jogador_id,
            clube_id,
            data_entrada,
            data_saida: data_saida || null,
        });

        res.status(201).json({ mensagem: "Histórico adicionado com sucesso", historico: novo });
    } catch (error) {
        console.error("Erro ao adicionar histórico:", error);
        res.status(500).json({ error: "Erro ao adicionar histórico" });
    }
};

export const editarHistorico = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID da URL:", id);
        const { jogador_id, clube_id, data_entrada, data_saida } = req.body;

        const historico = await HistoricoClubes.findByPk(id);
        if (!historico) {
            return res.status(404).json({ error: "Histórico não encontrado" });
        }

        await historico.update({
            jogador_id,
            clube_id,
            data_entrada,
            data_saida: data_saida || null,
        });

        res.status(200).json({ mensagem: "Histórico atualizado com sucesso", historico });
    } catch (error) {
        console.error("Erro ao editar histórico:", error);
        res.status(500).json({ error: "Erro interno ao editar histórico" });
    }
};

export const deletarHistorico = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID é obrigatório" });
        }

        const historico = await HistoricoClubes.findByPk(id);
        if (!historico) {
            return res.status(404).json({ error: "Histórico não encontrado" });
        }

        await historico.destroy();
        res.status(200).json({ mensagem: "Histórico deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar histórico:", error);
        res.status(500).json({ error: "Erro interno ao deletar histórico" });
    }
};
