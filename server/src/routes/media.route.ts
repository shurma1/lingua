import { Router } from 'express';
import mediaController from '../controllers/media.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/:mediaId', authMiddleware, mediaController.getMediaById.bind(mediaController));

export default router;
