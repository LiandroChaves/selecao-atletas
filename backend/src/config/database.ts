import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';
const isExternal = process.env.DATABASE_URL?.includes('onrender.com');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction || isExternal ? { rejectUnauthorized: false } : false
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
    adapter,
    log: isProduction ? ['error', 'warn'] : ['query', 'info', 'warn', 'error']
});

export { prisma };