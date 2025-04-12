import Clubes from "../database/models/Clubes.js";
import Paises from "../database/models/Pais.js";

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
        const clubes = await Clubes.findAll({
            include: {
                model: Paises,
                as: "pais",
                attributes: ["nome"],
            },
            order: [["id", "ASC"]],
        });

        res.status(200).json(clubes);
    } catch (error) {
        console.error("Erro ao buscar clubes:", error);
        res.status(500).json({ error: "Erro interno ao buscar clubes." });
    }
};
