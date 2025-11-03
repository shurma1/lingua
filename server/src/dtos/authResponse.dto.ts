import type { UserDTO } from './user.dto';

export class AuthResponseDTO {
	accessToken: string;
	refreshToken: string;
	user: UserDTO;

	constructor(accessToken: string, refreshToken: string, user: UserDTO) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.user = user;
	}
}
