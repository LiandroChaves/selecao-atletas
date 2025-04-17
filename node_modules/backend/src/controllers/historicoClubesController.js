import HistoricoClubes from "../database/models/HistoricoClubes.js";
import Jogador from "../database/models/Jogadores.js";
import Clubes from "../database/models/Clubes.js";

export const pegarHistorico = async (req, res) => {
    try {
        const historico = await HistoricoClubes.findAll({
            include: [
                { model: Jogador, as: "jogador", attributes: ["id", "nome", "apelido"] },
                { model: Clubes, as: "clube", attributes: ["id", "nome"] }
            ],
            order: [["data_entrada", "DESC"]]
        });

        res.json(historico);
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        res.status(500).json({ error: "Erro ao buscar histórico" });
    }
};

export const inserirHistorico = async (req, res) => {
    try {
        const { jogador_id, clube_id, data_entrada, data_saida } = req.body;

        const novo = await HistoricoClubes.create({
            jogador_id,
            clube_id,
            data_entrada,
            data_saida,
        });

        res.status(201).json({ mensagem: "Histórico adicionado com sucesso", historico: novo });
    } catch (error) {
        console.error("Erro ao adicionar histórico:", error);
        res.status(500).json({ error: "Erro ao adicionar histórico" });
    }
};
