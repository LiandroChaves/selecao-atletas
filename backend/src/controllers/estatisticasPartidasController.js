// controllers/EstatisticasPartidasController.js

import EstatisticasPartidas from "../database/models/EstatisticasPartidas.js";
import Jogador from "../database/models/Jogadores.js";
import Partidas from "../database/models/Partidas.js";

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

export const pegarEstatisticasPartidas = async (_req, res) => {
    try {
        const estatisticas = await EstatisticasPartidas.findAll({
            include: [
                {
                    model: Jogador,
                    as: "jogador",
                    attributes: ["id", "nome", "apelido"],
                },
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
