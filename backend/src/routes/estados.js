import { Router } from "express";
import { inserirEstado, pegarEstados, editarEstado, pegarEstadoPorId } from "../controllers/estadosController.js";

const router = Router();

router.get("/pegarEstados", pegarEstados);
router.post("/inserirEstados", inserirEstado);
router.put("/editarEstado/:id", editarEstado);
router.get("/pegarEstado/:id", pegarEstadoPorId);

export default router;
