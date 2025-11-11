import { Op } from 'sequelize';
import { User } from '../models/entities/User';
import { Friends } from '../models/entities/Friends';
import { ApiError } from '../error/apiError';
import type { LeaderboardType, LeaderboardEntry } from '../types/leaderboard';
import { LeaderboardDTO } from '../dtos';

class StatsService {
	/**
	 * Get leaderboard
	 */
	async getLeaderboard(userId: number, type: LeaderboardType): Promise<LeaderboardDTO> {
		if (type !== 'all' && type !== 'friends') {
			throw ApiError.errorByType('INVALID_LEADERBOARD_TYPE');
		}

		let userIds: number[] = [];

		if (type === 'friends') {
			// Get friend IDs
			const friendships = await Friends.findAll({
				where: {
					[Op.or]: [
						{ user1Id: userId },
						{ user2Id: userId }
					]
				}
			});

			userIds = friendships.map(f => 
				f.user1Id === userId ? f.user2Id : f.user1Id
			);

			// Include current user
			userIds.push(userId);
		}

		// Build query
		const where = type === 'friends' && userIds.length > 0
			? { id: { [Op.in]: userIds } }
			: {};

		const users = await User.findAll({
			where,
			order: [['stars', 'DESC']],
			attributes: ['id', 'username', 'firstName', 'lastName', 'photoUrl', 'stars']
		});

		// Build leaderboard entries
		const entries: LeaderboardEntry[] = users.map((user, index) => ({
			position: index + 1,
			userId: user.id,
			username: user.username,
			firstName: user.firstName || undefined,
			lastName: user.lastName || undefined,
			photoUrl: user.photoUrl || undefined,
			stars: user.stars
		}));

		// Find current user in leaderboard
		let currentUserEntry = entries.find(e => e.userId === userId);

		// If friends leaderboard and user has no friends, return special case
		if (type === 'friends' && userIds.length === 1) {
			// Only current user
			currentUserEntry = {
				position: 1,
				userId,
				username: '',
				stars: 0
			};

			const currentUser = await User.findByPk(userId);
			if (currentUser) {
				currentUserEntry.username = currentUser.username;
				currentUserEntry.firstName = currentUser.firstName || undefined;
				currentUserEntry.lastName = currentUser.lastName || undefined;
				currentUserEntry.photoUrl = currentUser.photoUrl || undefined;
				currentUserEntry.stars = currentUser.stars;
			}

			return new LeaderboardDTO([], currentUserEntry);
		}

		if (!currentUserEntry) {
			// User not found in leaderboard (shouldn't happen)
			const currentUser = await User.findByPk(userId);
			if (!currentUser) {
				throw ApiError.errorByType('USER_NOT_FOUND');
			}

			currentUserEntry = {
				position: entries.length + 1,
				userId: currentUser.id,
				username: currentUser.username,
				firstName: currentUser.firstName || undefined,
				lastName: currentUser.lastName || undefined,
				photoUrl: currentUser.photoUrl || undefined,
				stars: currentUser.stars
			};
		}

		return new LeaderboardDTO(entries, currentUserEntry);
	}
}

export default new StatsService();
