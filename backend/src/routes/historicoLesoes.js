import { Router } from "express";
import {
    inserirLesao,
    pegarLesoes,
    editarLesao,
    deletarLesao
} from "../controllers/historicoLesoesController.js";

const router = Router();

router.get("/pegarLesoes", pegarLesoes);
router.get("/pegarHistoricoLesoes", pegarLesoes);
router.post("/inserirLesao", inserirLesao);
router.put("/editarHistoricoLesao/:id", editarLesao);
router.delete("/deletarHistoricoLesao/:id", deletarLesao);

export default router;
