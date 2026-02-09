/* eslint-disable @typescript-eslint/no-namespace */
import { Request } from 'express';

export interface UserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      requestId?: string;
    }
  }
}
