import { Level } from '../models/entities/Level';
import { Module } from '../models/entities/Module';
import { UserLevel } from '../models/entities/UserLevel';
import { User } from '../models/entities/User';
import { Quest } from '../models/entities/Quest';
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

		// Get quest counts for all levels
		const questCounts = await Quest.findAll({
			attributes: [
				'levelId',
				[Quest.sequelize!.fn('COUNT', Quest.sequelize!.col('id')), 'count']
			],
			where: {
				levelId: levelIds
			},
			group: ['levelId'],
			raw: true
		}) as any[];

		// Map quest counts by levelId
		const questCountMap = new Map(
			questCounts.map(qc => [qc.levelId, parseInt(qc.count, 10)])
		);

		// Map user levels by levelId
		const userLevelMap = new Map(
			userLevels.map(ul => [ul.levelId, ul])
		);

		return levels.map(level => 
			LevelDTO.fromLevel(level, questCountMap.get(level.id) || 0, userLevelMap.get(level.id))
		);
	}

	/**
	 * Get level by ID with user progress
	 */
	async getLevelById(levelId: number, userId?: number): Promise<LevelDTO> {
		const level = await Level.findByPk(levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		// Get quest count for this level
		const questCount = await Quest.count({
			where: { levelId }
		});

		// Get user progress if userId provided
		let userLevel: UserLevel | undefined;
		if (userId) {
			const found = await UserLevel.findOne({
				where: {
					userId,
					levelId
				}
			});
			if (found) {
				userLevel = found;
			}
		}

		return LevelDTO.fromLevel(level, questCount, userLevel);
	}

	/**
	 * Create a new level (admin only)
	 */
	async createLevel(moduleId: number, icon: string): Promise<LevelDTO> {
		const module = await Module.findByPk(moduleId);
		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		const level = await Level.create({
			moduleId,
			icon
		});

		// Admin creates level, no user progress needed
		return LevelDTO.fromLevel(level, 0, undefined);
	}

	/**
	 * Update a level (admin only)
	 */
	async updateLevel(
		levelId: number, 
		updates: { icon?: string; moduleId?: number }
	): Promise<LevelDTO> {
		const level = await Level.findByPk(levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		if (updates.moduleId !== undefined) {
			const module = await Module.findByPk(updates.moduleId);
			if (!module) {
				throw ApiError.errorByType('MODULE_NOT_FOUND');
			}
			level.moduleId = updates.moduleId;
		}

		if (updates.icon !== undefined) {
			level.icon = updates.icon;
		}

		await level.save();

		// Get quest count for this level
		const questCount = await Quest.count({
			where: { levelId }
		});

		// Admin updates level, no user progress needed
		return LevelDTO.fromLevel(level, questCount, undefined);
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
