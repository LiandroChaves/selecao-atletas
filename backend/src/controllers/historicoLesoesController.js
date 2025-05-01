import HistoricoLesoes from "../database/models/HistoricoLesoes.js";
import Jogador from "../database/models/Jogadores.js";
import { Op } from "sequelize";

export const pegarLesoes = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            // Se for número, busca pelo ID da lesão
            if (!isNaN(Number(search))) {
                where = {
                    id: Number(search), // Busca pela ID da lesão
                };
            } else {
                // Se for texto, busca pelo nome do jogador ou tipo de lesão
                where = {
                    [Op.or]: [
                        {
                            "$jogador.nome$": { [Op.iLike]: `%${search}%` }, // Busca pelo nome do jogador
                        },
                        {
                            tipo_lesao: { [Op.iLike]: `%${search}%` }, // Já está buscando pela lesão também
                        },
                    ],
                };
            }
        }

        const lesoes = await HistoricoLesoes.findAll({
            where: where,
            include: [
                { model: Jogador, as: "jogador", attributes: ["id", "nome", "apelido"] },
            ],
            order: [["data_inicio", "ASC"]],
        });

        res.status(200).json(lesoes);
        console.log(`Lesão pesquisada: ${search}`);
    } catch (error) {
        console.error("Erro ao buscar lesões:", error);
        res.status(500).json({ error: "Erro interno ao buscar lesões." });
    }
};


export const inserirLesao = async (req, res) => {
    try {
        const { jogador_id, tipo_lesao, data_inicio, data_retorno, descricao } = req.body;

        if (!jogador_id || !tipo_lesao || !data_inicio) {
            return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
        }

        const novaLesao = await HistoricoLesoes.create({
            jogador_id,
            tipo_lesao,
            data_inicio,
            data_retorno: data_retorno ? data_retorno : null,
            descricao: descricao || null,
        });

        res.status(201).json({ mensagem: "Lesão cadastrada com sucesso", lesao: novaLesao });
    } catch (error) {
        console.error("Erro ao cadastrar lesão:", error);
        res.status(500).json({ error: "Erro interno ao cadastrar lesão." });
    }
};

export const editarLesao = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID da lesão para editar:", id);
        const { jogador_id, tipo_lesao, data_inicio, data_retorno, descricao } = req.body;

        const lesao = await HistoricoLesoes.findByPk(id);
        if (!lesao) {
            return res.status(404).json({ error: "Lesão não encontrada" });
        }

        await lesao.update({
            jogador_id,
            tipo_lesao,
            data_inicio,
            data_retorno: data_retorno || null,
            descricao: descricao || null,
        });

        res.status(200).json({ mensagem: "Lesão atualizada com sucesso", lesao });
    } catch (error) {
        console.error("Erro ao editar lesão:", error);
        res.status(500).json({ error: "Erro interno ao editar lesão." });
    }
};

export const deletarLesao = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID é obrigatório" });
        }

        const lesao = await HistoricoLesoes.findByPk(id);
        if (!lesao) {
            return res.status(404).json({ error: "Lesão não encontrada" });
        }

        await lesao.destroy();
        res.status(200).json({ mensagem: "Lesão deletada com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar lesão:", error);
        res.status(500).json({ error: "Erro interno ao deletar lesão." });
    }
};
