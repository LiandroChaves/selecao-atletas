import { prisma } from '../config/database';

export class TituloService {
    async createTitulo(nome: string, tipo: 'Nacional' | 'Internacional' | 'Individual') {
        return await prisma.titulo.create({
            data: { nome, tipo }
        });
    }

    async vincularJogador(data: { jogador_id: number, titulo_id: number, ano: number, clube_id: number }) {
        return await prisma.jogadorTitulo.create({ data });
    }

    async listAllTitulos() {
        return await prisma.titulo.findMany();
    }

    async updateTitulo(id: number, data: { nome?: string, tipo?: 'Nacional' | 'Internacional' | 'Individual' }) {
        return await prisma.titulo.update({
            where: { id },
            data
        });
    }

    async deleteTitulo(id: number) {
        return await prisma.titulo.delete({
            where: { id }
        });
    }
}