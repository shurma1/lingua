import type { User } from '../models/entities/User';

/**
 * @openapi
 * components:
 *   schemas:
 *     FriendDTO:
 *       type: object
 *       required:
 *         - userId
 *         - username
 *         - stars
 *         - exp
 *       properties:
 *         userId:
 *           type: integer
 *           description: User ID
 *           example: 1
 *         username:
 *           type: string
 *           description: Username
 *           example: john_doe
 *         firstName:
 *           type: string
 *           description: First name
 *           example: John
 *         lastName:
 *           type: string
 *           description: Last name
 *           example: Doe
 *         photoUrl:
 *           type: string
 *           description: Photo URL
 *           example: https://example.com/photo.jpg
 *         stars:
 *           type: integer
 *           description: Stars earned
 *           example: 150
 *         exp:
 *           type: integer
 *           description: Experience points
 *           example: 750
 */
export class FriendDTO {
	userId: number;
	username: string;
	firstName?: string;
	lastName?: string;
	photoUrl?: string;
	stars: number;
	exp: number;

	constructor(user: User) {
		this.userId = user.id;
		this.username = user.username;
		this.firstName = user.firstName || undefined;
		this.lastName = user.lastName || undefined;
		this.photoUrl = user.photoUrl || undefined;
		this.stars = user.stars;
		this.exp = user.exp;
	}

	static fromUser(user: User): FriendDTO {
		return new FriendDTO(user);
	}
}
