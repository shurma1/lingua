import { UserDTO, SetLanguageRequestDTO } from "@/types/api";

import { BaseApiClient } from "./BaseApiClient";

export class UserApiClient extends BaseApiClient {
	async getProfile(): Promise<UserDTO> {
		return this.get<UserDTO>("/api/user/profile");
	}

	async setLanguage(languageId: number): Promise<UserDTO> {
		const requestData: SetLanguageRequestDTO = { languageId };
		return this.put<UserDTO, SetLanguageRequestDTO>("/api/user/language", requestData);
	}
}
