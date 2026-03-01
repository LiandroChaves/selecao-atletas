import { Request, Response } from 'express';
import { ConfiguracaoService } from '../services/configuracao.service';

const service = new ConfiguracaoService();

export class ConfiguracaoController {
    async indexPosicoes(req: Request, res: Response) {
        const posicoes = await service.listPosicoes();
        return res.json(posicoes);
    }

    async indexAmbidestria(req: Request, res: Response) {
        const niveis = await service.listNiveisAmbidestria();
        return res.json(niveis);
    }

    async storePosicao(req: Request, res: Response) {
        const { nome } = req.body;
        const posicao = await service.createPosicao(nome);
        return res.status(201).json(posicao);
    }

    async storeAmbidestria(req: Request, res: Response) {
        const { descricao } = req.body;
        const nivel = await service.createNivelAmbidestria(descricao);
        return res.status(201).json(nivel);
    }

    async destroyPosicao(req: Request, res: Response) {
        const id = Number(req.params.id);
        await service.deletePosicao(id);
        return res.status(204).send();
    }

    async destroyAmbidestria(req: Request, res: Response) {
        const id = Number(req.params.id);
        await service.deleteNivelAmbidestria(id);
        return res.status(204).send();
    }

    async updatePosicao(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { nome } = req.body;
        const posicao = await service.updatePosicao(id, nome);
        return res.json(posicao);
    }

    async updateAmbidestria(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { descricao } = req.body;
        const nivel = await service.updateNivelAmbidestria(id, descricao);
        return res.json(nivel);
    }
}