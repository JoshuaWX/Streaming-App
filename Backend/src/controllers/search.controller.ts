import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as tmdbService from '../services/tmdb.service';

export const searchMovies = asyncHandler(async (req: Request, res: Response) => {
  const { q, page, year, include_adult } = req.query as unknown as {
    q: string;
    page: number;
    year?: number;
    include_adult: boolean;
  };
  const data = await tmdbService.searchMovies(q, page, year, include_adult);
  res.json({ data });
});
