// controllers/EstatisticasPartidasController.js

import EstatisticasPartidas from "../database/models/EstatisticasPartidas.js";
import Jogador from "../database/models/Jogadores.js";
import Partidas from "../database/models/Partidas.js";
import { Op } from "sequelize";

export const buscarEstatisticasPartidas = async (req, res) => {
    try {
        const { search } = req.query;

        const includeJogador = {
            model: Jogador,
            as: "jogador",
            attributes: ["id", "nome", "apelido"],
        };

        if (search) {
            // Se for número, filtra pelo ID, senão filtra pelo NOME ou APELIDO
            if (!isNaN(Number(search))) {
                includeJogador.where = {
                    id: Number(search),
                };
            } else {
                includeJogador.where = {
                    [Op.or]: [
                        { nome: { [Op.iLike]: `%${search}%` } },  // busca no nome
                        { apelido: { [Op.iLike]: `%${search}%` } } // busca também no apelido
                    ]
                };
            }
        }

        const estatisticas = await EstatisticasPartidas.findAll({
            include: [
                includeJogador,
                {
                    model: Partidas,
                    as: "partida",
                    attributes: ["id", "data", "estadio"],
                },
            ],
            order: [["id", "ASC"]],
        });

        res.status(200).json(estatisticas);
    } catch (error) {
        console.error("Erro ao buscar estatísticas de partidas:", error);
        res.status(500).json({ error: "Erro interno ao buscar estatísticas." });
    }
};

export const inserirEstatisticaPartida = async (req, res) => {
    try {
        const {
            jogador_id,
            partida_id,
            minutos_jogados,
            gols,
            assistencias,
            passes_certos,
            finalizacoes,
            finalizacoes_no_alvo,
            desarmes,
            faltas_cometidas,
            cartoes_amarelos,
            cartoes_vermelhos,
        } = req.body;

        const novaEstatistica = await EstatisticasPartidas.create({
            jogador_id,
            partida_id,
            minutos_jogados,
            gols,
            assistencias,
            passes_certos,
            finalizacoes,
            finalizacoes_no_alvo,
            desarmes,
            faltas_cometidas,
            cartoes_amarelos,
            cartoes_vermelhos,
        });

        res.status(201).json({ estatistica: novaEstatistica });
    } catch (error) {
        console.error("Erro ao inserir estatística da partida:", error);
        res.status(500).json({ error: "Erro interno ao inserir estatística." });
    }
};

export const editarEstatisticaPartida = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID da URL:", id);
        const {
            jogador_id,
            partida_id,
            minutos_jogados,
            gols,
            assistencias,
            passes_certos,
            finalizacoes,
            finalizacoes_no_alvo,
            desarmes,
            faltas_cometidas,
            cartoes_amarelos,
            cartoes_vermelhos,
        } = req.body;

        if (
            !id ||
            !jogador_id ||
            !partida_id ||
            minutos_jogados === undefined ||
            gols === undefined ||
            assistencias === undefined ||
            passes_certos === undefined ||
            finalizacoes === undefined ||
            desarmes === undefined ||
            finalizacoes_no_alvo === undefined ||
            faltas_cometidas === undefined ||
            cartoes_amarelos === undefined ||
            cartoes_vermelhos === undefined
        ) {
            return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
        }

        const estatistica = await EstatisticasPartidas.findByPk(id);
        if (!estatistica) {
            return res.status(404).json({ error: "Estatística não encontrada" });
        }
        await estatistica.update({
            jogador_id,
            partida_id,
            minutos_jogados,
            gols,
            assistencias,
            passes_certos,
            finalizacoes,
            finalizacoes_no_alvo,
            desarmes,
            faltas_cometidas,
            cartoes_amarelos,
            cartoes_vermelhos,
        });

        res.status(200).json({ mensagem: "Estatística atualizada com sucesso", estatistica });
    } catch (error) {
        console.error("Erro ao editar estatística da partida:", error);
        res.status(500).json({ error: "Erro interno ao editar estatística." });
    }
};

export const deletarEstatisticaPartida = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID é obrigatório" });
        }

        const estatistica = await EstatisticasPartidas.findByPk(id);
        if (!estatistica) {
            return res.status(404).json({ error: "Estatística não encontrada" });
        }

        await estatistica.destroy();
        res.status(200).json({ mensagem: "Estatística deletada com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar estatística:", error);
        res.status(500).json({ error: "Erro interno ao deletar estatística." });
    }
};
