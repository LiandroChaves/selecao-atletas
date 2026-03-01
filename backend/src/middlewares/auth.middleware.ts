import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const secret = process.env.JWT_SECRET || 'chave-secreta-de-quebrada';
        const decoded = jwt.verify(token, secret);

        (req as any).user = decoded;

        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};