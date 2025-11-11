import type { Request, Response, NextFunction } from 'express';
import lessonsService from '../services/lessons.service';

/**
 * @openapi
 * tags:
 *   - name: Lessons
 *     description: Lesson management endpoints
 */
class LessonsController {
	/**
	 * @openapi
	 * /api/modules/{moduleId}/lesson:
	 *   get:
	 *     tags: [Lessons]
	 *     summary: Get module lesson
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
	 *         description: Lesson data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/LessonDTO'
	 *       204:
	 *         description: No lesson found
	 *       404:
	 *         description: Module not found
	 */
	async getLessonByModule(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const moduleId = parseInt(req.params.moduleId, 10);
			const lesson = await lessonsService.getLessonByModule(moduleId);
			
			if (!lesson) {
				res.status(204).send();
				return;
			}
			
			res.status(200).json(lesson);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/modules/{moduleId}/lesson:
	 *   post:
	 *     tags: [Lessons]
	 *     summary: Create a lesson (admin only)
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: moduleId
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
	 *               - title
	 *               - text
	 *             properties:
	 *               title:
	 *                 type: string
	 *               text:
	 *                 type: string
	 *     responses:
	 *       201:
	 *         description: Lesson created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/LessonDTO'
	 *       400:
	 *         description: Lesson already exists
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Module not found
	 */
	async createLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const moduleId = parseInt(req.params.moduleId, 10);
			const { title, text } = req.body;
			const lesson = await lessonsService.createLesson(moduleId, title, text);
			res.status(201).json(lesson);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/modules/{moduleId}/lesson:
	 *   put:
	 *     tags: [Lessons]
	 *     summary: Update a lesson (admin only)
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: moduleId
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
	 *               title:
	 *                 type: string
	 *               text:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: Lesson updated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/LessonDTO'
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Module or lesson not found
	 */
	async updateLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const moduleId = parseInt(req.params.moduleId, 10);
			const { title, text } = req.body;
			const lesson = await lessonsService.updateLesson(moduleId, { title, text });
			res.status(200).json(lesson);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/modules/{moduleId}/lesson:
	 *   delete:
	 *     tags: [Lessons]
	 *     summary: Delete a lesson (admin only)
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: moduleId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       204:
	 *         description: Lesson deleted successfully
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Module or lesson not found
	 */
	async deleteLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const moduleId = parseInt(req.params.moduleId, 10);
			await lessonsService.deleteLesson(moduleId);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}
}

export default new LessonsController();
