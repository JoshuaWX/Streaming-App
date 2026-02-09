import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as tmdbService from '../services/tmdb.service';

export const getTrending = asyncHandler(async (req: Request, res: Response) => {
  const { page, time_window } = req.query as unknown as { page: number; time_window: 'day' | 'week' };
  const data = await tmdbService.getTrending(time_window, page);
  res.json({ data });
});

export const getPopular = asyncHandler(async (req: Request, res: Response) => {
  const { page } = req.query as unknown as { page: number };
  const data = await tmdbService.getPopular(page);
  res.json({ data });
});

export const getTopRated = asyncHandler(async (req: Request, res: Response) => {
  const { page } = req.query as unknown as { page: number };
  const data = await tmdbService.getTopRated(page);
  res.json({ data });
});

export const getMovieDetail = asyncHandler(async (req: Request, res: Response) => {
  const { tmdbId } = req.params as unknown as { tmdbId: number };
  const data = await tmdbService.getMovieDetail(Number(tmdbId));
  res.json({ data });
});

export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const { tmdbId } = req.params as unknown as { tmdbId: number };
  const { page } = req.query as unknown as { page: number };
  const data = await tmdbService.getRecommendations(Number(tmdbId), page);
  res.json({ data });
});
