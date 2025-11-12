import type { Level } from '../models/entities/Level';
import type { UserLevel } from '../models/entities/UserLevel';

/**
 * @openapi
 * components:
 *   schemas:
 *     UserProgressDTO:
 *       type: object
 *       required:
 *         - questsCount
 *         - score
 *       properties:
 *         questsCount:
 *           type: integer
 *           description: Number of quests completed
 *           example: 5
 *         score:
 *           type: integer
 *           description: Total score achieved
 *           example: 450
 *     LevelDTO:
 *       type: object
 *       required:
 *         - id
 *         - moduleId
 *         - icon
 *         - questsCount
 *       properties:
 *         id:
 *           type: integer
 *           description: Level ID
 *           example: 1
 *         moduleId:
 *           type: integer
 *           description: Module ID
 *           example: 1
 *         icon:
 *           type: string
 *           description: Level icon
 *           example: "🎯"
 *         questsCount:
 *           type: integer
 *           description: Total number of quests in level
 *           example: 10
 *         userProgress:
 *           allOf:
 *             - $ref: '#/components/schemas/UserProgressDTO'
 *           nullable: true
 */
export class UserProgressDTO {
	questsCount: number;
	score: number;

	constructor(userLevel: UserLevel) {
		this.questsCount = userLevel.questsCount;
		this.score = userLevel.score;
	}
}

export class LevelDTO {
	id: number;
	moduleId: number;
	icon: string;
	questsCount: number;
	userProgress?: UserProgressDTO;

	constructor(level: Level, questsCount: number, userLevel?: UserLevel) {
		this.id = level.id;
		this.moduleId = level.moduleId;
		this.icon = level.icon;
		this.questsCount = questsCount;
		this.userProgress = userLevel ? new UserProgressDTO(userLevel) : undefined;
	}

	static fromLevel(level: Level, questsCount: number, userLevel?: UserLevel): LevelDTO {
		return new LevelDTO(level, questsCount, userLevel);
	}
}
