import { Router } from 'express';
import friendsController from '../controllers/friends.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.get('/', authMiddleware, friendsController.getFriends.bind(friendsController));
router.delete('/:friendId', authMiddleware, friendsController.removeFriend.bind(friendsController));
router.post('/invite', authMiddleware, friendsController.createInvite.bind(friendsController));
router.post('/invite/:inviteId/accept', authMiddleware, friendsController.acceptInvite.bind(friendsController));

export default router;
