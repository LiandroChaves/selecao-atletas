import { prisma } from '../config/database';
import { CreateClubeDTO } from '../dtos/clube.dto';
import path from 'path';
import fs from 'fs';

const UPLOAD_BASE = path.resolve(__dirname, '..', '..', 'uploads');

export class ClubeService {
    async create(data: any, logo_filename?: string) {
        const clube = await prisma.clube.create({
            data: {
                nome: data.nome,
                pais_id: Number(data.pais_id),
                fundacao: data.fundacao ? Number(data.fundacao) : null,
                estadio: data.estadio,
                inicio_contrato: data.inicio_contrato ? new Date(data.inicio_contrato) : null,
                fim_contrato: data.fim_contrato ? new Date(data.fim_contrato) : null,
            }
        });

        if (logo_filename) {
            await prisma.logoClube.create({
                data: {
                    clube_id: clube.id,
                    url_logo: `clubes/${logo_filename}`
                }
            });
        }

        return this.findById(clube.id);
    }

    async update(id: number, data: any, logo_filename?: string) {
        const existing = await prisma.clube.findUnique({ where: { id }, include: { logos: true } });
        if (!existing) throw new Error('Clube não encontrado');

        await prisma.clube.update({
            where: { id },
            data: {
                nome: data.nome ?? existing.nome,
                pais_id: data.pais_id ? Number(data.pais_id) : existing.pais_id,
                fundacao: data.fundacao !== undefined ? (data.fundacao ? Number(data.fundacao) : null) : existing.fundacao,
                estadio: data.estadio !== undefined ? data.estadio : existing.estadio,
                inicio_contrato: data.inicio_contrato ? new Date(data.inicio_contrato) : existing.inicio_contrato,
                fim_contrato: data.fim_contrato ? new Date(data.fim_contrato) : existing.fim_contrato,
            }
        });

        if (logo_filename) {
            for (const logo of existing.logos) {
                const oldPath = path.join(UPLOAD_BASE, logo.url_logo);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                await prisma.logoClube.delete({ where: { id: logo.id } });
            }

            await prisma.logoClube.create({
                data: {
                    clube_id: id,
                    url_logo: `clubes/${logo_filename}`
                }
            });
        }

        return this.findById(id);
    }

    async delete(id: number) {
        const existing = await prisma.clube.findUnique({ where: { id }, include: { logos: true } });
        if (!existing) throw new Error('Clube não encontrado');

        // Remove logo files
        for (const logo of existing.logos) {
            const logoPath = path.join(UPLOAD_BASE, logo.url_logo);
            if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
        }

        await prisma.clube.delete({ where: { id } });
    }

    async findAll() {
        return await prisma.clube.findMany({
            include: {
                pais: {
                    include: {
                        bandeira: true
                    }
                },
                logos: true
            }
        });
    }

    async findById(id: number) {
        return await prisma.clube.findUnique({
            where: { id },
            include: {
                pais: {
                    include: {
                        bandeira: true
                    }
                },
                logos: true
            }
        });
    }
}