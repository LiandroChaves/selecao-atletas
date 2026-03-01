import { Request, Response } from 'express';
import { JogadorService } from '../services/jogador.service';

const service = new JogadorService();

export class JogadorController {
    async store(req: Request, res: Response) {
        const jogador = await service.create(req.body, req.file);
        return res.status(201).json(jogador);
    }

    async index(req: Request, res: Response) {
        const jogadores = await service.findAll();
        return res.json(jogadores);
    }

    async show(req: Request, res: Response) {
        const { id } = req.params;
        const jogador = await service.findById(Number(id));
        if (!jogador) return res.status(404).json({ error: 'Jogador não encontrado' });
        return res.json(jogador);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const jogador = await service.update(Number(id), req.body, req.file);
        return res.json(jogador);
    }

    async destroy(req: Request, res: Response) {
        const { id } = req.params;
        await service.delete(Number(id));
        return res.status(204).send();
    }
}