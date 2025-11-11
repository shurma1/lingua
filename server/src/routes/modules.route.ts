import { Router } from 'express';
import modulesController from '../controllers/modules.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// Public routes (with auth)
router.get('/:moduleId', authMiddleware, modulesController.getModuleById.bind(modulesController));

// Admin routes
router.post('/', authMiddleware, adminMiddleware, modulesController.createModule.bind(modulesController));
router.put('/:moduleId', authMiddleware, adminMiddleware, modulesController.updateModule.bind(modulesController));
router.delete('/:moduleId', authMiddleware, adminMiddleware, modulesController.deleteModule.bind(modulesController));

export default router;
