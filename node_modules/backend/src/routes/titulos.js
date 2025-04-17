import { Router } from "express";
import { inserirTitulo, pegarTitulos } from "../controllers/titulosController.js";

const router = Router();

router.post("/inserirTitulo", inserirTitulo);
router.get("/pegarTitulos", pegarTitulos);

export default router;
