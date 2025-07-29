// File: backend/src/routes/uploadLogoClubes.js

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import LogosClubes from '../database/models/LogoClubes.js'; // Vamos criar esse model também!
import Clubes from '../database/models/Clubes.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pasta onde as logos serão salvas
const logosDir = path.join(__dirname, '..', 'assets', 'pdf');

console.log("Pasta de logos:", logosDir);

// Garante que a pasta existe
if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
}

// Configuração do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, logosDir);
    },
    filename: function (req, file, cb) {
        const tempName = `temp_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, tempName);
    }
});


const upload = multer({ storage });

// Rota para upload de logo
router.post('/inserirLogo', upload.single('url_logo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Nenhuma imagem foi enviada." });
        }

        const { clube_id } = req.body;
        const ext = path.extname(req.file.originalname);

        // Antes de salvar nova logo
        const logoAntiga = await LogosClubes.findOne({ where: { clube_id } });

        if (logoAntiga) {
            // Deleta imagem antiga do disco, se existir
            const logoAntigaPath = path.join(logosDir, logoAntiga.url_logo);
            if (fs.existsSync(logoAntigaPath)) {
                fs.unlinkSync(logoAntigaPath);
            }

            // Remove do banco
            await logoAntiga.destroy();
        }


        // Busca o nome do clube
        const clube = await Clubes.findByPk(clube_id);
        if (!clube) {
            // Deleta o arquivo temp, porque não tem clube válido
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ error: "Clube não encontrado." });
        }

        // Formata o nome
        const nomeFormatado = clube.nome
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '_')
            .replace(/[^\w\-]/g, '');

        const newFilename = `logo_${nomeFormatado}${ext}`;
        const newFilePath = path.join(logosDir, newFilename);

        // Renomeia o arquivo
        fs.renameSync(req.file.path, newFilePath);

        // Salva no banco
        const novaLogo = await LogosClubes.create({
            clube_id: Number(clube_id),
            url_logo: newFilename,
        });

        res.json({ ok: true, logo: novaLogo });
    } catch (error) {
        console.error("Erro ao inserir logo:", error);
        res.status(500).json({ error: "Erro ao inserir logo." });
    }
});

export default router;
