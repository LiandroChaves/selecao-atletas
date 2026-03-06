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
                whatsapp: data.whatsapp || null,
                instagram: data.instagram || null,
                twitter: data.twitter || null,
                facebook: data.facebook || null,
                tiktok: data.tiktok || null,
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

    async update(id: number, data: any, newFile?: Express.Multer.File) {
        const existing = await prisma.jogador.findUnique({ where: { id } });
        if (!existing) throw new Error('Jogador não encontrado');

        // Mapeando campo por campo para evitar lixo do frontend (como strings em lugar de numbers)
        const updateData: any = {
            nome: data.nome !== undefined ? data.nome : existing.nome,
            nome_curto: data.nome_curto !== undefined ? (data.nome_curto || null) : existing.nome_curto,
            apelido: data.apelido !== undefined ? (data.apelido || null) : existing.apelido,
            data_nascimento: data.data_nascimento ? new Date(data.data_nascimento) : existing.data_nascimento,
            pe_dominante: data.pe_dominante !== undefined ? data.pe_dominante : existing.pe_dominante,

            // FKs diretas (funciona normalmente sem Driver Adapter)
            nivel_ambidestria_id: data.nivel_ambidestria_id ? Number(data.nivel_ambidestria_id) : existing.nivel_ambidestria_id,
            posicao_id: data.posicao_id ? Number(data.posicao_id) : existing.posicao_id,
            posicao_secundaria_id: data.posicao_secundaria_id ? Number(data.posicao_secundaria_id) : existing.posicao_secundaria_id,
            clube_atual_id: data.clube_atual_id !== undefined ? (data.clube_atual_id ? Number(data.clube_atual_id) : null) : existing.clube_atual_id,
            altura: data.altura !== undefined ? data.altura : existing.altura,
            peso: data.peso !== undefined ? data.peso : existing.peso,
            pais_id: data.pais_id ? Number(data.pais_id) : existing.pais_id,
            estado_id: data.estado_id ? Number(data.estado_id) : existing.estado_id,
            cidade_id: data.cidade_id ? Number(data.cidade_id) : existing.cidade_id,

            // Textos e Redes Sociais
            video: data.video !== undefined ? (data.video || null) : existing.video,
            observacoes: data.observacoes !== undefined ? (data.observacoes || null) : existing.observacoes,
            whatsapp: data.whatsapp !== undefined ? (data.whatsapp || null) : existing.whatsapp,
            instagram: data.instagram !== undefined ? (data.instagram || null) : existing.instagram,
            twitter: data.twitter !== undefined ? (data.twitter || null) : existing.twitter,
            facebook: data.facebook !== undefined ? (data.facebook || null) : existing.facebook,
            tiktok: data.tiktok !== undefined ? (data.tiktok || null) : existing.tiktok,
        };

        // Tratamento da Foto
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
        // Step 1: Fetch core player data with basic relations
        const jogador: any = await prisma.jogador.findUnique({
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
            }
        });

        if (!jogador) return null;

        // Step 2: Fetch collections separately to avoid complex JOIN bugs (common in Driver Adapters)
        const [caracteristicas, estatisticas_gerais, lesoes, historico_clubes, titulos] = await Promise.all([
            prisma.caracteristica.findMany({ where: { jogador_id: id } }),
            prisma.estatisticaGeral.findMany({ where: { jogador_id: id } }),
            prisma.historicoLesao.findMany({ where: { jogador_id: id } }),
            prisma.historicoClube.findMany({
                where: { jogador_id: id },
                include: {
                    clube: {
                        include: {
                            logos: true,
                            pais: { include: { bandeira: true } }
                        }
                    }
                }
            }),
            prisma.jogadorTitulo.findMany({
                where: { jogador_id: id },
                include: {
                    titulo: true,
                    clube: {
                        include: {
                            logos: true,
                            pais: { include: { bandeira: true } }
                        }
                    }
                }
            })
        ]);

        // Merge and return
        return {
            ...jogador,
            caracteristicas,
            estatisticas_gerais,
            lesoes,
            historico_clubes,
            titulos
        };
    }
}