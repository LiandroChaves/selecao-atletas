import EstatisticaGeral from "../database/models/EstatisticasGerais.js";
import Jogador from "../database/models/Jogadores.js";

// 🔍 Buscar todas as estatísticas gerais
export const pegarEstatisticasGerais = async (req, res) => {
    try {
        const estatisticas = await EstatisticaGeral.findAll({
            include: [{
                model: Jogador,
                as: 'jogadores',
                attributes: ['nome']
            }]
        });

        res.json(estatisticas);  // Retorna as estatísticas como um array
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
