import { Module } from '../models/entities/Module';
import { Language } from '../models/entities/Language';
import { ApiError } from '../error/apiError';
import { ModuleDTO } from '../dtos';

class ModulesService {
	/**
	 * Get modules by language
	 */
	async getModulesByLanguage(languageId: number): Promise<ModuleDTO[]> {
		const language = await Language.findByPk(languageId);
		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		const modules = await Module.findAll({
			where: { languageId },
			order: [['id', 'ASC']]
		});

		return modules.map(mod => ModuleDTO.fromModule(mod));
	}

	/**
	 * Get module by ID
	 */
	async getModuleById(moduleId: number): Promise<ModuleDTO> {
		const module = await Module.findByPk(moduleId);
		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		return ModuleDTO.fromModule(module);
	}

	/**
	 * Create a new module (admin only)
	 */
	async createModule(languageId: number, name: string, icon?: string): Promise<ModuleDTO> {
		const language = await Language.findByPk(languageId);
		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		// Check if module already exists for this language
		const existing = await Module.findOne({
			where: { languageId, name }
		});

		if (existing) {
			throw ApiError.errorByType('MODULE_ALREADY_EXISTS');
		}

		const module = await Module.create({
			languageId,
			name,
			icon: icon || null
		});

		return ModuleDTO.fromModule(module);
	}

	/**
	 * Update a module (admin only)
	 */
	async updateModule(
		moduleId: number, 
		updates: { name?: string; icon?: string }
	): Promise<ModuleDTO> {
		const module = await Module.findByPk(moduleId);
		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		// Check for name conflict within same language
		if (updates.name && updates.name !== module.name) {
			const existing = await Module.findOne({
				where: {
					languageId: module.languageId,
					name: updates.name
				}
			});

			if (existing) {
				throw ApiError.errorByType('MODULE_ALREADY_EXISTS');
			}

			module.name = updates.name;
		}

		if (updates.icon !== undefined) {
			module.icon = updates.icon || null;
		}

		await module.save();

		return ModuleDTO.fromModule(module);
	}

	/**
	 * Delete a module (admin only)
	 */
	async deleteModule(moduleId: number): Promise<void> {
		const module = await Module.findByPk(moduleId);
		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		await module.destroy();
	}
}

export default new ModulesService();
