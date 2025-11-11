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
 *         - name
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
 *         name:
 *           type: string
 *           description: Level name
 *           example: Level 1
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
	name: string;
	questsCount: number;
	userProgress?: UserProgressDTO;

	constructor(level: Level, userLevel?: UserLevel) {
		this.id = level.id;
		this.moduleId = level.moduleId;
		this.name = level.name;
		this.questsCount = level.questsCount;
		this.userProgress = userLevel ? new UserProgressDTO(userLevel) : undefined;
	}

	static fromLevel(level: Level, userLevel?: UserLevel): LevelDTO {
		return new LevelDTO(level, userLevel);
	}
}
