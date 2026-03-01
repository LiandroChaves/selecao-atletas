import { prisma } from '../config/database';
import { CreateJogadorDTO } from '../dtos/jogador.dto';
import path from 'path';
import fs from 'fs';

const UPLOAD_BASE = path.resolve(__dirname, '..', '..', 'uploads');

export class JogadorService {
    async create(data: CreateJogadorDTO, tempFile?: Express.Multer.File) {
        const jogador = await prisma.jogador.create({
            data: {
                nome: data.nome,
                nome_curto: data.nome_curto,
                apelido: data.apelido,
                data_nascimento: data.data_nascimento ? new Date(data.data_nascimento) : null,
                pe_dominante: data.pe_dominante,
                nivel_ambidestria_id: Number(data.nivel_ambidestria_id),
                posicao_id: Number(data.posicao_id),
                posicao_secundaria_id: data.posicao_secundaria_id ? Number(data.posicao_secundaria_id) : null,
                clube_atual_id: data.clube_atual_id ? Number(data.clube_atual_id) : null,
                altura: data.altura,
                peso: data.peso,
                pais_id: data.pais_id ? Number(data.pais_id) : null,
                estado_id: data.estado_id ? Number(data.estado_id) : null,
                cidade_id: data.cidade_id ? Number(data.cidade_id) : null,
                video: data.video || null,
                observacoes: data.observacoes || null,
            }
        });

        if (tempFile) {
            const folderName = `jogador_${jogador.id}`;
            const targetDir = path.join(UPLOAD_BASE, folderName);
            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

            const finalPath = path.join(targetDir, tempFile.filename);
            if (tempFile.path !== finalPath && fs.existsSync(tempFile.path)) {
                fs.renameSync(tempFile.path, finalPath);
            }

            return await prisma.jogador.update({
                where: { id: jogador.id },
                data: { foto: `${folderName}/${tempFile.filename}` }
            });
        }

        return jogador;
    }

    async update(id: number, data: Partial<CreateJogadorDTO>, newFile?: Express.Multer.File) {
        const existing = await prisma.jogador.findUnique({ where: { id } });
        if (!existing) throw new Error('Jogador não encontrado');

        const updateData: any = {
            ...data,
            data_nascimento: data.data_nascimento ? new Date(data.data_nascimento) : existing.data_nascimento,
            video: data.video !== undefined ? (data.video || null) : existing.video,
            observacoes: data.observacoes !== undefined ? (data.observacoes || null) : existing.observacoes,
        };

        if (data.nivel_ambidestria_id) updateData.nivel_ambidestria_id = Number(data.nivel_ambidestria_id);
        if (data.posicao_id) updateData.posicao_id = Number(data.posicao_id);
        if (data.posicao_secundaria_id !== undefined) updateData.posicao_secundaria_id = data.posicao_secundaria_id ? Number(data.posicao_secundaria_id) : null;
        if (data.clube_atual_id !== undefined) updateData.clube_atual_id = data.clube_atual_id ? Number(data.clube_atual_id) : null;
        if (data.pais_id !== undefined) updateData.pais_id = data.pais_id ? Number(data.pais_id) : null;
        if (data.estado_id !== undefined) updateData.estado_id = data.estado_id ? Number(data.estado_id) : null;
        if (data.cidade_id !== undefined) updateData.cidade_id = data.cidade_id ? Number(data.cidade_id) : null;

        if (newFile) {
            if (existing.foto) {
                const oldPath = path.join(UPLOAD_BASE, existing.foto);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            const folderName = `jogador_${id}`;
            const targetDir = path.join(UPLOAD_BASE, folderName);
            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
            const finalPath = path.join(targetDir, newFile.filename);
            if (newFile.path !== finalPath && fs.existsSync(newFile.path)) fs.renameSync(newFile.path, finalPath);
            updateData.foto = `${folderName}/${newFile.filename}`;
        }

        return await prisma.jogador.update({
            where: { id },
            data: updateData
        });
    }

    async delete(id: number) {
        const existing = await prisma.jogador.findUnique({ where: { id } });
        if (!existing) throw new Error('Jogador não encontrado');
        await prisma.jogador.delete({ where: { id } });
        const folderPath = path.join(UPLOAD_BASE, `jogador_${id}`);
        if (fs.existsSync(folderPath)) fs.rmSync(folderPath, { recursive: true, force: true });
    }

    async findAll() {
        return await prisma.jogador.findMany({
            include: { posicao_principal: true, clube_atual: true, pais: { include: { bandeira: true } } }
        });
    }

    async findById(id: number) {
        return await prisma.jogador.findUnique({
            where: { id },
            include: {
                nivel_ambidestria: true,
                posicao_principal: true,
                posicao_secundaria: true,
                clube_atual: {
                    include: { logos: true }
                },
                pais: {
                    include: { bandeira: true }
                },
                estado: true,
                cidade: true,
                caracteristicas: true,
                estatisticas_gerais: true,
                lesoes: true,
                historico_clubes: {
                    include: {
                        clube: {
                            include: {
                                logos: true,
                                pais: { include: { bandeira: true } }
                            }
                        }
                    }
                },
                titulos: {
                    include: {
                        titulo: true,
                        clube: {
                            include: {
                                logos: true,
                                pais: { include: { bandeira: true } }
                            }
                        }
                    }
                }
            }
        });
    }
}