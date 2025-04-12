import express from "express";
import { criarJogador, listarJogadores } from "../controllers/jogadoresController.js";

const router = express.Router();

router.post("/inserirJogador", criarJogador);
router.get("/pegarJogadores", listarJogadores);

export default router;