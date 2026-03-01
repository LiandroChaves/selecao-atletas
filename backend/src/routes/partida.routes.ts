import { Router } from 'express';
import { PartidaController } from '../controllers/partida.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const partidaRoutes = Router();
const controller = new PartidaController();

partidaRoutes.get('/', controller.index);
partidaRoutes.get('/:id', controller.show);
partidaRoutes.post('/', authMiddleware, controller.store);
partidaRoutes.put('/:id', authMiddleware, controller.update);
partidaRoutes.delete('/:id', authMiddleware, controller.destroy);

partidaRoutes.post('/estatisticas', authMiddleware, controller.storeEstatistica);
partidaRoutes.put('/estatisticas/:id', authMiddleware, controller.updateEstatistica);
partidaRoutes.delete('/estatisticas/:id', authMiddleware, controller.destroyEstatistica);

export { partidaRoutes };