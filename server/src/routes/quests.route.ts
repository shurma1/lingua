import { Router } from 'express';
import questsController from '../controllers/quests.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// Public routes (with auth)
router.get('/:questId', authMiddleware, questsController.getQuestById.bind(questsController));

// Admin routes
router.post('/', authMiddleware, adminMiddleware, questsController.createQuest.bind(questsController));
router.delete('/:questId', authMiddleware, adminMiddleware, questsController.deleteQuest.bind(questsController));

export default router;
