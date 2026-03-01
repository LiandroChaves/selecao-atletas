import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response) {
        const { email, senha } = req.body;
        const result = await authService.login({ email, senha });
        return res.json(result);
    }
}