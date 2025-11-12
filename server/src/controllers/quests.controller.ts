import type { Request, Response, NextFunction } from 'express';
import questsService from '../services/quests.service';
import type { CreateQuestData } from '../types/quest';

/**
 * @openapi
 * tags:
 *   - name: Quests
 *     description: Quest management endpoints
 */
class QuestsController {
	/**
	 * @openapi
	 * /api/levels/{levelId}/quests:
	 *   get:
	 *     tags: [Quests]
	 *     summary: Get quests of a level
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
	 *         description: List of quests
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/QuestDTO'
	 *       404:
	 *         description: Level not found
	 */
	async getQuestsByLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const levelId = parseInt(req.params.levelId, 10);
			const quests = await questsService.getQuestsByLevel(levelId);
			res.status(200).json(quests);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/quests/{questId}:
	 *   get:
	 *     tags: [Quests]
	 *     summary: Get full quest data
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: questId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       200:
	 *         description: Quest data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               oneOf:
	 *                 - $ref: '#/components/schemas/QuestMatchWordsResponse'
	 *                 - $ref: '#/components/schemas/QuestDictationResponse'
	 *                 - $ref: '#/components/schemas/QuestTranslateResponse'
	 *       404:
	 *         description: Quest not found
	 */
	async getQuestById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const questId = parseInt(req.params.questId, 10);
			const quest = await questsService.getQuestById(questId);
			res.status(200).json(quest);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/quests:
	 *   post:
	 *     tags: [Quests]
	 *     summary: Create a quest (admin only)
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             oneOf:
	 *               - type: object
	 *                 required: [type, levelId, data]
	 *                 properties:
	 *                   type:
	 *                     type: string
	 *                     enum: [MATCH_WORDS]
	 *                   levelId:
	 *                     type: integer
	 *                     example: 1
	 *                   data:
	 *                     type: array
	 *                     items:
	 *                       type: object
	 *                       required: [word, translate]
	 *                       properties:
	 *                         word:
	 *                           type: string
	 *                           example: Привет
	 *                         translate:
	 *                           type: string
	 *                           example: Hello
	 *               - type: object
	 *                 required: [type, levelId, correctSentence]
	 *                 properties:
	 *                   type:
	 *                     type: string
	 *                     enum: [DICTATION]
	 *                   levelId:
	 *                     type: integer
	 *                     example: 1
	 *                   correctSentence:
	 *                     type: string
	 *                     example: Any sentence
	 *                   distractorWords:
	 *                     type: array
	 *                     items:
	 *                       type: string
	 *                     example: [word3, word4]
	 *               - type: object
	 *                 required: [type, levelId, sourceSentence, correctSentence]
	 *                 properties:
	 *                   type:
	 *                     type: string
	 *                     enum: [TRANSLATE]
	 *                   levelId:
	 *                     type: integer
	 *                     example: 1
	 *                   sourceSentence:
	 *                     type: string
	 *                     example: Привет, я стив
	 *                   correctSentence:
	 *                     type: string
	 *                     example: Hello, i am steave
	 *                   distractorWords:
	 *                     type: array
	 *                     items:
	 *                       type: string
	 *                     example: [are, is]
	 *     responses:
	 *       201:
	 *         description: Quest created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               oneOf:
	 *                 - $ref: '#/components/schemas/QuestMatchWordsResponse'
	 *                 - $ref: '#/components/schemas/QuestDictationResponse'
	 *                 - $ref: '#/components/schemas/QuestTranslateResponse'
	 *       400:
	 *         description: Invalid quest type
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Level not found
	 */
	async createQuest(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const questData = req.body as CreateQuestData;
			const quest = await questsService.createQuest(questData);
			res.status(201).json(quest);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/quests/{questId}:
	 *   delete:
	 *     tags: [Quests]
	 *     summary: Delete a quest (admin only)
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: questId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       204:
	 *         description: Quest deleted successfully
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Quest not found
	 */
	async deleteQuest(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const questId = parseInt(req.params.questId, 10);
			await questsService.deleteQuest(questId);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}
}

export default new QuestsController();
