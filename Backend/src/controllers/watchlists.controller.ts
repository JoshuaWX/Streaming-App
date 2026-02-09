import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as watchlistService from '../services/watchlist.service';
import { sanitize } from '../utils/sanitize';

export const listWatchlists = asyncHandler(async (req: Request, res: Response) => {
  const data = await watchlistService.getUserWatchlists(req.user!.id);
  res.json({ data });
});

export const createWatchlist = asyncHandler(async (req: Request, res: Response) => {
  const name = sanitize(req.body.name);
  const data = await watchlistService.createWatchlist(req.user!.id, name);
  res.status(201).json({ data });
});

export const getWatchlist = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { page, limit } = req.query as unknown as { page: number; limit: number };

  const watchlist = await watchlistService.getWatchlistById(req.user!.id, id);
  const { items, total } = await watchlistService.getWatchlistItems(req.user!.id, id, page, limit);

  res.json({
    data: {
      ...watchlist,
      items,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    },
  });
});

export const updateWatchlist = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const name = sanitize(req.body.name);
  const data = await watchlistService.updateWatchlist(req.user!.id, id, name);
  res.json({ data });
});

export const deleteWatchlist = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await watchlistService.deleteWatchlist(req.user!.id, id);
  res.status(204).send();
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { tmdb_movie_id, title, poster_path } = req.body;
  const data = await watchlistService.addWatchlistItem(
    req.user!.id,
    id,
    tmdb_movie_id,
    title,
    poster_path
  );
  res.status(201).json({ data });
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const itemId = req.params.itemId as string;
  await watchlistService.removeWatchlistItem(req.user!.id, id, itemId);
  res.status(204).send();
});
