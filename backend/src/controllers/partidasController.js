import Partidas from "../database/models/Partidas.js";
import Clubes from "../database/models/Clubes.js";

// 🔍 Buscar todas as partidas
export const pegarPartidas = async (req, res) => {
    try {
        const partidas = await Partidas.findAll({
            include: [
                { model: Clubes, as: "clubeCasa", attributes: ["nome"] },
                { model: Clubes, as: "clubeFora", attributes: ["nome"] }
            ],
            order: [["data", "DESC"]],
        });

        res.json(partidas);
    } catch (error) {
        console.error("Erro ao buscar partidas:", error.message);
        res.status(500).json({ error: "Erro ao buscar partidas" });
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

