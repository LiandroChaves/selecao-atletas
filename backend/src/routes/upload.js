import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("\nDiretório atual:", __dirname);

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
console.log("Diretório de uploads:", uploadsDir);

const generateNextJogadorFolder = () => {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const folders = fs.readdirSync(uploadsDir).filter((f) =>
        fs.statSync(path.join(uploadsDir, f)).isDirectory() && f.startsWith("jogador_")
    );

    const numbers = folders
        .map((f) => parseInt(f.replace("jogador_", "")))
        .filter((n) => !isNaN(n));

    const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
    return `jogador_${nextNumber}`;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const jogadorDir = generateNextJogadorFolder();
        const fullPath = path.join(uploadsDir, jogadorDir);
        fs.mkdirSync(fullPath, { recursive: true });
        req.jogadorFolder = jogadorDir;
        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

router.post('/upload-foto', upload.single('foto'), (req, res) => {
    const filePath = `${req.jogadorFolder}/${req.file.originalname}`;
    res.json({
        ok: true,
        message: "Upload feito com sucesso!",
        path: filePath
    });
});

export default router;
