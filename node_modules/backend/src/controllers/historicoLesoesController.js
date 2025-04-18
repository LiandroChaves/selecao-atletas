import HistoricoLesoes from "../database/models/HistoricoLesoes.js";
import Jogador from "../database/models/Jogadores.js";

export const pegarLesoes = async (req, res) => {
    try {
        const lesoes = await HistoricoLesoes.findAll({
            include: [
                { model: Jogador, as: "jogador", attributes: ["id", "nome", "apelido"] },
            ],
            order: [["data_inicio", "ASC"]],
            raw: true,
            nest: true,
        });

        res.json(lesoes);
    } catch (error) {
        console.error("Erro ao buscar lesões:", error.message);
        res.status(500).json({ error: "Erro ao buscar lesões" });
    }
};

export const inserirLesao = async (req, res) => {
    try {
        const { jogador_id, tipo_lesao, data_inicio, data_retorno, descricao } = req.body;

        const novaLesao = await HistoricoLesoes.create({
            jogador_id,
            tipo_lesao,
            data_inicio,
            data_retorno: data_retorno ? data_retorno : null,
            descricao
        });

        res.status(201).json({ mensagem: "Lesão cadastrada com sucesso", lesao: novaLesao });
    } catch (error) {
        console.error("Erro ao cadastrar lesão:", error.message);
        res.status(500).json({ error: "Erro ao cadastrar lesão" });
    }
};
