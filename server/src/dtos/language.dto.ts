import type { Language } from '../models/entities/Language';

/**
 * @openapi
 * components:
 *   schemas:
 *     LanguageDTO:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Language ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Language name
 *           example: English
 *         icon:
 *           type: string
 *           description: Language icon URL
 *           example: /icons/en.png
 */
export class LanguageDTO {
	id: number;
	name: string;
	icon?: string;

	constructor(language: Language) {
		this.id = language.id;
		this.name = language.name;
		this.icon = language.icon || undefined;
	}

	static fromLanguage(language: Language): LanguageDTO {
		return new LanguageDTO(language);
	}
}
