import type { FriendInvite } from '../models/entities/FriendInvite';

/**
 * @openapi
 * components:
 *   schemas:
 *     FriendInviteDTO:
 *       type: object
 *       required:
 *         - inviteId
 *         - userId
 *         - createdAt
 *       properties:
 *         inviteId:
 *           type: integer
 *           description: Invite ID
 *           example: 123
 *         userId:
 *           type: integer
 *           description: User ID who created the invite
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *           example: 2024-01-01T00:00:00.000Z
 */
export class FriendInviteDTO {
	inviteId: number;
	userId: number;
	createdAt: Date;

	constructor(invite: FriendInvite) {
		this.inviteId = invite.id;
		this.userId = invite.userId;
		this.createdAt = invite.createdAt;
	}

	static fromInvite(invite: FriendInvite): FriendInviteDTO {
		return new FriendInviteDTO(invite);
	}
}
