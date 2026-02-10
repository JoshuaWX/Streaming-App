import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { userRateLimiter, writeRateLimiter } from '../middleware/rateLimiter';
import { addFavouriteSchema, removeFavouriteParamSchema } from '../schemas/favourites.schema';
import { listFavourites, addFavourite, removeFavourite } from '../controllers/favourites.controller';

const router = Router();

// All favourites routes require authentication + per-user rate limit
router.use(requireAuth, userRateLimiter);

// GET    /favourites
router.get('/', listFavourites);

// POST   /favourites
router.post('/', writeRateLimiter, validate(addFavouriteSchema, 'body'), addFavourite);

// DELETE /favourites/:tmdb_id
router.delete('/:tmdb_id', writeRateLimiter, validate(removeFavouriteParamSchema, 'params'), removeFavourite);

export default router;
