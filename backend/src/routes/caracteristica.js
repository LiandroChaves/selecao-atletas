import { Router } from "express";
import {
    inserirCaracteristicaJogador,
    pegarCaracteristicasJogadores,
    editarCaracteristicaJogador,
    pegarCaracteristicaJogadorPorId,
    deletarCaracteristicaJogador
} from "../controllers/caracteristicasController.js";

const router = Router();

router.get("/pegarCaracteristicas", pegarCaracteristicasJogadores);
router.post("/inserirCaracteristicas", inserirCaracteristicaJogador);
router.put("/editarCaracteristica/:id", editarCaracteristicaJogador);
router.get("/pegarCaracteristicas/:id", pegarCaracteristicaJogadorPorId);
router.delete("/deletarCaracteristicas/:id", deletarCaracteristicaJogador);

export default router;
