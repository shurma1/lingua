import type { Request, Response, NextFunction } from 'express';
import levelsService from '../services/levels.service';

/**
 * @openapi
 * tags:
 *   - name: Levels
 *     description: Level management endpoints
 */
class LevelsController {
	/**
	 * @openapi
	 * /api/modules/{moduleId}/levels:
	 *   get:
	 *     tags: [Levels]
	 *     summary: Get levels of a module with user progress
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: moduleId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       200:
	 *         description: List of levels
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/LevelDTO'
	 *       404:
	 *         description: Module not found
	 */
	async getLevelsByModule(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const moduleId = parseInt(req.params.moduleId, 10);
			const userId = req.user!.userId;
			const levels = await levelsService.getLevelsByModule(moduleId, userId);
			res.status(200).json(levels);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/levels/{levelId}:
	 *   get:
	 *     tags: [Levels]
	 *     summary: Get level by ID
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: levelId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       200:
	 *         description: Level data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/LevelDTO'
	 *       404:
	 *         description: Level not found
	 */
	async getLevelById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const levelId = parseInt(req.params.levelId, 10);
			const userId = req.user?.userId;
			const level = await levelsService.getLevelById(levelId, userId);
			res.status(200).json(level);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/levels:
	 *   post:
	 *     tags: [Levels]
	 *     summary: Create a level (admin only)
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - moduleId
	 *               - icon
	 *             properties:
	 *               moduleId:
	 *                 type: integer
	 *               icon:
	 *                 type: string
	 *     responses:
	 *       201:
	 *         description: Level created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/LevelDTO'
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Module not found
	 */
	async createLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { moduleId, icon } = req.body;
			const level = await levelsService.createLevel(moduleId, icon);
			res.status(201).json(level);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/levels/{levelId}:
	 *   put:
	 *     tags: [Levels]
	 *     summary: Update a level (admin only)
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: levelId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               icon:
	 *                 type: string
	 *               moduleId:
	 *                 type: integer
	 *     responses:
	 *       200:
	 *         description: Level updated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/LevelDTO'
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Level not found
	 */
	async updateLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const levelId = parseInt(req.params.levelId, 10);
			const { icon, moduleId } = req.body;
			const level = await levelsService.updateLevel(levelId, { icon, moduleId });
			res.status(200).json(level);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/levels/{levelId}:
	 *   delete:
	 *     tags: [Levels]
	 *     summary: Delete a level (admin only)
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: levelId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       204:
	 *         description: Level deleted successfully
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Level not found
	 */
	async deleteLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const levelId = parseInt(req.params.levelId, 10);
			await levelsService.deleteLevel(levelId);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/levels/{levelId}/submit:
	 *   post:
	 *     tags: [Levels]
	 *     summary: Submit level completion result
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: levelId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - score
	 *             properties:
	 *               score:
	 *                 type: integer
	 *                 minimum: 0
	 *                 maximum: 100
	 *                 description: Score achieved (0-100)
	 *     responses:
	 *       200:
	 *         description: Level submitted successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 stars:
	 *                   type: integer
	 *                 exp:
	 *                   type: integer
	 *       400:
	 *         description: Invalid score
	 *       404:
	 *         description: Level not found
	 */
	async submitLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const levelId = parseInt(req.params.levelId, 10);
			const userId = req.user!.userId;
			const { score } = req.body;
			const result = await levelsService.submitLevel(levelId, userId, score);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}

export default new LevelsController();
