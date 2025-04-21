import EstatisticaGeral from "../database/models/EstatisticasGerais.js";
import Jogador from "../database/models/Jogadores.js";
import { Op } from "sequelize";

// 🔍 Buscar todas as estatísticas gerais
export const pegarEstatisticasGerais = async (req, res) => {
    try {
        const { jogador_id } = req.query;
        let where = {};

        if (jogador_id) {
            where = {
                nome: {
                    [Op.iLike]: `%${jogador_id}%`, // busca insensível a maiúsculas/minúsculas
                },
            };
        }

        const estatisticas = await EstatisticaGeral.findAll({
            include: [{
                model: Jogador,
                as: 'jogadores',
                attributes: ['nome']
            }],
            where,
            order: [["jogador_id", "ASC"]],
        });

        res.status(200).json(estatisticas);  // Retorna as estatísticas como um array
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
};

// ➕ Inserir nova estatística geral
export const inserirEstatisticaGeral = async (req, res) => {
    try {
        const { jogador_id, partidas_jogadas, gols, assistencias, titulos, faltas_cometidas, cartoes_amarelos, cartoes_vermelhos } = req.body;

        // Verifica se a estatística para o jogador já existe
        const estatisticaExistente = await EstatisticaGeral.findOne({ where: { jogador_id } });

        if (estatisticaExistente) {
            // Se existir, atualiza
            estatisticaExistente.partidas_jogadas = partidas_jogadas;
            estatisticaExistente.gols = gols;
            estatisticaExistente.assistencias = assistencias;
            estatisticaExistente.titulos = titulos;
            estatisticaExistente.faltas_cometidas = faltas_cometidas;
            estatisticaExistente.cartoes_amarelos = cartoes_amarelos;
            estatisticaExistente.cartoes_vermelhos = cartoes_vermelhos;
            await estatisticaExistente.save();
            return res.status(200).json(estatisticaExistente);
        } else {
            // Se não existir, cria uma nova
            const novaEstatistica = await EstatisticaGeral.create({
                jogador_id,
                partidas_jogadas,
                gols,
                assistencias,
                titulos,
                faltas_cometidas,
                cartoes_amarelos,
                cartoes_vermelhos
            });
            return res.status(201).json(novaEstatistica);
        }
    } catch (error) {
        console.error("Erro ao cadastrar estatística:", error);
        res.status(500).json({ error: "Erro ao cadastrar estatística" });
    }
};

export const editarEstatisticaGeral = async (req, res) => {
    try {
        const { jogador_id } = req.params;
        const {
            partidas_jogadas,
            gols,
            assistencias,
            titulos,
            faltas_cometidas,
            cartoes_amarelos,
            cartoes_vermelhos
        } = req.body;

        // Verifica se algum campo está undefined ou null
        if (
            jogador_id === undefined ||
            partidas_jogadas === undefined ||
            gols === undefined ||
            assistencias === undefined ||
            titulos === undefined ||
            faltas_cometidas === undefined ||
            cartoes_amarelos === undefined ||
            cartoes_vermelhos === undefined
        ) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const estatistica = await EstatisticaGeral.findByPk(jogador_id);
        if (!estatistica) {
            return res.status(404).json({ error: "Estatística não encontrada" });
        }

        await estatistica.update({
            partidas_jogadas,
            gols,
            assistencias,
            titulos,
            faltas_cometidas,
            cartoes_amarelos,
            cartoes_vermelhos
        });

        res.status(200).json({ mensagem: "Estatística atualizada com sucesso", estatistica });
    } catch (error) {
        console.error("Erro ao editar estatística:", error);
        res.status(500).json({ error: "Erro interno ao editar estatística." });
    }
};


export const deletarEstatisticaGeral = async (req, res) => {
    try {
        const { jogador_id } = req.params;

        if (!jogador_id) {
            return res.status(400).json({ error: "ID da estatística é obrigatório" });
        }

        const estatistica = await EstatisticaGeral.findByPk(jogador_id);

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
