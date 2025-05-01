import Jogador from "../database/models/Jogadores.js";
import Paises from "../database/models/Pais.js";
import Estado from "../database/models/Estados.js";
import Cidade from "../database/models/Cidades.js";
import Posicao from "../database/models/Posicoes.js";
import Clubes from "../database/models/Clubes.js";
import NivelAmbidestria from "../database/models/Ambidestria.js";
import { Op } from "sequelize";

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
        const { search } = req.query;

        let where = {};

        if (search) {
            const conditions = [
                { nome: { [Op.iLike]: `%${search}%` } },
                { apelido: { [Op.iLike]: `%${search}%` } },
            ];

            // Só adiciona a busca por ID se for um número
            if (!isNaN(search)) {
                conditions.push({ id: Number(search) });
            }

            where = { [Op.or]: conditions };
        }

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
                "foto",
            ],
            include: [
                { model: Paises, as: "pais" },
                { model: Estado, as: "estado" },
                { model: Cidade, as: "cidade" },
                { model: Posicao, as: "posicao" },
                { model: Clubes, as: "clube" },
                { model: NivelAmbidestria, as: "nivel_ambidestria" },
                { model: Posicao, as: "posicao_secundaria" },
            ],
            where,
            order: [["id", "ASC"]],
        });

        res.status(200).json(jogadores);
    } catch (error) {
        console.error("Erro ao listar jogadores:", error);
        res.status(500).json({ message: "Erro ao buscar jogadores" });
    }
};

export const editarJogador = async (req, res) => {
    try {
        const { id } = req.params;
        const jogador = await Jogador.findByPk(id);

        if (!jogador) {
            return res.status(404).json({ message: "Jogador não encontrado" });
        }
        // Atualiza os campos do jogador
        await jogador.update(req.body);

        return res.status(200).json(jogador);
    } catch (error) {
        console.error("Erro ao editar jogador:", error);
        return res.status(500).json({ erro: "Erro ao editar jogador." });
    }
}

export const deletarJogador = async (req, res) => {
    try {
        const { id } = req.params;
        const jogador = await Jogador.findByPk(id);

        if (!jogador) {
            return res.status(404).json({ message: "Jogador não encontrado" });
        }

        await jogador.destroy();

        return res.status(200).json({ message: "Jogador deletado com sucesso." });
    } catch (error) {
        console.error("Erro ao deletar jogador:", error);
        return res.status(500).json({ erro: "Erro ao deletar jogador." });
    }
};

export const pegarJogadorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const jogador = await Jogador.findByPk(id, {
            include: [
                { model: Paises, as: "pais" },
                { model: Estado, as: "estado" },
                { model: Cidade, as: "cidade" },
                { model: Posicao, as: "posicao" },
                { model: Clubes, as: "clube" },
                { model: NivelAmbidestria, as: "nivel_ambidestria" },
                { model: Posicao, as: "posicao_secundaria" },
            ],
        });

        if (!jogador) {
            return res.status(404).json({ message: "Jogador não encontrado" });
        }

        return res.status(200).json(jogador);
    } catch (error) {
        console.error("Erro ao buscar jogador:", error);
        return res.status(500).json({ erro: "Erro ao buscar jogador." });
    }
}
