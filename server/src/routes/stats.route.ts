import { Router } from 'express';
import statsController from '../controllers/stats.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/leaderboard', authMiddleware, statsController.getLeaderboard.bind(statsController));

export default router;
