import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { getMe } from '../controllers/auth.controller';

const router = Router();

router.use(authRateLimiter);

// GET /auth/me
router.get('/me', requireAuth, getMe);

export default router;
