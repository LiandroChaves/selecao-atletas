import { prisma } from '../config/database';

export class HistoricoService {
    async addCaracteristica(jogador_id: number, descricao: string) {
        return await prisma.caracteristica.create({
            data: { jogador_id, descricao }
        });
    }

    async addHistoricoClube(data: {
        jogador_id: number,
        clube_id: number,
        data_entrada: number,
        data_saida?: number,
        jogos?: number,
        categoria?: string
    }) {
        return await prisma.historicoClube.create({
            data: {
                ...data,
                categoria: data.categoria || 'Profissional'
            }
        });
    }

    async addLesao(data: {
        jogador_id: number,
        tipo_lesao: string,
        data_inicio: string,
        data_retorno?: string,
        descricao?: string
    }) {
        return await prisma.historicoLesao.create({
            data: {
                jogador_id: data.jogador_id,
                tipo_lesao: data.tipo_lesao,
                data_inicio: new Date(data.data_inicio),
                data_retorno: data.data_retorno ? new Date(data.data_retorno) : null,
                descricao: data.descricao
            }
        });
    }

    async updateCaracteristica(id: number, descricao: string) {
        return await prisma.caracteristica.update({
            where: { id },
            data: { descricao }
        });
    }

    async deleteCaracteristica(id: number) {
        return await prisma.caracteristica.delete({ where: { id } });
    }

    async updateHistoricoClube(id: number, data: any) {
        return await prisma.historicoClube.update({
            where: { id },
            data
        });
    }

    async deleteHistoricoClube(id: number) {
        return await prisma.historicoClube.delete({ where: { id } });
    }

    async updateLesao(id: number, data: any) {
        const updateData: any = { ...data };
        if (data.data_inicio) updateData.data_inicio = new Date(data.data_inicio);
        if (data.data_retorno) updateData.data_retorno = new Date(data.data_retorno);

        return await prisma.historicoLesao.update({
            where: { id },
            data: updateData
        });
    }

    async deleteLesao(id: number) {
        return await prisma.historicoLesao.delete({ where: { id } });
    }
}