import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { closeRedis } from './config/redis';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  logger.info(`📖 Health check: http://localhost:${env.PORT}/api/v1/health`);
});

// ── Graceful Shutdown ─────────────────────────────────────
const shutdown = async (signal: string) => {
  logger.info(`${signal} received – shutting down gracefully…`);
  server.close(async () => {
    await closeRedis();
    logger.info('Server closed');
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled Rejection');
});
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception – shutting down');
  process.exit(1);
});
