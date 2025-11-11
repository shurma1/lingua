import { Op } from 'sequelize';
import { Friends } from '../models/entities/Friends';
import { FriendInvite } from '../models/entities/FriendInvite';
import { User } from '../models/entities/User';
import { ApiError } from '../error/apiError';
import { FriendDTO, FriendshipDTO, FriendInviteDTO } from '../dtos';

class FriendsService {
	/**
	 * Get list of friends for a user
	 */
	async getFriends(userId: number): Promise<FriendDTO[]> {
		const friendships = await Friends.findAll({
			where: {
				[Op.or]: [
					{ user1Id: userId },
					{ user2Id: userId }
				]
			}
		});

		if (friendships.length === 0) {
			return [];
		}

		// Extract friend IDs
		const friendIds = friendships.map(f => 
			f.user1Id === userId ? f.user2Id : f.user1Id
		);

		// Fetch friend users
		const friends = await User.findAll({
			where: {
				id: {
					[Op.in]: friendIds
				}
			}
		});

		return friends.map(friend => FriendDTO.fromUser(friend));
	}

	/**
	 * Remove a friend
	 */
	async removeFriend(userId: number, friendId: number): Promise<void> {
		const friendship = await Friends.findOne({
			where: {
				[Op.or]: [
					{ user1Id: userId, user2Id: friendId },
					{ user1Id: friendId, user2Id: userId }
				]
			}
		});

		if (!friendship) {
			throw ApiError.errorByType('FRIEND_NOT_FOUND');
		}

		await friendship.destroy();
	}

	/**
	 * Create a friend invite
	 */
	async createInvite(userId: number): Promise<FriendInviteDTO> {
		const invite = await FriendInvite.create({
			userId
		});

		return FriendInviteDTO.fromInvite(invite);
	}

	/**
	 * Accept a friend invite
	 */
	async acceptInvite(inviteId: number, userId: number): Promise<FriendshipDTO> {
		const invite = await FriendInvite.findByPk(inviteId);

		if (!invite) {
			throw ApiError.errorByType('INVITE_NOT_FOUND');
		}

		if (invite.userId === userId) {
			throw ApiError.errorByType('CANNOT_ACCEPT_OWN_INVITE');
		}

		// Check if already friends
		const existingFriendship = await Friends.findOne({
			where: {
				[Op.or]: [
					{ user1Id: userId, user2Id: invite.userId },
					{ user1Id: invite.userId, user2Id: userId }
				]
			}
		});

		if (existingFriendship) {
			throw ApiError.errorByType('ALREADY_FRIENDS');
		}

		// Create friendship with user1Id < user2Id
		const [user1Id, user2Id] = userId < invite.userId 
			? [userId, invite.userId] 
			: [invite.userId, userId];

		const friendship = await Friends.create({
			user1Id,
			user2Id
		});

		// Delete the invite
		await invite.destroy();

		return FriendshipDTO.fromFriendship(friendship);
	}
}

export default new FriendsService();
