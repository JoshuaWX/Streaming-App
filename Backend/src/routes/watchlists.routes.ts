import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { userRateLimiter, writeRateLimiter } from '../middleware/rateLimiter';
import {
  createWatchlistSchema,
  updateWatchlistSchema,
  addWatchlistItemSchema,
  watchlistIdParamSchema,
  watchlistItemParamSchema,
  watchlistPaginationSchema,
} from '../schemas/watchlists.schema';
import {
  listWatchlists,
  createWatchlist,
  getWatchlist,
  updateWatchlist,
  deleteWatchlist,
  addItem,
  removeItem,
} from '../controllers/watchlists.controller';

const router = Router();

// All watchlist routes require authentication + per-user rate limit
router.use(requireAuth, userRateLimiter);

// GET  /watchlists
router.get('/', listWatchlists);

// POST /watchlists
router.post('/', writeRateLimiter, validate(createWatchlistSchema, 'body'), createWatchlist);

// GET  /watchlists/:id
router.get(
  '/:id',
  validate(watchlistIdParamSchema, 'params'),
  validate(watchlistPaginationSchema, 'query'),
  getWatchlist
);

// PATCH /watchlists/:id
router.patch(
  '/:id',
  writeRateLimiter,
  validate(watchlistIdParamSchema, 'params'),
  validate(updateWatchlistSchema, 'body'),
  updateWatchlist
);

// DELETE /watchlists/:id
router.delete('/:id', writeRateLimiter, validate(watchlistIdParamSchema, 'params'), deleteWatchlist);

// POST   /watchlists/:id/items
router.post(
  '/:id/items',
  writeRateLimiter,
  validate(watchlistIdParamSchema, 'params'),
  validate(addWatchlistItemSchema, 'body'),
  addItem
);

// DELETE /watchlists/:id/items/:itemId
router.delete(
  '/:id/items/:itemId',
  writeRateLimiter,
  validate(watchlistItemParamSchema, 'params'),
  removeItem
);

export default router;
