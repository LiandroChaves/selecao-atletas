import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_supersecreto";

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
};

export default verificarToken;
