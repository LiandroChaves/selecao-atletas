import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { LoginDTO } from '../dtos/auth.dto';

export class AuthService {
    async login({ email, senha }: LoginDTO) {
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });

        if (!usuario) {
            throw new Error('E-mail ou senha inválidos');
        }

        const senhaBatendo = await bcrypt.compare(senha, usuario.senha);

        if (!senhaBatendo) {
            throw new Error('E-mail ou senha inválidos');
        }

        const secret = process.env.JWT_SECRET || 'chave-secreta-de-quebrada';

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            secret,
            { expiresIn: '1d' }
        );

        return {
            usuario: {
                id: usuario.id,
                email: usuario.email
            },
            token
        };
    }
}