import { prisma } from '../config/database';

export class ConfiguracaoService {
    async listPosicoes() {
        return await prisma.posicao.findMany();
    }

    async listNiveisAmbidestria() {
        return await prisma.nivelAmbidestria.findMany();
    }

    async createPosicao(nome: string) {
        return await prisma.posicao.create({ data: { nome } });
    }

    async createNivelAmbidestria(descricao: string) {
        return await prisma.nivelAmbidestria.create({ data: { descricao } });
    }

    async deletePosicao(id: number) {
        return await prisma.posicao.delete({ where: { id } });
    }

    async deleteNivelAmbidestria(id: number) {
        return await prisma.nivelAmbidestria.delete({ where: { id } });
    }

    async updatePosicao(id: number, nome: string) {
        return await prisma.posicao.update({ where: { id }, data: { nome } });
    }

    async updateNivelAmbidestria(id: number, descricao: string) {
        return await prisma.nivelAmbidestria.update({ where: { id }, data: { descricao } });
    }
}