import type { User } from '../models/entities/User';
import type { UserRole } from '../models/types/UserRole';

export class UserDTO {
	id: number;
	externalId: number;
	username: string;
	firstName?: string;
	lastName?: string;
	photoUrl?: string;
	stars: number;
	exp: number;
	role: UserRole;
	languageId?: number;
	createdAt: Date;
	lastLoginAt?: Date;

	constructor(user: User) {
		this.id = user.id;
		this.externalId = user.maxUserId!;
		this.username = user.username;
		this.firstName = user.firstName || undefined;
		this.lastName = user.lastName || undefined;
		this.photoUrl = user.photoUrl || undefined;
		this.stars = user.stars;
		this.exp = user.exp;
		this.role = user.role;
		this.languageId = user.languageId || undefined;
		this.createdAt = user.createdAt;
		this.lastLoginAt = user.lastLoginAt || undefined;
	}

	static fromUser(user: User): UserDTO {
		return new UserDTO(user);
	}
}
