import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Récupérer l'URL de la base de données
const databaseUrl = process.env.POSTGRES_PRISMA_URL || 
                     process.env.DATABASE_URL || 
                     'postgresql://placeholder:placeholder@localhost:5432/placeholder';

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasourceUrl: databaseUrl,
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Déconnecter proprement à la fin
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}
