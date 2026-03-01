import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { Request } from 'express';

const UPLOAD_BASE = path.resolve(__dirname, '..', '..', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/jfif'];

function fileFilter(_req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Tipo de arquivo inválido. Apenas imagens (JPEG, PNG, WebP, GIF) são permitidas.'));
    }
}

function sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// --- Jogador upload: saves temporarily to uploads/temp, moved after player creation ---
const jogadorStorage = multer.diskStorage({
    destination: (req: Request, _file: Express.Multer.File, callback) => {
        const { id } = req.params;
        const folderName = id ? `jogador_${id}` : 'temp';
        const uploadPath = path.join(UPLOAD_BASE, folderName);

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        callback(null, uploadPath);
    },
    filename: (_req: Request, file: Express.Multer.File, callback) => {
        const hash = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext);
        callback(null, `${hash}-${sanitizeFilename(base)}${ext}`);
    }
});

// --- Clube upload: saves to uploads/clubes/ ---
const clubeStorage = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, callback) => {
        const uploadPath = path.join(UPLOAD_BASE, 'clubes');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
    },
    filename: (_req: Request, file: Express.Multer.File, callback) => {
        const hash = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext);
        callback(null, `${hash}-${sanitizeFilename(base)}${ext}`);
    }
});

// --- País upload: saves to uploads/paises/ ---
const paisStorage = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, callback) => {
        const uploadPath = path.join(UPLOAD_BASE, 'paises');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        callback(null, uploadPath);
    },
    filename: (_req: Request, file: Express.Multer.File, callback) => {
        const hash = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext);
        callback(null, `${hash}-${sanitizeFilename(base)}${ext}`);
    }
});

export const uploadJogador = multer({
    storage: jogadorStorage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});

export const uploadClube = multer({
    storage: clubeStorage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});

export const uploadPais = multer({
    storage: paisStorage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});

// Legacy export for backwards compatibility
export const upload = uploadJogador;