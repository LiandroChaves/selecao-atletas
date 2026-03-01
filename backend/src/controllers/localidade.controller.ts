import { Request, Response } from 'express';
import { LocalidadeService } from '../services/localidade.service';

const service = new LocalidadeService();

export class LocalidadeController {
    async storeBandeira(req: Request, res: Response) {
        const filename = req.file?.filename;
        const bandeira = await service.createBandeira({
            ...req.body,
            url: filename ? `paises/${filename}` : req.body.url
        });
        return res.status(201).json(bandeira);
    }

    async indexPaises(req: Request, res: Response) {
        const paises = await service.findAllPaises();
        return res.json(paises);
    }

    async storePais(req: Request, res: Response) {
        let bandeira_id = req.body.bandeira_id;

        if (req.file) {
            const filename = req.file.filename;
            const bandeira = await service.createBandeira({
                nome: req.body.nome || 'Bandeira',
                logo_bandeira: `paises/${filename}`
            });
            bandeira_id = bandeira.id;
        }

        const data = { ...req.body };
        if (bandeira_id) data.bandeira_id = Number(bandeira_id);

        const pais = await service.createPais(data);
        return res.status(201).json(pais);
    }

    async updatePais(req: Request, res: Response) {
        const id = Number(req.params.id);
        const updateData: any = { ...req.body };

        if (req.file) {
            const filename = req.file.filename;
            const bandeira = await service.createBandeira({
                nome: req.body.nome || updateData.nome || 'Bandeira',
                logo_bandeira: `paises/${filename}`
            });
            updateData.bandeira_id = bandeira.id;
        }

        if (updateData.bandeira_id) updateData.bandeira_id = Number(updateData.bandeira_id);

        const pais = await service.updatePais(id, updateData);
        return res.json(pais);
    }

    async deletePais(req: Request, res: Response) {
        const id = Number(req.params.id);
        await service.deletePais(id);
        return res.status(204).send();
    }

    async indexEstados(req: Request, res: Response) {
        const estados = await service.findAllEstados();
        return res.json(estados);
    }

    async storeEstado(req: Request, res: Response) {
        const estado = await service.createEstado(req.body);
        return res.status(201).json(estado);
    }

    async updateEstado(req: Request, res: Response) {
        const id = Number(req.params.id);
        const estado = await service.updateEstado(id, req.body);
        return res.json(estado);
    }

    async destroyEstado(req: Request, res: Response) {
        const id = Number(req.params.id);
        await service.deleteEstado(id);
        return res.status(204).send();
    }

    async indexCidades(req: Request, res: Response) {
        const cidades = await service.findAllCidades();
        return res.json(cidades);
    }

    async storeCidade(req: Request, res: Response) {
        const cidade = await service.createCidade(req.body);
        return res.status(201).json(cidade);
    }

    async updateCidade(req: Request, res: Response) {
        const id = Number(req.params.id);
        const cidade = await service.updateCidade(id, req.body);
        return res.json(cidade);
    }

    async destroyCidade(req: Request, res: Response) {
        const id = Number(req.params.id);
        await service.deleteCidade(id);
        return res.status(204).send();
    }
}