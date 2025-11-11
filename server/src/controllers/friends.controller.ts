import type { Request, Response, NextFunction } from 'express';
import friendsService from '../services/friends.service';

/**
 * @openapi
 * tags:
 *   - name: Friends
 *     description: Friend management endpoints
 */
class FriendsController {
	/**
	 * @openapi
	 * /api/friends:
	 *   get:
	 *     tags: [Friends]
	 *     summary: Get friend list
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: List of friends
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/FriendDTO'
	 *       401:
	 *         description: Unauthorized
	 */
	async getFriends(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const friends = await friendsService.getFriends(userId);
			res.status(200).json(friends);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/friends/{friendId}:
	 *   delete:
	 *     tags: [Friends]
	 *     summary: Remove a friend
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: friendId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Friend's user ID
	 *     responses:
	 *       204:
	 *         description: Friend removed successfully
	 *       401:
	 *         description: Unauthorized
	 *       404:
	 *         description: Friend not found
	 */
	async removeFriend(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const friendId = parseInt(req.params.friendId, 10);
			await friendsService.removeFriend(userId, friendId);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/friends/invite:
	 *   post:
	 *     tags: [Friends]
	 *     summary: Create a friend invite
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       201:
	 *         description: Invite created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/FriendInviteDTO'
	 *       401:
	 *         description: Unauthorized
	 */
	async createInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const invite = await friendsService.createInvite(userId);
			res.status(201).json(invite);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/friends/invite/{inviteId}/accept:
	 *   post:
	 *     tags: [Friends]
	 *     summary: Accept a friend invite
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: inviteId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *         description: Invite ID
	 *     responses:
	 *       201:
	 *         description: Friendship created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/FriendshipDTO'
	 *       400:
	 *         description: Already friends or cannot accept own invite
	 *       401:
	 *         description: Unauthorized
	 *       404:
	 *         description: Invite not found
	 */
	async acceptInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const inviteId = parseInt(req.params.inviteId, 10);
			const friendship = await friendsService.acceptInvite(inviteId, userId);
			res.status(201).json(friendship);
		} catch (error) {
			next(error);
		}
	}
}

export default new FriendsController();
