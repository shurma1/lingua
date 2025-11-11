import { Router } from 'express';
import languagesController from '../controllers/languages.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// Public routes (with auth)
router.get('/', authMiddleware, languagesController.getAllLanguages.bind(languagesController));
router.get('/:languageId', authMiddleware, languagesController.getLanguageById.bind(languagesController));

// Admin routes
router.post('/', authMiddleware, adminMiddleware, languagesController.createLanguage.bind(languagesController));
router.put('/:languageId', authMiddleware, adminMiddleware, languagesController.updateLanguage.bind(languagesController));
router.delete('/:languageId', authMiddleware, adminMiddleware, languagesController.deleteLanguage.bind(languagesController));

export default router;
