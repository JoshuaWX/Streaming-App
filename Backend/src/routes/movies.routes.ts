import { Router } from 'express';
import { validate } from '../middleware/validate';
import {
  trendingQuerySchema,
  paginationQuerySchema,
  movieIdParamSchema,
} from '../schemas/movies.schema';
import {
  getTrending,
  getPopular,
  getTopRated,
  getMovieDetail,
  getRecommendations,
  getDirectorMovies,
} from '../controllers/movies.controller';

const router = Router();

// GET /movies/trending?page=1&time_window=day
router.get('/trending', validate(trendingQuerySchema, 'query'), getTrending);

// GET /movies/popular?page=1
router.get('/popular', validate(paginationQuerySchema, 'query'), getPopular);

// GET /movies/top-rated?page=1
router.get('/top-rated', validate(paginationQuerySchema, 'query'), getTopRated);

// GET /movies/:tmdbId
router.get('/:tmdbId', validate(movieIdParamSchema, 'params'), getMovieDetail);

// GET /movies/:tmdbId/recommendations?page=1
router.get(
  '/:tmdbId/recommendations',
  validate(movieIdParamSchema, 'params'),
  validate(paginationQuerySchema, 'query'),
  getRecommendations
);

// GET /movies/:tmdbId/director-movies
router.get('/:tmdbId/director-movies', validate(movieIdParamSchema, 'params'), getDirectorMovies);

export default router;
