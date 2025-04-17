import { Router } from "express";
import { pegarPaises, inserirPaises, editarPais } from "../controllers/paisController.js";


const router = Router();

router.get("/pegarPaises", pegarPaises);
router.post("/inserirPaises", inserirPaises);
router.put("/editarPais/:id", editarPais);

export default router;