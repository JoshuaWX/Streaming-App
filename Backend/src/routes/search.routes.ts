import { Router } from 'express';
import { validate } from '../middleware/validate';
import { searchQuerySchema } from '../schemas/search.schema';
import { searchMovies } from '../controllers/search.controller';

const router = Router();

// GET /search/movies?q=...&page=1
router.get('/movies', validate(searchQuerySchema, 'query'), searchMovies);

export default router;
