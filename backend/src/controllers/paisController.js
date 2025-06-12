import Pais from "../database/models/Pais.js";
import { Op } from "sequelize";

// 🔍 Buscar todos os países

export const pegarPaises = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            where = {
                nome: {
                    [Op.iLike]: `%${search}%` // busca insensível a maiúsculas/minúsculas
                }
            };
        }

        const paises = await Pais.findAll({
            where,
            order: [["id", "ASC"]],
        });

        res.json(paises);
    } catch (error) {
        console.error("Erro ao buscar países:", error.message);
        res.status(500).json({ error: "Erro ao buscar países" });
    }
};


// ➕ Inserir novo país
export const inserirPaises = async (req, res) => {
    const { nome, bandeira_id } = req.body;

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ error: "O nome do país é obrigatório" });
    }

    try {
        const novoPais = await Pais.create({ nome, bandeira_id });
        res.status(201).json({
            mensagem: "País cadastrado com sucesso!",
            pais: novoPais,
            bandeira_id: bandeira_id || null
        });
    } catch (error) {
        console.error("Erro ao cadastrar país:", error);
        res.status(500).json({ error: "Erro ao cadastrar país" });
    }
};

export const editarPais = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, bandeira_id } = req.body;

        if (!id) {
            return res.status(400).json({ error: "ID do país é obrigatório" });
        }

        const pais = await Pais.findByPk(id);
        if (!pais) {
            return res.status(404).json({ error: "País não encontrado" });
        }

        // Atualiza somente os campos enviados
        if (nome && nome.trim() !== "") {
            pais.nome = nome.trim();
        }
        if (bandeira_id !== undefined) {
            pais.bandeira_id = bandeira_id;
        }

        await pais.save();

        res.status(200).json({
            mensagem: "País atualizado com sucesso!",
            pais
        });
    } catch (error) {
        console.error("Erro ao editar país:", error);
        res.status(500).json({ error: "Erro ao editar país" });
    }
};

export const pegarNome = async (req, res) => {
    const { id } = req.params;

    try {
        const pais = await Pais.findByPk(id);
        if (!pais) return res.status(404).json({ error: "País não encontrado" });
        res.json(pais);
    } catch (error) {
        console.error("Erro ao buscar país por ID:", error);
        res.status(500).json({ error: "Erro interno" });
    }
};

export const deletarPais = async (req, res) => {
    try {
        const { id } = req.params;

        const pais = await Pais.findByPk(id);
        if (!pais) {
            return res.status(404).json({ error: "País não encontrado" });
        }

        await pais.destroy();
        res.status(200).json({ mensagem: "País deletado com sucesso!" });
    } catch (error) {
        console.error("Erro ao deletar país:", error);
        res.status(500).json({ error: "Erro ao deletar país" });
    }
};
