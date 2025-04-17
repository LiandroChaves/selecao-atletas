import { Router } from "express";
import { inserirJogadorTitulo, pegarJogadoresTitulos } from "../controllers/jogadoresTitulosController.js";

const router = Router();

router.post("/inserirJogadorTitulo", inserirJogadorTitulo);
router.get("/pegarJogadoresTitulos", pegarJogadoresTitulos);

export default router;
