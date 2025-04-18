import { Router } from "express";
import { pegarPaises, inserirPaises, editarPais, pegarNome } from "../controllers/paisController.js";


const router = Router();

router.get("/pegarPaises", pegarPaises);
router.post("/inserirPaises", inserirPaises);
router.put("/editarPais/:id", editarPais);
router.get("/pegarPais/:id", pegarNome); 

export default router;