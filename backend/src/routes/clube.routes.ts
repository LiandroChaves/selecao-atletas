import { Router } from 'express';
import { ClubeController } from '../controllers/clube.controller';
import { uploadClube } from '../config/multer';
import { authMiddleware } from '../middlewares/auth.middleware';

const clubeRoutes = Router();
const controller = new ClubeController();

clubeRoutes.get('/', controller.index);
clubeRoutes.get('/:id', controller.show);
clubeRoutes.post('/', authMiddleware, uploadClube.single('logo'), controller.store);
clubeRoutes.put('/:id', authMiddleware, uploadClube.single('logo'), controller.update);
clubeRoutes.delete('/:id', authMiddleware, controller.destroy);

export { clubeRoutes };