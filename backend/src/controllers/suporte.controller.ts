import { Request, Response } from 'express';
import { LocalidadeService } from '../services/localidade.service';
import { ConfiguracaoService } from '../services/configuracao.service';

const locService = new LocalidadeService();
const confService = new ConfiguracaoService();

export class SuporteController {
    async getLocalidadesCompletas(req: Request, res: Response) {
        const paises = await locService.findAllPaises();
        const posicoes = await confService.listPosicoes();
        const ambidestria = await confService.listNiveisAmbidestria();

        return res.json({ paises, posicoes, ambidestria });
    }

    async storeEstado(req: Request, res: Response) {
        const estado = await locService.createEstado(req.body);
        return res.status(201).json(estado);
    }

    async storeCidade(req: Request, res: Response) {
        const cidade = await locService.createCidade(req.body);
        return res.status(201).json(cidade);
    }
}