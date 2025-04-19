import { Router } from "express";
import { pegarPaises, inserirPaises, editarPais, pegarNome, deletarPais } from "../controllers/paisController.js";


const router = Router();

router.get("/pegarPaises", pegarPaises);
router.post("/inserirPaises", inserirPaises);
router.put("/editarPais/:id", editarPais);
router.get("/pegarPais/:id", pegarNome); 
router.delete("/deletarPais/:id", deletarPais);

export default router;