import {
	LanguageDTO,
	CreateLanguageRequestDTO,
	UpdateLanguageRequestDTO,
} from "@/types/api";

import { BaseApiClient } from "./BaseApiClient";

export class LanguagesApiClient extends BaseApiClient {
	async getLanguages(): Promise<LanguageDTO[]> {
		return this.get<LanguageDTO[]>("/api/languages");
	}

	async getLanguageById(languageId: number): Promise<LanguageDTO> {
		return this.get<LanguageDTO>(`/api/languages/${languageId}`);
	}

	async createLanguage(data: CreateLanguageRequestDTO): Promise<LanguageDTO> {
		return this.post<LanguageDTO, CreateLanguageRequestDTO>("/api/languages", data);
	}

	async updateLanguage(languageId: number, data: UpdateLanguageRequestDTO): Promise<LanguageDTO> {
		return this.put<LanguageDTO, UpdateLanguageRequestDTO>(`/api/languages/${languageId}`, data);
	}

	async deleteLanguage(languageId: number): Promise<void> {
		return this.delete<void>(`/api/languages/${languageId}`);
	}
}
