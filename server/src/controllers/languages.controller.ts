import type { Request, Response, NextFunction } from 'express';
import languagesService from '../services/languages.service';

/**
 * @openapi
 * tags:
 *   - name: Languages
 *     description: Language management endpoints
 */
class LanguagesController {
	/**
	 * @openapi
	 * /api/languages:
	 *   get:
	 *     tags: [Languages]
	 *     summary: Get all languages
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: List of languages
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/LanguageDTO'
	 */
	async getAllLanguages(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const languages = await languagesService.getAllLanguages();
			res.status(200).json(languages);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/languages/{languageId}:
	 *   get:
	 *     tags: [Languages]
	 *     summary: Get language by ID
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: languageId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       200:
	 *         description: Language data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/LanguageDTO'
	 *       404:
	 *         description: Language not found
	 */
	async getLanguageById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const languageId = parseInt(req.params.languageId, 10);
			const language = await languagesService.getLanguageById(languageId);
			res.status(200).json(language);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/languages:
	 *   post:
	 *     tags: [Languages]
	 *     summary: Create a language (admin only)
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - name
	 *             properties:
	 *               name:
	 *                 type: string
	 *               icon:
	 *                 type: string
	 *     responses:
	 *       201:
	 *         description: Language created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/LanguageDTO'
	 *       400:
	 *         description: Language already exists
	 *       403:
	 *         description: Admin access required
	 */
	async createLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { name, icon } = req.body;
			const language = await languagesService.createLanguage(name, icon);
			res.status(201).json(language);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/languages/{languageId}:
	 *   put:
	 *     tags: [Languages]
	 *     summary: Update a language (admin only)
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: languageId
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
	 *               name:
	 *                 type: string
	 *               icon:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: Language updated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/LanguageDTO'
	 *       400:
	 *         description: Language name already exists
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Language not found
	 */
	async updateLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const languageId = parseInt(req.params.languageId, 10);
			const { name, icon } = req.body;
			const language = await languagesService.updateLanguage(languageId, { name, icon });
			res.status(200).json(language);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/languages/{languageId}:
	 *   delete:
	 *     tags: [Languages]
	 *     summary: Delete a language (admin only)
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: languageId
	 *         required: true
	 *         schema:
	 *           type: integer
	 *     responses:
	 *       204:
	 *         description: Language deleted successfully
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Language not found
	 */
	async deleteLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const languageId = parseInt(req.params.languageId, 10);
			await languagesService.deleteLanguage(languageId);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}
}

export default new LanguagesController();
