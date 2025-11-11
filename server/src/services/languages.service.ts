import { Language } from '../models/entities/Language';
import { ApiError } from '../error/apiError';
import { LanguageDTO } from '../dtos';

class LanguagesService {
	/**
	 * Get all languages
	 */
	async getAllLanguages(): Promise<LanguageDTO[]> {
		const languages = await Language.findAll({
			order: [['id', 'ASC']]
		});

		return languages.map(lang => LanguageDTO.fromLanguage(lang));
	}

	/**
	 * Get language by ID
	 */
	async getLanguageById(languageId: number): Promise<LanguageDTO> {
		const language = await Language.findByPk(languageId);
		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		return LanguageDTO.fromLanguage(language);
	}

	/**
	 * Create a new language (admin only)
	 */
	async createLanguage(name: string, icon?: string): Promise<LanguageDTO> {
		// Check if language already exists
		const existing = await Language.findOne({ where: { name } });
		if (existing) {
			throw ApiError.errorByType('LANGUAGE_ALREADY_EXISTS');
		}

		const language = await Language.create({
			name,
			icon: icon || null
		});

		return LanguageDTO.fromLanguage(language);
	}

	/**
	 * Update a language (admin only)
	 */
	async updateLanguage(
		languageId: number, 
		updates: { name?: string; icon?: string }
	): Promise<LanguageDTO> {
		const language = await Language.findByPk(languageId);
		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		// Check for name conflict
		if (updates.name && updates.name !== language.name) {
			const existing = await Language.findOne({ where: { name: updates.name } });
			if (existing) {
				throw ApiError.errorByType('LANGUAGE_ALREADY_EXISTS');
			}
			language.name = updates.name;
		}

		if (updates.icon !== undefined) {
			language.icon = updates.icon || null;
		}

		await language.save();

		return LanguageDTO.fromLanguage(language);
	}

	/**
	 * Delete a language (admin only)
	 */
	async deleteLanguage(languageId: number): Promise<void> {
		const language = await Language.findByPk(languageId);
		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		await language.destroy();
	}
}

export default new LanguagesService();
