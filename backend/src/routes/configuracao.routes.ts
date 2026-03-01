import { Router } from 'express';
import { ConfiguracaoController } from '../controllers/configuracao.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const configuracaoRoutes = Router();
const controller = new ConfiguracaoController();

configuracaoRoutes.get('/posicoes', controller.indexPosicoes);
configuracaoRoutes.get('/ambidestria', controller.indexAmbidestria);
configuracaoRoutes.post('/posicoes', authMiddleware, controller.storePosicao);
configuracaoRoutes.post('/ambidestria', authMiddleware, controller.storeAmbidestria);
configuracaoRoutes.delete('/posicoes/:id', authMiddleware, controller.destroyPosicao);
configuracaoRoutes.delete('/ambidestria/:id', authMiddleware, controller.destroyAmbidestria);
configuracaoRoutes.put('/posicoes/:id', authMiddleware, controller.updatePosicao);
configuracaoRoutes.put('/ambidestria/:id', authMiddleware, controller.updateAmbidestria);

export { configuracaoRoutes };