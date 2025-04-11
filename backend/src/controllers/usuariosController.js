import Usuarios from "../database/models/Login.js";
import { hash } from "bcrypt";

export const cadastrarUsuario = async (req, res) => {

    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "Nome (ou email) e senha são obrigatórios." });
    }

    try {
        const usuarioExistente = await Usuarios.findOne({ where: { email } });

        if (usuarioExistente) {
            return res.status(409).json({ message: "Usuário já existe." });
        }

        const senhaCriptograda = await hash(senha, 6);
        console.log("Senha criptografada:", senha);

        const novoUsuario = await Usuarios.create({
            email,
            senha: senhaCriptograda,
        });

        console.log("Usuário cadastrado com sucesso:", novoUsuario);

        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuarios.findAll({
            attributes: ['id', 'email', 'created_at', 'updated_at'] // Evita expor a senha
        });

        return res.status(200).json(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return res.status(500).json({ message: "Erro ao buscar usuários." });
    }
};