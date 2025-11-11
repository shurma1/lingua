import express from 'express';
import AuthRoute from './auth.route';
import UserRoute from './user.route';
import FriendsRoute from './friends.route';
import StatsRoute from './stats.route';
import LanguagesRoute from './languages.route';
import ModulesRoute from './modules.route';
import LevelsRoute from './levels.route';
import QuestsRoute from './quests.route';
import MediaRoute from './media.route';
import modulesController from '../controllers/modules.controller';
import levelsController from '../controllers/levels.controller';
import questsController from '../controllers/quests.controller';
import lessonsController from '../controllers/lessons.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = express.Router();

// Auth routes
router.use('/auth', AuthRoute);

// User routes
router.use('/user', UserRoute);

// Friends routes
router.use('/friends', FriendsRoute);

// Stats routes
router.use('/stats', StatsRoute);

// Languages routes
router.use('/languages', LanguagesRoute);

// Modules routes
router.use('/modules', ModulesRoute);

// Levels routes
router.use('/levels', LevelsRoute);

// Quests routes
router.use('/quests', QuestsRoute);

// Media routes
router.use('/media', MediaRoute);

// Nested routes
// GET /api/languages/:languageId/modules
router.get('/languages/:languageId/modules', authMiddleware, modulesController.getModulesByLanguage.bind(modulesController));

// GET /api/modules/:moduleId/levels
router.get('/modules/:moduleId/levels', authMiddleware, levelsController.getLevelsByModule.bind(levelsController));

// Lesson routes (nested under modules)
// GET /api/modules/:moduleId/lesson
router.get('/modules/:moduleId/lesson', authMiddleware, lessonsController.getLessonByModule.bind(lessonsController));
// POST /api/modules/:moduleId/lesson (admin)
router.post('/modules/:moduleId/lesson', authMiddleware, adminMiddleware, lessonsController.createLesson.bind(lessonsController));
// PUT /api/modules/:moduleId/lesson (admin)
router.put('/modules/:moduleId/lesson', authMiddleware, adminMiddleware, lessonsController.updateLesson.bind(lessonsController));
// DELETE /api/modules/:moduleId/lesson (admin)
router.delete('/modules/:moduleId/lesson', authMiddleware, adminMiddleware, lessonsController.deleteLesson.bind(lessonsController));

// GET /api/levels/:levelId/quests
router.get('/levels/:levelId/quests', authMiddleware, questsController.getQuestsByLevel.bind(questsController));

export default router;
