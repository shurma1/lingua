import { Router } from 'express';
import lessonsController from '../controllers/lessons.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// Routes are nested under /api/modules/:moduleId/lesson
// The moduleId param is handled by the controller

export default router;
