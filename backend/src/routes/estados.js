import { Router } from "express";
import { inserirEstado, pegarEstados, editarEstado } from "../controllers/estadosController.js";

const router = Router();

router.get("/pegarEstados", pegarEstados);
router.post("/inserirEstados", inserirEstado);
router.put("/editarEstado/:id", editarEstado);

export default router;
