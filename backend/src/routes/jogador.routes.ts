import { Router } from 'express';
import { JogadorController } from '../controllers/jogador.controller';
import { uploadJogador } from '../config/multer';
import { authMiddleware } from '../middlewares/auth.middleware';

const jogadorRoutes = Router();
const controller = new JogadorController();

jogadorRoutes.get('/', controller.index);
jogadorRoutes.get('/:id', controller.show);
jogadorRoutes.post('/', authMiddleware, uploadJogador.single('foto'), controller.store);
jogadorRoutes.put('/:id', authMiddleware, uploadJogador.single('foto'), controller.update);
jogadorRoutes.delete('/:id', authMiddleware, controller.destroy);

export { jogadorRoutes };