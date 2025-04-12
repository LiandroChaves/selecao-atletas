import Jogador from "../database/models/Jogadores.js";
import Paises from "../database/models/Pais.js";
import Estado from "../database/models/Estados.js";
import Cidade from "../database/models/Cidades.js";
import Posicao from "../database/models/Posicoes.js";
import Clubes from "../database/models/Clubes.js";
import NivelAmbidestria from "../database/models/Ambidestria.js";


export const criarJogador = async (req, res) => {
    try {
        const novoJogador = await Jogador.create(req.body);
        return res.status(201).json(novoJogador);
    } catch (error) {
        console.error("Erro ao criar jogador:", error);
        return res.status(500).json({ erro: "Erro ao criar jogador." });
    }
};


export const listarJogadores = async (req, res) => {
    try {
        const jogadores = await Jogador.findAll({
            include: [
                { model: Paises, as: "pais" },
                { model: Estado, as: "estado" },
                { model: Cidade, as: "cidade" },
                { model: Posicao, as: "posicao" },
                { model: Clubes, as: "clube" },
                { model: NivelAmbidestria, as: "nivel_ambidestria" },
            ],
            order: [["id", "ASC"]],
        });

        res.status(200).json(jogadores);
    } catch (error) {
        console.error("Erro ao listar jogadores:", error);
        res.status(500).json({ message: "Erro ao buscar jogadores" });
    }
};
