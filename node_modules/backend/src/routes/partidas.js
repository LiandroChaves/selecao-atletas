import express from "express";
import { pegarPartidas, inserirPartida, deletarPartida, editarPartida, buscarEstatisticasPorPartida } from "../controllers/partidasController.js";

const router = express.Router();

router.get("/pegarPartidas", pegarPartidas);
router.post("/inserirPartida", inserirPartida);
router.delete("/deletarPartida/:id", deletarPartida);
router.put("/editarPartida/:id", editarPartida);
router.get("/pegarPartida/:partida_id", buscarEstatisticasPorPartida)

export default router;