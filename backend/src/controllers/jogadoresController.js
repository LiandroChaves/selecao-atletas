import Jogador from "../database/models/Jogadores.js";
import Paises from "../database/models/Pais.js";
import Estado from "../database/models/Estados.js";
import Cidade from "../database/models/Cidades.js";
import Posicao from "../database/models/Posicoes.js";
import Clubes from "../database/models/Clubes.js";
import NivelAmbidestria from "../database/models/Ambidestria.js";


export const criarJogador = async (req, res) => {
    try {
        // Trata os campos de data antes de criar o jogador
        const contrato_inicio = req.body.contrato_inicio === "data não informada" ? null : req.body.contrato_inicio;
        const contrato_fim = req.body.contrato_fim === "data não informada" ? null : req.body.contrato_fim;
        const posicao_secundaria_id = req.body.posicao_secundaria_id === "não informado" ? null : req.body.posicao_secundaria_id;

        const novoJogador = await Jogador.create({
            ...req.body,
            posicao_secundaria_id,
            contrato_inicio,
            contrato_fim,
        });

        return res.status(201).json(novoJogador);
    } catch (error) {
        console.error("Erro ao criar jogador:", error);
        return res.status(500).json({ erro: "Erro ao criar jogador." });
    }
};



export const listarJogadores = async (req, res) => {
    try {
        const jogadores = await Jogador.findAll({
            attributes: [
                "id",
                "nome",
                "apelido",
                "data_nascimento",
                "pais_id",
                "estado_id",
                "cidade_id",
                "altura",
                "peso",
                "pe_dominante",
                "nivel_ambidestria_id",
                "posicao_id",
                "posicao_secundaria_id",
                "clube_atual_id",
                "contrato_inicio",
                "contrato_fim",
                "foto", // 👈 garante que venha
                "nacionalidade"
            ],
            include: [
                { model: Paises, as: "pais" },
                { model: Estado, as: "estado" },
                { model: Cidade, as: "cidade" },
                { model: Posicao, as: "posicao" },
                { model: Clubes, as: "clube" },
                { model: NivelAmbidestria, as: "nivel_ambidestria" },
                { model: Posicao, as: 'posicao_secundaria' },
            ],
            order: [["id", "ASC"]],
        });
        res.status(200).json(jogadores);
    } catch (error) {
        console.error("Erro ao listar jogadores:", error);
        res.status(500).json({ message: "Erro ao buscar jogadores" });
    }
};
