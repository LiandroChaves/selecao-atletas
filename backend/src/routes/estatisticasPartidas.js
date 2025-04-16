// routes/estatisticasPartidasRoutes.js

import { Router } from "express";
import {
    inserirEstatisticaPartida,
    pegarEstatisticasPartidas,
} from "../controllers/estatisticasPartidasController.js";

const router = Router();

router.post("/inserirEstatisticaPartida", inserirEstatisticaPartida);
router.get("/pegarEstatisticasPartidas", pegarEstatisticasPartidas);

export default router;
