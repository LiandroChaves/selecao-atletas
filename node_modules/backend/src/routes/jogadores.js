import express from "express";
import { criarJogador, listarJogadores, editarJogador, deletarJogador, pegarJogadorPorId } from "../controllers/jogadoresController.js";

const router = express.Router();

router.post("/inserirJogador", criarJogador);
router.get("/pegarJogadores", listarJogadores);
router.put("/editarJogador/:id", editarJogador);
router.delete("/deletarJogador/:id", deletarJogador);
router.get("/pegarJogador/:id", pegarJogadorPorId); // Rota para pegar jogador por ID

export default router;