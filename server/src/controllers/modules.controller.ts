import type { Request, Response, NextFunction } from 'express';
import modulesService from '../services/modules.service';

/**
 * @openapi
 * tags:
 *   - name: Modules
 *     description: Module management endpoints
 */
class ModulesController {
	/**
	 * @openapi
	 * /api/languages/{languageId}/modules:
	 *   get:
	 *     tags: [Modules]
	 *     summary: Get modules by language
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
	 *         description: List of modules
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/ModuleDTO'
	 *       404:
	 *         description: Language not found
	 */
	async getModulesByLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const languageId = parseInt(req.params.languageId, 10);
			const modules = await modulesService.getModulesByLanguage(languageId);
			res.status(200).json(modules);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/modules/{moduleId}:
	 *   get:
	 *     tags: [Modules]
	 *     summary: Get module by ID
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
	 *         description: Module data
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ModuleDTO'
	 *       404:
	 *         description: Module not found
	 */
	async getModuleById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const moduleId = parseInt(req.params.moduleId, 10);
			const module = await modulesService.getModuleById(moduleId);
			res.status(200).json(module);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/modules:
	 *   post:
	 *     tags: [Modules]
	 *     summary: Create a module (admin only)
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
	 *               - name
	 *             properties:
	 *               languageId:
	 *                 type: integer
	 *               name:
	 *                 type: string
	 *               icon:
	 *                 type: string
	 *     responses:
	 *       201:
	 *         description: Module created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ModuleDTO'
	 *       400:
	 *         description: Module already exists
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Language not found
	 */
	async createModule(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { languageId, name, icon } = req.body;
			const module = await modulesService.createModule(languageId, name, icon);
			res.status(201).json(module);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/modules/{moduleId}:
	 *   put:
	 *     tags: [Modules]
	 *     summary: Update a module (admin only)
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
	 *               name:
	 *                 type: string
	 *               icon:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: Module updated successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/ModuleDTO'
	 *       400:
	 *         description: Module name already exists
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Module not found
	 */
	async updateModule(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const moduleId = parseInt(req.params.moduleId, 10);
			const { name, icon } = req.body;
			const module = await modulesService.updateModule(moduleId, { name, icon });
			res.status(200).json(module);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @openapi
	 * /api/modules/{moduleId}:
	 *   delete:
	 *     tags: [Modules]
	 *     summary: Delete a module (admin only)
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
	 *         description: Module deleted successfully
	 *       403:
	 *         description: Admin access required
	 *       404:
	 *         description: Module not found
	 */
	async deleteModule(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const moduleId = parseInt(req.params.moduleId, 10);
			await modulesService.deleteModule(moduleId);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}
}

export default new ModulesController();
