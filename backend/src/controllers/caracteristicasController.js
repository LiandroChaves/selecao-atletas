import Caracteristicas from "../database/models/Caracteristicas.js";
import { Op } from "sequelize";
import Jogador from "../database/models/Jogadores.js";

// ➕ Inserir descrição de jogador
export const inserirCaracteristicaJogador = async (req, res) => {
    try {
        const { jogador_id, descricao } = req.body;

        if (!jogador_id || !descricao) {
            return res.status(400).json({ error: "Jogador e descrição são obrigatórios." });
        }

        // Limpar descrição
        const descricaoFormatada = descricao.trim();

        // Inserir no banco
        const caracteristica = await Caracteristicas.create({
            jogador_id,
            descricao: descricaoFormatada,
        });

        return res.status(201).json({ caracteristica });
    } catch (error) {
        console.error("❌ Erro ao inserir descrição:", error);
        res.status(500).json({ error: "Erro interno ao inserir descrição." });
    }
};

// 🔍 Pegar todas as descrições
export const pegarCaracteristicasJogadores = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            where = {
                [Op.or]: [ // Usando Op.or para pesquisar por nome do jogador ou descrição
                    {
                        descricao: {
                            [Op.iLike]: `%${search}%`
                        }
                    },
                    {
                        '$jogador.nome$': { // Referência ao nome do jogador na tabela relacionada
                            [Op.iLike]: `%${search}%`
                        }
                    }
                ]
            };
        }

        const caracteristicas = await Caracteristicas.findAll({
            where,
            order: [["id", "ASC"]],
            include: {
                model: Jogador,
                as: 'jogador', // Relacionamento com o modelo Jogador
                attributes: ['nome'], // Incluir apenas o nome do jogador
            },
        });

        res.json(caracteristicas);
    } catch (error) {
        console.error("Erro ao buscar descrições:", error);
        res.status(500).json({ error: "Erro interno ao buscar descrições." });
    }
};


// 🔍 Pegar descrição por ID
export const pegarCaracteristicaJogadorPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const caracteristica = await Caracteristicas.findByPk(id);
        if (!caracteristica) return res.status(404).json({ error: "Descrição não encontrada." });

        res.json(caracteristica);
    } catch (error) {
        console.error("Erro ao buscar descrição por ID:", error);
        res.status(500).json({ error: "Erro interno" });
    }
};

// ✏️ Editar descrição
export const editarCaracteristicaJogador = async (req, res) => {
    try {
        const { id } = req.params;
        const { jogador_id, descricao } = req.body;

        if (!id) return res.status(400).json({ error: "ID da descrição é obrigatório." });

        const caracteristica = await Caracteristicas.findByPk(id);
        if (!caracteristica) return res.status(404).json({ error: "Descrição não encontrada." });

        await caracteristica.update({
            jogador_id,
            descricao: descricao.trim(),
        });

        return res.status(200).json({ caracteristica });
    } catch (error) {
        console.error("❌ Erro ao editar descrição:", error);
        res.status(500).json({ error: "Erro interno ao editar descrição." });
    }
};

// 🗑️ Deletar descrição
export const deletarCaracteristicaJogador = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ error: "ID da descrição é obrigatório." });

        const caracteristica = await Caracteristicas.findByPk(id);
        if (!caracteristica) return res.status(404).json({ error: "Descrição não encontrada." });

        await caracteristica.destroy();
        res.status(200).json({ mensagem: "Descrição deletada com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao deletar descrição:", error);
        res.status(500).json({ error: "Erro interno ao deletar descrição." });
    }
};
