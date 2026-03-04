import { Router } from 'express';
import { HistoricoController } from '../controllers/historico.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const historicoRoutes = Router();
const controller = new HistoricoController();

historicoRoutes.post('/clube', authMiddleware, controller.storeHistorico);
historicoRoutes.put('/clube/:id', authMiddleware, controller.updateHistorico);
historicoRoutes.delete('/clube/:id', authMiddleware, controller.destroyHistorico);

historicoRoutes.post('/lesao', authMiddleware, controller.storeLesao);
historicoRoutes.put('/lesao/:id', authMiddleware, controller.updateLesao);
historicoRoutes.delete('/lesao/:id', authMiddleware, controller.destroyLesao);

historicoRoutes.post('/caracteristica', authMiddleware, controller.storeCaracteristica);
historicoRoutes.put('/caracteristica/:id', authMiddleware, controller.updateCaracteristica);
historicoRoutes.delete('/caracteristica/:id', authMiddleware, controller.destroyCaracteristica);

historicoRoutes.post('/estatistica', authMiddleware, controller.storeEstatistica);
historicoRoutes.put('/estatistica/:id', authMiddleware, controller.updateEstatistica);
historicoRoutes.delete('/estatistica/:id', authMiddleware, controller.destroyEstatistica);

export { historicoRoutes };