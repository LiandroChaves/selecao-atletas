import { Request, Response } from 'express';
import { HistoricoService } from '../services/historico.service';

const service = new HistoricoService();

export class HistoricoController {
    async storeHistorico(req: Request, res: Response) {
        const historico = await service.addHistoricoClube(req.body);
        return res.status(201).json(historico);
    }

    async storeLesao(req: Request, res: Response) {
        const lesao = await service.addLesao(req.body);
        return res.status(201).json(lesao);
    }

    async storeCaracteristica(req: Request, res: Response) {
        const { jogador_id, descricao } = req.body;
        const caracteristica = await service.addCaracteristica(Number(jogador_id), descricao);
        return res.status(201).json(caracteristica);
    }

    async updateHistorico(req: Request, res: Response) {
        const historico = await service.updateHistoricoClube(Number(req.params.id), req.body);
        return res.json(historico);
    }

    async destroyHistorico(req: Request, res: Response) {
        await service.deleteHistoricoClube(Number(req.params.id));
        return res.status(204).send();
    }

    async updateLesao(req: Request, res: Response) {
        const lesao = await service.updateLesao(Number(req.params.id), req.body);
        return res.json(lesao);
    }

    async destroyLesao(req: Request, res: Response) {
        await service.deleteLesao(Number(req.params.id));
        return res.status(204).send();
    }

    async updateCaracteristica(req: Request, res: Response) {
        const { descricao } = req.body;
        const caracteristica = await service.updateCaracteristica(Number(req.params.id), descricao);
        return res.json(caracteristica);
    }

    async destroyCaracteristica(req: Request, res: Response) {
        await service.deleteCaracteristica(Number(req.params.id));
        return res.status(204).send();
    }
}