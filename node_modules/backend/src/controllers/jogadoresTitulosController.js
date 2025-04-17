import JogadoresTitulos from "../database/models/JogadoresTitulos.js";
import Jogador from "../database/models/Jogadores.js";
import Titulos from "../database/models/Titulos.js";
import Clubes from "../database/models/Clubes.js";

export const inserirJogadorTitulo = async (req, res) => {
    try {
        const { jogador_id, titulo_id, ano, clube_id } = req.body;

        if (!jogador_id || !titulo_id || !ano || !clube_id) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        const novoTitulo = await JogadoresTitulos.create({
            jogador_id,
            titulo_id,
            ano,
            clube_id,
        });

        res.status(201).json(novoTitulo);
    } catch (error) {
        console.error("Erro ao inserir jogador título:", error);
        res.status(500).json({ error: "Erro ao inserir jogador título." });
    }
};

export const pegarJogadoresTitulos = async (req, res) => {
    try {
        const titulos = await JogadoresTitulos.findAll({
            include: [
                { model: Jogador, as: "jogador", attributes: ["id", "nome"] },
                { model: Titulos, as: "titulo", attributes: ["id", "nome", "tipo"] },
                { model: Clubes, as: "clube", attributes: ["id", "nome"] },
            ],
        });

        res.status(200).json(titulos);
    } catch (error) {
        console.error("Erro ao pegar jogadores títulos:", error);
        res.status(500).json({ error: "Erro ao buscar jogadores títulos." });
    }
};
