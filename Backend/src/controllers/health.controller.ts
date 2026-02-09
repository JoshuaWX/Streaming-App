import { Request, Response } from 'express';
import pkg from '../../package.json';

export function healthCheck(_req: Request, res: Response): void {
  res.json({
    status: 'ok',
    version: pkg.version,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
