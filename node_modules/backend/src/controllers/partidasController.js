import Partidas from "../database/models/Partidas.js";
import Clubes from "../database/models/Clubes.js";
import dayjs from "dayjs"; // instale se ainda não tiver: npm install dayjs
import EstatisticasPartidas from "../database/models/EstatisticasPartidas.js";
import Jogador from "../database/models/Jogadores.js";
import { Op } from "sequelize";

// 🔍 Buscar todas as partidas
export const pegarPartidas = async (req, res) => {
    try {
        const { id, search } = req.query;
        let where = {};

        // Usa `search` OU `id` como parâmetro para buscar por ID da partida
        const idBusca = Number(search || id); // tenta converter qualquer um dos dois

        if (!isNaN(idBusca)) {
            where = { id: idBusca };
        }

        const partidas = await Partidas.findAll({
            include: [
                { model: Clubes, as: "clubeCasa", attributes: ["nome"] },
                { model: Clubes, as: "clubeFora", attributes: ["nome"] }
            ],
            where,
            order: [["data", "ASC"]],
            raw: true,
            nest: true,
        });

        const partidasFormatadas = partidas.map(p => ({
            ...p,
            data: dayjs(p.data).format("YYYY-MM-DD")
        }));

        res.json(partidasFormatadas);
    } catch (error) {
        console.error("Erro ao buscar partidas:", error.message);
        res.status(500).json({ error: "Erro ao buscar partidas" });
    }
};

export const buscarEstatisticasPorPartida = async (req, res) => {
    try {
        const { partida_id } = req.params;

        if (!partida_id || isNaN(Number(partida_id))) {
            return res.status(400).json({ error: "partida_id inválido." });
        }

        const estatisticas = await EstatisticasPartidas.findAll({
            where: {
                partida_id: Number(partida_id),
            },
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
        console.error("Erro ao buscar estatísticas da partida:", error);
        res.status(500).json({ error: "Erro interno ao buscar estatísticas da partida." });
    }
};

// ➕ Inserir nova partida
export const inserirPartida = async (req, res) => {
    try {
        const {
            data,
            campeonato,
            estadio,
            clube_casa_id,
            clube_fora_id,
            gols_casa,
            gols_fora
        } = req.body;

        const novaPartida = await Partidas.create({
            data,
            campeonato,
            estadio,
            clube_casa_id,
            clube_fora_id,
            gols_casa: gols_casa ?? 0,
            gols_fora: gols_fora ?? 0
        });

        res.status(201).json({ mensagem: "Partida cadastrada com sucesso", partida: novaPartida });
    } catch (error) {
        console.error("❌ Erro ao cadastrar partida:", error); // ESSA LINHA É A MAIS IMPORTANTE
        res.status(500).json({ error: "Erro ao cadastrar partida", details: error.message });
    }
};

export const deletarPartida = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID da partida é obrigatório" });
        }

        const partida = await Partidas.findByPk(id);

        if (!partida) {
            return res.status(404).json({ error: "Partida não encontrada" });
        }

        await partida.destroy();

        res.status(200).json({ mensagem: "Partida deletada com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar partida:", error);
        res.status(500).json({ error: "Erro interno ao deletar partida." });
    }
};

export const editarPartida = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            data,
            campeonato,
            estadio,
            clube_casa_id,
            clube_fora_id,
            gols_casa,
            gols_fora
        } = req.body;

        // Verifica se todos os campos obrigatórios estão presentes
        if (
            !id ||
            !data ||
            clube_casa_id === undefined ||
            clube_fora_id === undefined ||
            gols_casa === undefined ||
            gols_fora === undefined
        ) {
            return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
        }

        const partida = await Partidas.findByPk(id);

        if (!partida) {
            return res.status(404).json({ error: "Partida não encontrada" });
        }

        await partida.update({
            data,
            campeonato,
            estadio,
            clube_casa_id,
            clube_fora_id,
            gols_casa,
            gols_fora
        });

        res.status(200).json({ mensagem: "Partida atualizada com sucesso", partida });
    } catch (error) {
        console.error("Erro ao editar partida:", error);
        res.status(500).json({ error: "Erro interno ao editar partida." });
    }
};


