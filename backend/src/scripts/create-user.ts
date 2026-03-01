import 'dotenv/config'; // SEMPRE na primeira linha
import { prisma } from '../config/database'; // Importa a instância que já funciona
import bcrypt from 'bcryptjs';

async function main() {
    const email = 'admin@admin.com';
    const senhaPlana = 'admin123';
    const senhaHash = await bcrypt.hash(senhaPlana, 10);

    const usuario = await prisma.usuario.upsert({
        where: { email },
        update: {},
        create: {
            email,
            senha: senhaHash,
        },
    });

    console.log('✅ Usuário criado com sucesso!');
    console.log(`📧 Email: ${usuario.email}`);
    console.log(`🔑 Senha: ${senhaPlana}`);
}

main()
    .catch((e) => {
        console.error('❌ Erro ao criar usuário:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });