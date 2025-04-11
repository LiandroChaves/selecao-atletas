import jwt from "jsonwebtoken";
import Usuarios from "../database/models/Login.js";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_supersecreto";
const JWT_EXPIRATION = "1h";

export const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        console.log("Tentando autenticar usuário:", email);

        const usuario = await Usuarios.findOne({ where: { email } });

        if (!usuario) {
            console.warn("Usuário não encontrado com o email:", email);
            return res.status(401).json({ mensagem: "Email ou senha inválidos" });
        }

        console.log("Usuário encontrado:", usuario.email);

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            console.warn("Senha inválida para o usuário:", email);
            return res.status(401).json({ mensagem: "Email ou senha inválidos" });
        }

        // if (senha !== usuario.senha) {
        //     console.warn("Senha incorreta para o usuário:", email);
        //     return res.status(401).json({ mensagem: "Email ou senha inválidos" });
        // }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        console.log("Token JWT gerado:", token);

        return res.json({ token });
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
};