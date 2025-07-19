// src/middleware/verificarLicenca.js

let dataLimite = new Date('2025-08-10');

export async function verificarLicenca(req, res, next) {
    const hoje = new Date();

    if (hoje > dataLimite) {
        // Licença expirada, retorna erro HTTP direto
        console.log('❌ Licença expirada. Acesso negado.');
        return res.status(403).json({
            ok: false,
            message: 'Licença expirada. Contate o administrador para renovação.'
        });
    }

    next();
}
