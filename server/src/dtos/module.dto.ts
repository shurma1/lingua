import type { Module } from '../models/entities/Module';

/**
 * @openapi
 * components:
 *   schemas:
 *     ModuleDTO:
 *       type: object
 *       required:
 *         - id
 *         - languageId
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Module ID
 *           example: 1
 *         languageId:
 *           type: integer
 *           description: Language ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Module name
 *           example: Basics
 *         icon:
 *           type: string
 *           description: Module icon URL
 *           example: /icons/basics.png
 */
export class ModuleDTO {
	id: number;
	languageId: number;
	name: string;
	icon?: string;

	constructor(module: Module) {
		this.id = module.id;
		this.languageId = module.languageId;
		this.name = module.name;
		this.icon = module.icon || undefined;
	}

	static fromModule(module: Module): ModuleDTO {
		return new ModuleDTO(module);
	}
}
