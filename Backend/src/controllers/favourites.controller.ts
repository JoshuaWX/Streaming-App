import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as favouritesService from '../services/favourites.service';

export const listFavourites = asyncHandler(async (req: Request, res: Response) => {
  const data = await favouritesService.listFavourites(req.user!.id);
  res.json({ data });
});

export const addFavourite = asyncHandler(async (req: Request, res: Response) => {
  const { tmdb_id, title, poster_path } = req.body;
  const data = await favouritesService.addFavourite(req.user!.id, tmdb_id, title, poster_path);
  res.status(201).json({ data });
});

export const removeFavourite = asyncHandler(async (req: Request, res: Response) => {
  const tmdbId = Number(req.params.tmdb_id);
  await favouritesService.removeFavourite(req.user!.id, tmdbId);
  res.status(204).send();
});
