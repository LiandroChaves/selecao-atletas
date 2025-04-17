import { Router } from "express";
import { inserirLesao, pegarLesoes } from "../controllers/historicoLesoesController.js";

const router = Router();

router.post("/inserirLesao", inserirLesao);
router.get("/pegarLesoes", pegarLesoes);

export default router;
