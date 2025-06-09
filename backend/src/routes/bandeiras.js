// File: backend/src/routes/bandeiras.js

import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
    inserirBandeira,
    pegarBandeiras,
    pegarBandeira,
    deletarBandeira,
    editarBandeira
} from "../controllers/bandeirasController.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bandeirasDir = path.join(__dirname, "..", "assets", "pdf");

// Garante que a pasta existe
if (!fs.existsSync(bandeirasDir)) {
    fs.mkdirSync(bandeirasDir, { recursive: true });
}

// Configuração do Multer
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, bandeirasDir);
    },
    filename: function (_req, file, cb) {
        const tempName = `temp_bandeira_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, tempName);
    }
});
const upload = multer({ storage });

// Rotas
router.post("/inserirBandeira", upload.single("logo_bandeira"), inserirBandeira);
router.get("/pegarBandeiras", pegarBandeiras);
router.get("/pegarBandeira/:id", pegarBandeira);
router.delete("/deletarBandeira/:id", deletarBandeira);
router.put("/editarBandeira/:id", upload.single("logo_bandeira"), editarBandeira);

export default router;
