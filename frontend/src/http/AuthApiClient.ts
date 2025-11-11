import { AuthResponseDTO, AuthRequestDTO, UserDTO } from "@/types/api";

import { BaseApiClient } from "./BaseApiClient";

export class AuthApiClient extends BaseApiClient {
	async authenticate(initData: string): Promise<AuthResponseDTO> {
		const requestData: AuthRequestDTO = { initData };
		return this.post<AuthResponseDTO, AuthRequestDTO>("/api/auth", requestData);
	}

	async getMe(): Promise<UserDTO> {
		return this.get<UserDTO>("/api/auth/me");
	}
}
