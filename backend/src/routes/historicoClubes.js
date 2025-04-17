import { Router } from "express";
import { inserirHistorico, pegarHistorico } from "../controllers/historicoClubesController.js";

const router = Router();

router.post("/inserirHistorico", inserirHistorico);
router.get("/pegarHistorico", pegarHistorico);

export default router;
