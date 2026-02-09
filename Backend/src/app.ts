import express from 'express';
import { securityHeaders, corsMiddleware } from './middleware/security';
import { globalRateLimiter } from './middleware/rateLimiter';
import { requestId } from './middleware/requestId';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './config/logger';
import routes from './routes';

const app = express();

// ── Global Middleware ──────────────────────────────────────
app.use(requestId);
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(globalRateLimiter);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: Date.now() - start,
    });
  });
  next();
});

// ── API Routes ────────────────────────────────────────────
app.use('/api/v1', routes);

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Endpoint not found' },
  });
});

// ── Error Handler (must be last) ──────────────────────────
app.use(errorHandler);

export default app;
