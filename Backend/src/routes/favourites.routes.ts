import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { addFavouriteSchema, removeFavouriteParamSchema } from '../schemas/favourites.schema';
import { listFavourites, addFavourite, removeFavourite } from '../controllers/favourites.controller';

const router = Router();

// All favourites routes require authentication
router.use(requireAuth);

// GET    /favourites
router.get('/', listFavourites);

// POST   /favourites
router.post('/', validate(addFavouriteSchema, 'body'), addFavourite);

// DELETE /favourites/:tmdb_id
router.delete('/:tmdb_id', validate(removeFavouriteParamSchema, 'params'), removeFavourite);

export default router;
