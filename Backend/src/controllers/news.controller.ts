import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as newsService from '../services/news.service';

export const getNews = asyncHandler(async (req: Request, res: Response) => {
  const { q, page, pageSize, from, to, language } = req.query as unknown as {
    q: string;
    page: number;
    pageSize: number;
    from?: string;
    to?: string;
    language: string;
  };

  const data = await newsService.getNews({ q, page, pageSize, from, to, language });
  res.json({
    data: {
      articles: data.articles,
      pagination: {
        page,
        pageSize,
        totalResults: data.totalResults,
        totalPages: Math.ceil(data.totalResults / pageSize),
      },
    },
  });
});
