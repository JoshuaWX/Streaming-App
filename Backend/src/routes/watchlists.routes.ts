import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
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

// All watchlist routes require authentication
router.use(requireAuth);

// GET  /watchlists
router.get('/', listWatchlists);

// POST /watchlists
router.post('/', validate(createWatchlistSchema, 'body'), createWatchlist);

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
  validate(watchlistIdParamSchema, 'params'),
  validate(updateWatchlistSchema, 'body'),
  updateWatchlist
);

// DELETE /watchlists/:id
router.delete('/:id', validate(watchlistIdParamSchema, 'params'), deleteWatchlist);

// POST   /watchlists/:id/items
router.post(
  '/:id/items',
  validate(watchlistIdParamSchema, 'params'),
  validate(addWatchlistItemSchema, 'body'),
  addItem
);

// DELETE /watchlists/:id/items/:itemId
router.delete(
  '/:id/items/:itemId',
  validate(watchlistItemParamSchema, 'params'),
  removeItem
);

export default router;
