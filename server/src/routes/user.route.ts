import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.put('/language', authMiddleware, userController.setLanguage.bind(userController));
router.get('/profile', authMiddleware, userController.getProfile.bind(userController));

export default router;
