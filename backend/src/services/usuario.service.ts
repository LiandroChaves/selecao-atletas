import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { CreateUsuarioDTO } from '../dtos/usuario.dto';

export class UsuarioService {
    async create({ email, senha }: CreateUsuarioDTO) {
        const userExists = await prisma.usuario.findUnique({
            where: { email }
        });

        if (userExists) {
            throw new Error('Usuário já cadastrado com esse e-mail');
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const usuario = await prisma.usuario.create({
            data: {
                email,
                senha: hashedPassword
            },
            select: {
                id: true,
                email: true,
                created_at: true
            }
        });

        return usuario;
    }

    async findAll() {
        return await prisma.usuario.findMany({
            select: {
                id: true,
                email: true,
                created_at: true
            }
        });
    }
}