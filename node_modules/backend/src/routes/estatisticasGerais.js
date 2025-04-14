import { Router } from "express";
import {
  pegarEstatisticasGerais,
  inserirEstatisticaGeral,
} from "../controllers/estatisticasGeraisController.js";

const router = Router();

router.get("/pegarEstatisticasGerais", pegarEstatisticasGerais);
router.post("/inserirEstatisticaGeral", inserirEstatisticaGeral);

export default router;
