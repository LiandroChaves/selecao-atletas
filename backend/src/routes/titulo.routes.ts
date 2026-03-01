import { Router } from 'express';
import { TituloService } from '../services/titulo.service';
import { authMiddleware } from '../middlewares/auth.middleware';

const tituloRoutes = Router();
const service = new TituloService();

tituloRoutes.get('/', async (req, res) => {
    const titulos = await service.listAllTitulos();
    return res.json(titulos);
});

tituloRoutes.post('/', authMiddleware, async (req, res) => {
    const { nome, tipo } = req.body;
    const titulo = await service.createTitulo(nome, tipo);
    return res.status(201).json(titulo);
});

tituloRoutes.post('/vincular', authMiddleware, async (req, res) => {
    const vinculo = await service.vincularJogador(req.body);
    return res.status(201).json(vinculo);
});

tituloRoutes.put('/:id', authMiddleware, async (req, res) => {
    const titulo = await service.updateTitulo(Number(req.params.id), req.body);
    return res.json(titulo);
});

tituloRoutes.delete('/:id', authMiddleware, async (req, res) => {
    await service.deleteTitulo(Number(req.params.id));
    return res.status(204).send();
});

export { tituloRoutes };