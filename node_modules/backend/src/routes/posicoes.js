import express from "express";
import { pegarPosicoes, inserirPosicao, editarPosicao, deletarPosicao, pegarPosicaoPorId, pegarPosicoesSecundariasPorID } from "../controllers/posicoesController.js";

const router = express.Router();

router.get("/pegarPosicoes", pegarPosicoes);
router.post("/inserirPosicao", inserirPosicao);
router.put("/editarPosicao/:id", editarPosicao);
router.delete("/deletarPosicao/:id", deletarPosicao);
router.get("/pegarPosicao/:id", pegarPosicaoPorId);
router.get("/pegarPosicao_Secundarias/:id", pegarPosicoesSecundariasPorID);

export default router;
