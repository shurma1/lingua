import type { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User profile management endpoints
 */
class UserController {
	/**
	 * @openapi
	 * /api/user/language:
	 *   put:
	 *     tags: [User]
	 *     summary: Set user's learning language
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - languageId
	 *             properties:
	 *               languageId:
	 *                 type: integer
	 *                 description: ID of the language to learn
	 *                 example: 1
	 *     responses:
	 *       200:
	 *         description: Language updated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UserDTO'
	 *       401:
	 *         description: Unauthorized
	 *       404:
	 *         description: Language not found
	 */
	async setLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const { languageId } = req.body;
			const user = await userService.setLanguage(userId, languageId);
			res.status(200).json(user);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/user/profile:
	 *   get:
	 *     tags: [User]
	 *     summary: Get user profile
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: User profile
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UserDTO'
	 *       401:
	 *         description: Unauthorized
	 *       404:
	 *         description: User not found
	 */
	async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const user = await userService.getUserProfile(userId);
			res.status(200).json(user);
		} catch (error) {
			next(error);
		}
	}
}

export default new UserController();
