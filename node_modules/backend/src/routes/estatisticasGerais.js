import { Router } from "express";
import {
    pegarEstatisticasGerais,
    inserirEstatisticaGeral,
    deletarEstatisticaGeral,
    editarEstatisticaGeral,
} from "../controllers/estatisticasGeraisController.js";

const router = Router();

router.get("/pegarEstatisticasGerais", pegarEstatisticasGerais);
router.post("/inserirEstatisticaGeral", inserirEstatisticaGeral);
router.delete("/deletarEstatisticaGeral/:jogador_id", deletarEstatisticaGeral);
router.put("/editarEstatisticaGeral/:jogador_id", editarEstatisticaGeral);
// 

export default router;
