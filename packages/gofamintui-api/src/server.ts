import express, { Express } from "express";
import { logger } from "./utils/logger";
import { disconnectPrisma, initPrisma } from "./config/prismaConfig";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandling";
import { env } from "./config/enviroment";
import { setupMiddleware } from "./middlewares";




let isShuttingDown = false;


async function gracefulShutdown(): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info("🛑 Starting graceful shutdown...");

  try {
    await disconnectPrisma();
    logger.info("✅ Graceful shutdown complete");
  } catch (error) {
    logger.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
}


export async function bootstrap(): Promise<void> {
  try {
    logger.info("🚀 Bootstrapping application...");

    // 1. Initialize Prisma
    await initPrisma();

    // 2. Create Express app
    const app: Express = express();

  
    setupMiddleware(app);


    app.use(notFoundHandler);


app.use(errorHandler);

  
    // 6. Start server
    const server = app.listen(env.PORT, () => {
      logger.info(`✅ Server running on port ${env.PORT} (${env.NODE_ENV})`);
    });

    // 7. Graceful shutdown handlers
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);

    process.on("uncaughtException", (error) => {
      logger.error("💥 UNCAUGHT EXCEPTION:", error);
      gracefulShutdown().then(() => process.exit(1));
    });

    process.on("unhandledRejection", (reason) => {
      logger.error("💥 UNHANDLED REJECTION:", reason);
      gracefulShutdown().then(() => process.exit(1));
    });
  } catch (error) {
    logger.error("❌ Bootstrap failed:", error);
    process.exit(1);
  }
}


bootstrap().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});