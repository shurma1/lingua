import type { LeaderboardEntry } from '../types/leaderboard';

/**
 * @openapi
 * components:
 *   schemas:
 *     LeaderboardEntryDTO:
 *       type: object
 *       required:
 *         - position
 *         - userId
 *         - username
 *         - stars
 *       properties:
 *         position:
 *           type: integer
 *           description: Position in leaderboard
 *           example: 1
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
 *           example: 500
 *     LeaderboardDTO:
 *       type: object
 *       required:
 *         - leaders
 *         - currentUser
 *       properties:
 *         leaders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LeaderboardEntryDTO'
 *         currentUser:
 *           $ref: '#/components/schemas/LeaderboardEntryDTO'
 */
export class LeaderboardEntryDTO {
	position: number;
	userId: number;
	username: string;
	firstName?: string;
	lastName?: string;
	photoUrl?: string;
	stars: number;

	constructor(entry: LeaderboardEntry) {
		this.position = entry.position;
		this.userId = entry.userId;
		this.username = entry.username;
		this.firstName = entry.firstName;
		this.lastName = entry.lastName;
		this.photoUrl = entry.photoUrl;
		this.stars = entry.stars;
	}

	static fromEntry(entry: LeaderboardEntry): LeaderboardEntryDTO {
		return new LeaderboardEntryDTO(entry);
	}
}

export class LeaderboardDTO {
	leaders: LeaderboardEntryDTO[];
	currentUser: LeaderboardEntryDTO;

	constructor(leaders: LeaderboardEntry[], currentUser: LeaderboardEntry) {
		this.leaders = leaders.map(entry => new LeaderboardEntryDTO(entry));
		this.currentUser = new LeaderboardEntryDTO(currentUser);
	}
}
