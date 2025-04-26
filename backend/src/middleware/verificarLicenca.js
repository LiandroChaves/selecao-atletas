// src/middleware/verificarLicenca.js

import readline from 'readline';

// Defina a senha secreta
const SENHA_SECRETA = 'biliap023';
const dias = 7;
// Defina a data inicial de vencimento
let dataLimite = new Date('2025-05-10');

export async function verificarLicenca(req, res, next) {
    const hoje = new Date();

    if (hoje > dataLimite) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Licença expirada. Insira a senha para prorrogar: ', (resposta) => {
            if (resposta === SENHA_SECRETA) {
                // Se senha correta, adiciona 7 dias
                dataLimite = new Date();
                dataLimite.setDate(dataLimite.getDate() + dias);
                alert(`✅ Licença prorrogada por ${dias} dias.`);
                rl.close();
                next();
            } else {
                alert('❌ Senha incorreta. Acesso negado.');
                rl.close();
                return res.status(403).json({
                    ok: false,
                    message: 'Licença expirada. Acesso negado.'
                });
            }
        });
    } else {
        next(); // Licença ainda válida
    }
}
