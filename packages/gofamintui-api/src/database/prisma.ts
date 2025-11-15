import { logger } from "@/utils/logger";
import { PrismaClient } from "@prisma/client";




export const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('✅ Database disconnected');
  } catch (error) {
    logger.error('❌ Error disconnecting database:', error);
    throw error;
  }
}