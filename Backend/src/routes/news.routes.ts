import { Router } from 'express';
import { validate } from '../middleware/validate';
import { newsQuerySchema } from '../schemas/news.schema';
import { getNews } from '../controllers/news.controller';

const router = Router();

// GET /news?q=movies&page=1&pageSize=20
router.get('/', validate(newsQuerySchema, 'query'), getNews);

export default router;
