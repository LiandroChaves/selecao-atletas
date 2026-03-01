import { Router } from 'express';
import { LocalidadeController } from '../controllers/localidade.controller';
import { uploadPais } from '../config/multer';
import { authMiddleware } from '../middlewares/auth.middleware';

const localidadeRoutes = Router();
const controller = new LocalidadeController();

localidadeRoutes.post('/bandeiras', authMiddleware, uploadPais.single('bandeira'), controller.storeBandeira);

localidadeRoutes.get('/paises', controller.indexPaises);
localidadeRoutes.post('/paises', authMiddleware, uploadPais.single('bandeira_file'), controller.storePais);
localidadeRoutes.put('/paises/:id', authMiddleware, uploadPais.single('bandeira_file'), controller.updatePais);
localidadeRoutes.delete('/paises/:id', authMiddleware, controller.deletePais);

localidadeRoutes.get('/estados', controller.indexEstados);
localidadeRoutes.post('/estados', authMiddleware, controller.storeEstado);
localidadeRoutes.put('/estados/:id', authMiddleware, controller.updateEstado);
localidadeRoutes.delete('/estados/:id', authMiddleware, controller.destroyEstado);

localidadeRoutes.get('/cidades', controller.indexCidades);
localidadeRoutes.post('/cidades', authMiddleware, controller.storeCidade);
localidadeRoutes.put('/cidades/:id', authMiddleware, controller.updateCidade);
localidadeRoutes.delete('/cidades/:id', authMiddleware, controller.destroyCidade);

export { localidadeRoutes };