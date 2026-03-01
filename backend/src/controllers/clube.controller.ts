import { Request, Response } from 'express';
import { ClubeService } from '../services/clube.service';

const service = new ClubeService();

export class ClubeController {
    async store(req: Request, res: Response) {
        const logo_filename = req.file?.filename;
        const clube = await service.create(req.body, logo_filename);
        return res.status(201).json(clube);
    }

    async index(req: Request, res: Response) {
        const clubes = await service.findAll();
        return res.json(clubes);
    }

    async show(req: Request, res: Response) {
        const { id } = req.params;
        const clube = await service.findById(Number(id));
        if (!clube) return res.status(404).json({ error: 'Clube não encontrado' });
        return res.json(clube);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const logo_filename = req.file?.filename;
        const clube = await service.update(Number(id), req.body, logo_filename);
        return res.json(clube);
    }

    async destroy(req: Request, res: Response) {
        const { id } = req.params;
        await service.delete(Number(id));
        return res.status(204).send();
    }
}