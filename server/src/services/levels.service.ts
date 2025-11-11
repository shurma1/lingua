import { Level } from '../models/entities/Level';
import { Module } from '../models/entities/Module';
import { UserLevel } from '../models/entities/UserLevel';
import { User } from '../models/entities/User';
import { ApiError } from '../error/apiError';
import { LevelDTO } from '../dtos';

class LevelsService {
	/**
	 * Get levels of a module with user progress
	 */
	async getLevelsByModule(moduleId: number, userId: number): Promise<LevelDTO[]> {
		const module = await Module.findByPk(moduleId);
		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		const levels = await Level.findAll({
			where: { moduleId },
			order: [['id', 'ASC']]
		});

		// Get user progress for these levels
		const levelIds = levels.map(l => l.id);
		const userLevels = await UserLevel.findAll({
			where: {
				userId,
				levelId: levelIds
			}
		});

		// Map user levels by levelId
		const userLevelMap = new Map(
			userLevels.map(ul => [ul.levelId, ul])
		);

		return levels.map(level => 
			LevelDTO.fromLevel(level, userLevelMap.get(level.id))
		);
	}

	/**
	 * Get level by ID
	 */
	async getLevelById(levelId: number): Promise<LevelDTO> {
		const level = await Level.findByPk(levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		return LevelDTO.fromLevel(level);
	}

	/**
	 * Create a new level (admin only)
	 */
	async createLevel(moduleId: number, name: string, questsCount: number): Promise<LevelDTO> {
		const module = await Module.findByPk(moduleId);
		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		const level = await Level.create({
			moduleId,
			name,
			questsCount
		});

		return LevelDTO.fromLevel(level);
	}

	/**
	 * Update a level (admin only)
	 */
	async updateLevel(
		levelId: number, 
		updates: { name?: string; questsCount?: number }
	): Promise<LevelDTO> {
		const level = await Level.findByPk(levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		if (updates.questsCount !== undefined && updates.questsCount < 0) {
			throw ApiError.errorByType('INVALID_QUESTS_COUNT');
		}

		if (updates.name !== undefined) {
			level.name = updates.name;
		}

		if (updates.questsCount !== undefined) {
			level.questsCount = updates.questsCount;
		}

		await level.save();

		return LevelDTO.fromLevel(level);
	}

	/**
	 * Delete a level (admin only)
	 */
	async deleteLevel(levelId: number): Promise<void> {
		const level = await Level.findByPk(levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		await level.destroy();
	}

	/**
	 * Submit level completion result
	 */
	async submitLevel(
		levelId: number, 
		userId: number, 
		score: number
	): Promise<{ stars: number; exp: number }> {
		if (score < 0 || score > 100) {
			throw ApiError.errorByType('INVALID_SCORE');
		}

		const level = await Level.findByPk(levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		// Calculate stars and exp (formula: stars = score / 100)
		const earnedStars = Math.floor(score / 100);
		const earnedExp = score;

		// Update or create UserLevel
		const [userLevel] = await UserLevel.findOrCreate({
			where: {
				userId,
				levelId
			},
			defaults: {
				userId,
				levelId,
				questsCount: 1,
				score
			}
		});

		if (!userLevel.isNewRecord) {
			userLevel.questsCount += 1;
			userLevel.score += score;
			await userLevel.save();
		}

		// Update user stars and exp
		const user = await User.findByPk(userId);
		if (user) {
			user.stars += earnedStars;
			user.exp += earnedExp;
			await user.save();

			return {
				stars: user.stars,
				exp: user.exp
			};
		}

		return { stars: earnedStars, exp: earnedExp };
	}
}

export default new LevelsService();
