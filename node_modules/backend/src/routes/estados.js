import { Router } from "express";
import { inserirEstado, pegarEstados } from "../controllers/estadosController.js";

const router = Router();

router.get("/pegarEstados", pegarEstados);
router.post("/inserirEstados", inserirEstado);

export default router;
