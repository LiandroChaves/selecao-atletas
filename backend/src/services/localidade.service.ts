import { prisma } from '../config/database';
import { CreateBandeiraDTO, CreatePaisDTO, CreateEstadoDTO, CreateCidadeDTO } from '../dtos/localidade.dto';

export class LocalidadeService {
    async createBandeira(data: CreateBandeiraDTO) {
        return await prisma.bandeira.create({ data });
    }

    async createPais(data: CreatePaisDTO) {
        return await prisma.pais.create({ data });
    }

    async createEstado(data: CreateEstadoDTO) {
        return await prisma.estado.create({
            data: {
                nome: data.nome,
                uf: data.uf,
                pais_id: Number(data.pais_id)
            }
        });
    }

    async createCidade(data: CreateCidadeDTO) {
        return await prisma.cidade.create({
            data: {
                nome: data.nome,
                pais_id: data.pais_id ? Number(data.pais_id) : null,
                estado_id: data.estado_id ? Number(data.estado_id) : null
            }
        });
    }

    async findAllPaises() {
        return await prisma.pais.findMany({ include: { bandeira: true } });
    }

    async findEstadosByPais(pais_id: number) {
        return await prisma.estado.findMany({ where: { pais_id } });
    }

    async findCidadesByEstado(estado_id: number) {
        return await prisma.cidade.findMany({ where: { estado_id } });
    }

    async findAllEstados() {
        return await prisma.estado.findMany({ include: { pais: true } });
    }

    async updateEstado(id: number, data: Partial<CreateEstadoDTO>) {
        const updateData: any = { ...data };
        if (data.pais_id) updateData.pais_id = Number(data.pais_id);
        return await prisma.estado.update({ where: { id }, data: updateData });
    }

    async deleteEstado(id: number) {
        return await prisma.estado.delete({ where: { id } });
    }

    async findAllCidades() {
        return await prisma.cidade.findMany({ include: { estado: true, pais: true } });
    }

    async updateCidade(id: number, data: Partial<CreateCidadeDTO>) {
        const updateData: any = { ...data };
        if (data.pais_id) updateData.pais_id = Number(data.pais_id);
        if (data.estado_id) updateData.estado_id = Number(data.estado_id);
        return await prisma.cidade.update({ where: { id }, data: updateData });
    }

    async deleteCidade(id: number) {
        return await prisma.cidade.delete({ where: { id } });
    }

    async updatePais(id: number, data: Partial<CreatePaisDTO>) {
        return await prisma.pais.update({
            where: { id },
            data
        });
    }

    async deletePais(id: number) {
        return await prisma.pais.delete({ where: { id } });
    }
}