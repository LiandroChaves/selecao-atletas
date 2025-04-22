import { Router } from "express";
import {
    inserirJogadorTitulo,
    pegarJogadoresTitulos,
    editarJogadorTitulo,
    deletarJogadorTitulo
} from "../controllers/jogadoresTitulosController.js";

const router = Router();

router.post("/inserirJogadorTitulo", inserirJogadorTitulo);
router.get("/pegarJogadoresTitulos", pegarJogadoresTitulos);
router.put("/editarJogadorTitulo/:id", editarJogadorTitulo);
router.delete("/deletarJogadorTitulo/:id", deletarJogadorTitulo);


export default router;
