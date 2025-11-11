import { Router } from 'express';
import levelsController from '../controllers/levels.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// Public routes (with auth)
router.get('/:levelId', authMiddleware, levelsController.getLevelById.bind(levelsController));
router.post('/:levelId/submit', authMiddleware, levelsController.submitLevel.bind(levelsController));

// Admin routes
router.post('/', authMiddleware, adminMiddleware, levelsController.createLevel.bind(levelsController));
router.put('/:levelId', authMiddleware, adminMiddleware, levelsController.updateLevel.bind(levelsController));
router.delete('/:levelId', authMiddleware, adminMiddleware, levelsController.deleteLevel.bind(levelsController));

export default router;
