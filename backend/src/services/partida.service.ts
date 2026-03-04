import { prisma } from '../config/database';
import { CreatePartidaDTO, CreateEstatisticaPartidaDTO } from '../dtos/performance.dto';

export class PartidaService {
    async createPartida(data: CreatePartidaDTO) {
        return await prisma.partida.create({
            data: { ...data, data: new Date(data.data) }
        });
    }

    async findAllPartidas() {
        return await prisma.partida.findMany({
            include: {
                clube_casa: {
                    include: { logos: true }
                },
                clube_fora: {
                    include: { logos: true }
                }
            },
            orderBy: { data: 'desc' }
        });
    }

    async addEstatistica(data: CreateEstatisticaPartidaDTO) {
        const estatistica = await prisma.estatisticaPartida.create({ data });
        await this.updateEstatisticasGerais(data.jogador_id);
        return estatistica;
    }

    private async updateEstatisticasGerais(jogador_id: number) {
        const stats = await prisma.estatisticaPartida.aggregate({
            where: { jogador_id },
            _count: { id: true },
            _sum: {
                gols: true,
                assistencias: true,
                cartoes_amarelos: true,
                cartoes_vermelhos: true,
                faltas_cometidas: true
            }
        });

        const geralStat = await prisma.estatisticaGeral.findFirst({
            where: { jogador_id, temporada: "Geral" }
        });

        const newStats = {
            partidas_jogadas: stats._count.id,
            gols: stats._sum.gols || 0,
            assistencias: stats._sum.assistencias || 0,
            cartoes_amarelos: stats._sum.cartoes_amarelos || 0,
            cartoes_vermelhos: stats._sum.cartoes_vermelhos || 0,
            faltas_cometidas: stats._sum.faltas_cometidas || 0,
        };

        if (geralStat) {
            await prisma.estatisticaGeral.update({
                where: { id: geralStat.id },
                data: newStats
            });
        } else {
            await prisma.estatisticaGeral.create({
                data: {
                    jogador_id,
                    temporada: "Geral",
                    ...newStats
                }
            });
        }
    }

    async findPartidaById(id: number) {
        return await prisma.partida.findUnique({
            where: { id },
            include: {
                clube_casa: {
                    include: { logos: true }
                },
                clube_fora: {
                    include: { logos: true }
                },
                estatisticas: { include: { jogador: true } }
            }
        });
    }

    async updatePartida(id: number, data: Partial<CreatePartidaDTO>) {
        const updateData: any = { ...data };
        if (data.data) updateData.data = new Date(data.data);
        return await prisma.partida.update({
            where: { id },
            data: updateData
        });
    }

    async deletePartida(id: number) {
        return await prisma.partida.delete({ where: { id } });
    }

    async updateEstatistica(id: number, data: Partial<CreateEstatisticaPartidaDTO>) {
        const estatistica = await prisma.estatisticaPartida.update({
            where: { id },
            data
        });
        await this.updateEstatisticasGerais(estatistica.jogador_id);
        return estatistica;
    }

    async deleteEstatistica(id: number) {
        const estatistica = await prisma.estatisticaPartida.findUnique({ where: { id } });
        if (estatistica) {
            await prisma.estatisticaPartida.delete({ where: { id } });
            await this.updateEstatisticasGerais(estatistica.jogador_id);
        }
    }
}