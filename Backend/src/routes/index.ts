import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import movieRoutes from './movies.routes';
import searchRoutes from './search.routes';
import watchlistRoutes from './watchlists.routes';
import favouritesRoutes from './favourites.routes';
import newsRoutes from './news.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/search', searchRoutes);
router.use('/watchlists', watchlistRoutes);
router.use('/favourites', favouritesRoutes);
router.use('/news', newsRoutes);

export default router;
