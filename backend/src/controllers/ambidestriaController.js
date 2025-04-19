import NivelAmbidestria from "../database/models/Ambidestria.js";
import { Op } from "sequelize";

// 🔍 Buscar todos os níveis
export const pegarNiveis = async (req, res) => {
    try {
        const { descricao } = req.query;
        let where = {};

        if (descricao) {
            where = {
                descricao: {
                    [Op.iLike]: `%${descricao}%`, // busca insensível a maiúsculas/minúsculas
                },
            };
        }

        const niveis = await NivelAmbidestria.findAll({
            where,
            order: [["id", "ASC"]],
        });

        res.json(niveis);
    } catch (error) {
        console.error("❌ Erro ao buscar níveis:", error);
        res.status(500).json({ error: "Erro ao buscar níveis." });
    }
};

export const pegarNiveisPraPesquisa = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            where = {
                descricao: {
                    [Op.iLike]: `%${search}%`, // busca insensível a maiúsculas/minúsculas
                },
            };
        }

        const niveis = await NivelAmbidestria.findAll({
            where,
            order: [["id", "ASC"]],
        });

        res.json(niveis);
    } catch (error) {
        console.error("❌ Erro ao buscar níveis:", error);
        res.status(500).json({ error: "Erro ao buscar níveis." });
    }
};

// ➕ Inserir novo nível
export const inserirNivel = async (req, res) => {
    try {
        const { descricao } = req.body;

        if (!descricao || !descricao.trim()) {
            return res.status(400).json({ error: "Descrição é obrigatória." });
        }

        const novoNivel = await NivelAmbidestria.create({
            descricao: descricao.trim(),
        });

        res.status(201).json({ nivel: novoNivel });
    } catch (error) {
        console.error("❌ Erro ao inserir nível:", error);
        res.status(500).json({ error: "Erro ao inserir nível." });
    }
};

export const editarNivel = async (req, res) => {
    try {
        const { id } = req.params;
        const { descricao } = req.body;

        if (!id) return res.status(400).json({ error: "ID do nível é obrigatório." });

        const nivel = await NivelAmbidestria.findByPk(id);
        if (!nivel) return res.status(404).json({ error: "Nível não encontrado." });

        // Validações
        if (!descricao || !descricao.trim()) {
            return res.status(400).json({ error: "Descrição é obrigatória." });
        }

        // Lista de palavras que geralmente ficam minúsculas no meio da frase
        const palavrasMinusculas = ["de", "do", "da", "dos", "das", "em", "com", "sem", "e", "a", "o", "as", "os"];

        const descricaoFormatada = descricao
            .toLowerCase()
            .split(" ")
            .map((palavra, index) => {
                if (index === 0 || !palavrasMinusculas.includes(palavra)) {
                    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
                } else {
                    return palavra;
                }
            })
            .join(" ");

        // Atualiza o nível no banco de dados
        await nivel.update({ descricao: descricaoFormatada });

        res.json({ nivel });
    } catch (error) {
        console.error("❌ Erro ao editar nível:", error);
        res.status(500).json({ error: "Erro ao editar nível." });
    }
}


export const pegarAmbidestriaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).json({ error: "ID do nível é obrigatório." });

        const nivel = await NivelAmbidestria.findByPk(id);
        if (!nivel) return res.status(404).json({ error: "Nível não encontrado." });

        res.json(nivel);
    } catch (error) {
        console.error("❌ Erro ao buscar nível:", error);
        res.status(500).json({ error: "Erro ao buscar nível." });
    }
}

export const deletarAmbidestria = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).json({ error: "ID do nível é obrigatório." });

        const nivel = await NivelAmbidestria.findByPk(id);
        if (!nivel) return res.status(404).json({ error: "Nível não encontrado." });

        await nivel.destroy();

        res.json({ mensagem: "Nível deletado com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao deletar nível:", error);
        res.status(500).json({ error: "Erro ao deletar nível." });
    }
}