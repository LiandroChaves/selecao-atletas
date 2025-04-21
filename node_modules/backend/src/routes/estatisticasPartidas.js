// routes/estatisticasPartidasRoutes.js

import { Router } from "express";
import {
    inserirEstatisticaPartida,
    // pegarEstatisticasPartidas,
    buscarEstatisticasPartidas,
    editarEstatisticaPartida,
    deletarEstatisticaPartida,

} from "../controllers/estatisticasPartidasController.js";

const router = Router();

router.post("/inserirEstatisticaPartida", inserirEstatisticaPartida);
// router.get("/pegarEstatisticasPartidas", pegarEstatisticasPartidas);
router.get("/pegarEstatisticasPartida", buscarEstatisticasPartidas);
router.put("/editarEstatisticaPartida/:id", editarEstatisticaPartida);
router.delete("/deletarEstatisticaPartida/:id", deletarEstatisticaPartida);

export default router;
