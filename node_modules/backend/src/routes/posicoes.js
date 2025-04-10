import express from "express";
import { pegarPosicoes, inserirPosicao } from "../controllers/posicoesController.js";

const router = express.Router();

router.get("/pegarPosicoes", pegarPosicoes);
router.post("/inserirPosicao", inserirPosicao);

export default router;
