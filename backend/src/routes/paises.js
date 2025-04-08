import { Router } from "express";
import { pegarPaises, inserirPaises } from "../controllers/paisController.js";

const router = Router();

router.get("/pegarPaises", pegarPaises);
router.post("/inserirPaises", inserirPaises);

export default router;