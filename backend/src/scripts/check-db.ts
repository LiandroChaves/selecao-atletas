import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const paises = await prisma.pais.findMany({
        include: { bandeira: true }
    })
    console.log(JSON.stringify(paises, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
