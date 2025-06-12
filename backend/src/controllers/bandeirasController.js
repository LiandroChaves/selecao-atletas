// File: backend/src/controllers/bandeirasController.js

import Bandeiras from "../database/models/Bandeiras.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Op } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bandeirasDir = path.join(__dirname, "..", "assets", "pdf");

export const inserirBandeira = async (req, res) => {
    try {
        const { nome } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Nenhuma imagem foi enviada." });
        }

        if (!nome || nome.trim() === "") {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "O nome da bandeira é obrigatório." });
        }

        const nomeTrimado = nome.trim();

        // Verifica se já existe uma bandeira com o mesmo nome (ignorando maiúsculas/minúsculas)
        const bandeiraExistente = await Bandeiras.findOne({
            where: { nome: { [Op.iLike]: nomeTrimado } },
        });

        const ext = path.extname(req.file.originalname);
        const novoNomeArquivo = `bandeira_${Date.now()}${ext}`;
        const destinoFinal = path.join(bandeirasDir, novoNomeArquivo);

        fs.renameSync(req.file.path, destinoFinal);

        if (bandeiraExistente) {
            // Deleta imagem antiga do disco
            const caminhoAntigo = path.join(bandeirasDir, bandeiraExistente.logo_bandeira);
            if (fs.existsSync(caminhoAntigo)) {
                fs.unlinkSync(caminhoAntigo);
            }

            // Atualiza a imagem da bandeira existente
            bandeiraExistente.logo_bandeira = novoNomeArquivo;
            await bandeiraExistente.save();

            return res.status(200).json({ mensagem: "Imagem da bandeira atualizada com sucesso", bandeira: bandeiraExistente });
        }

        // Caso não exista, cria nova bandeira
        const novaBandeira = await Bandeiras.create({
            nome: nomeTrimado,
            logo_bandeira: novoNomeArquivo,
        });

        res.status(201).json({ mensagem: "Bandeira criada com sucesso", bandeira: novaBandeira });
    } catch (error) {
        console.error("Erro ao inserir/editar bandeira:", error);
        res.status(500).json({ error: "Erro interno ao inserir ou editar bandeira." });
    }
};


export const pegarBandeiras = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};

        if (search) {
            if (!isNaN(Number(search))) {
                // Se for número, busca por ID ou por pais_id
                where = {
                    [Op.or]: [
                        { id: Number(search) },
                    ],
                };
            } else {
                // Se for texto, busca pelo nome da imagem, por exemplo
                where = {
                    nome: { [Op.iLike]: `%${search}%` }, // ajuste conforme o campo correto
                };
            }
        }

        const bandeiras = await Bandeiras.findAll({
            where,
            order: [["id", "ASC"]],
        });

        res.status(200).json(bandeiras);
        console.log(`Bandeira pesquisada: ${search}`);
    } catch (error) {
        console.error("Erro ao buscar bandeiras:", error);
        res.status(500).json({ error: "Erro interno ao buscar bandeiras." });
    }
};

export const pegarBandeira = async (req, res) => {
    try {
        const { id } = req.params;
        const bandeira = await Bandeiras.findByPk(id);

        if (!bandeira) {
            return res.status(404).json({ error: "Bandeira não encontrada." });
        }

        res.status(200).json(bandeira);
    } catch (error) {
        console.error("Erro ao buscar bandeira:", error);
        res.status(500).json({ error: "Erro ao buscar bandeira." });
    }
};

export const deletarBandeira = async (req, res) => {
    try {
        const { id } = req.params;

        const bandeira = await Bandeiras.findByPk(id);
        if (!bandeira) {
            return res.status(404).json({ error: "Bandeira não encontrada." });
        }

        const filePath = path.join(bandeirasDir, bandeira.logo_bandeira);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await bandeira.destroy();
        res.status(200).json({ mensagem: "Bandeira deletada com sucesso." });
    } catch (error) {
        console.error("Erro ao deletar bandeira:", error);
        res.status(500).json({ error: "Erro interno ao deletar bandeira." });
    }
};

export const editarBandeira = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;

        const bandeira = await Bandeiras.findByPk(id);

        if (!bandeira) {
            if (req.file) fs.unlinkSync(req.file.path); // descarta novo upload
            return res.status(404).json({ error: "Bandeira não encontrada." });
        }

        if (!nome || nome.trim() === "") {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "O nome da bandeira é obrigatório." });
        }

        if (req.file) {
            // Apaga imagem antiga
            const antigaPath = path.join(bandeirasDir, bandeira.logo_bandeira);
            if (fs.existsSync(antigaPath)) fs.unlinkSync(antigaPath);

            // Renomeia nova imagem
            const ext = path.extname(req.file.originalname);
            const novoNome = `bandeira_${Date.now()}${ext}`;
            const novoCaminho = path.join(bandeirasDir, novoNome);

            fs.renameSync(req.file.path, novoCaminho);

            bandeira.logo_bandeira = novoNome;
        }

        bandeira.nome = nome.trim();
        await bandeira.save();

        res.json({ mensagem: "Bandeira atualizada com sucesso", bandeira });
    } catch (error) {
        console.error("Erro ao editar bandeira:", error);
        res.status(500).json({ error: "Erro interno ao editar bandeira." });
    }
};