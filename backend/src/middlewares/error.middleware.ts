import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'Arquivo muito grande. O tamanho máximo permitido é 5MB.' });
        }
        return res.status(400).json({ error: `Erro no upload: ${error.message}` });
    }

    if (error.message && error.message.includes('Tipo de arquivo inválido')) {
        return res.status(415).json({ error: error.message });
    }

    const status = (error as { status?: number }).status || 500;
    return res.status(status).json({
        error: error.message || 'Erro interno no servidor'
    });
};