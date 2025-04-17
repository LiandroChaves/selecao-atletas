import Estados from "../database/models/Estados.js";
import { Op } from "sequelize";

// ➕ Inserir estado
const palavrasMinusculas = ["de", "da", "do", "das", "dos", "e", "em", "na", "no"];

export const inserirEstado = async (req, res) => {
    try {
        let { nome, uf, pais_id } = req.body;

        if (!nome || !uf || !pais_id) {
            return res.status(400).json({ error: "Nome, UF e país são obrigatórios." });
        }

        // 🧹 Formatar o nome
        const nomeFormatado = nome
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

        // ✅ Validar UF: exatamente 2 letras maiúsculas
        uf = uf.trim().toUpperCase();
        if (!/^[A-Z]{2}$/.test(uf)) {
            return res.status(400).json({ error: "UF deve conter exatamente 2 letras maiúsculas." });
        }

        // Inserir no banco
        const estado = await Estados.create({
            nome: nomeFormatado,
            uf,
            pais_id,
        });

        return res.status(201).json({ estado });
    } catch (error) {
        console.error("❌ Erro ao inserir estado:", error);
        res.status(500).json({ error: "Erro interno ao inserir estado." });
    }
};

// 🔍 Pegar estados
export const pegarEstados = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            where = {
                nome: {
                    [Op.iLike]: `%${search}%`  // busca insensível a maiúsculas/minúsculas
                }
            };
        }

        const estados = await Estados.findAll({
            where,
            order: [["id", "ASC"]]
        });

        res.json(estados);
    } catch (error) {
        console.error("Erro ao buscar estados:", error);
        res.status(500).json({ error: "Erro interno ao buscar estados." });
    }
};



export const editarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        let { nome, uf, pais_id } = req.body;

        if (!id) return res.status(400).json({ error: "ID do estado é obrigatório." });

        const estado = await Estados.findByPk(id);
        if (!estado) return res.status(404).json({ error: "Estado não encontrado." });

        // Validações
        if (!nome || !uf || !pais_id) {
            return res.status(400).json({ error: "Nome, UF e país são obrigatórios." });
        }

        const nomeFormatado = nome
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

        uf = uf.trim().toUpperCase();
        if (!/^[A-Z]{2}$/.test(uf)) {
            return res.status(400).json({ error: "UF deve conter exatamente 2 letras maiúsculas." });
        }

        // Atualizar
        await estado.update({
            nome: nomeFormatado,
            uf,
            pais_id
        });

        return res.status(200).json({ estado });
    } catch (error) {
        console.error("❌ Erro ao editar estado:", error);
        res.status(500).json({ error: "Erro interno ao editar estado." });
    }
};
