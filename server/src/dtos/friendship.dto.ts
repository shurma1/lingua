import type { Friends } from '../models/entities/Friends';

/**
 * @openapi
 * components:
 *   schemas:
 *     FriendshipDTO:
 *       type: object
 *       required:
 *         - id
 *         - user1Id
 *         - user2Id
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *           description: Friendship ID
 *           example: 1
 *         user1Id:
 *           type: integer
 *           description: First user ID
 *           example: 1
 *         user2Id:
 *           type: integer
 *           description: Second user ID
 *           example: 2
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *           example: 2024-01-01T00:00:00.000Z
 */
export class FriendshipDTO {
	id: number;
	user1Id: number;
	user2Id: number;
	createdAt: Date;

	constructor(friendship: Friends) {
		this.id = friendship.id;
		this.user1Id = friendship.user1Id;
		this.user2Id = friendship.user2Id;
		this.createdAt = friendship.createdAt;
	}

	static fromFriendship(friendship: Friends): FriendshipDTO {
		return new FriendshipDTO(friendship);
	}
}
