import { Request, Response } from 'express';
import { PartidaService } from '../services/partida.service';

const service = new PartidaService();

export class PartidaController {
    async index(req: Request, res: Response) {
        const partidas = await service.findAllPartidas();
        return res.json(partidas);
    }

    async store(req: Request, res: Response) {
        const partida = await service.createPartida(req.body);
        return res.status(201).json(partida);
    }

    async storeEstatistica(req: Request, res: Response) {
        const estatistica = await service.addEstatistica(req.body);
        return res.status(201).json(estatistica);
    }

    async show(req: Request, res: Response) {
        const { id } = req.params;
        const partida = await service.findPartidaById(Number(id));
        return res.json(partida);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const partida = await service.updatePartida(Number(id), req.body);
        return res.json(partida);
    }

    async destroy(req: Request, res: Response) {
        const { id } = req.params;
        await service.deletePartida(Number(id));
        return res.status(204).send();
    }

    async updateEstatistica(req: Request, res: Response) {
        const { id } = req.params;
        const estatistica = await service.updateEstatistica(Number(id), req.body);
        return res.json(estatistica);
    }

    async destroyEstatistica(req: Request, res: Response) {
        const { id } = req.params;
        await service.deleteEstatistica(Number(id));
        return res.status(204).send();
    }
}