import express from "express";
import { cadastrarUsuario , getUsuarios } from "../controllers/usuariosController.js";

const router = express.Router();

router.post("/cadastro", cadastrarUsuario);
router.get("/pegarUsuarios", getUsuarios);

export default router;
