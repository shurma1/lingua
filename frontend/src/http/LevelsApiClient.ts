import {
	LevelDTO,
	CreateLevelRequestDTO,
	UpdateLevelRequestDTO,
	SubmitLevelRequestDTO,
	SubmitLevelResponseDTO,
} from "@/types/api";

import { BaseApiClient } from "./BaseApiClient";

export class LevelsApiClient extends BaseApiClient {
	async getLevelsByModule(moduleId: number): Promise<LevelDTO[]> {
		return this.get<LevelDTO[]>(`/api/modules/${moduleId}/levels`);
	}

	async getLevelById(levelId: number): Promise<LevelDTO> {
		return this.get<LevelDTO>(`/api/levels/${levelId}`);
	}

	async createLevel(data: CreateLevelRequestDTO): Promise<LevelDTO> {
		return this.post<LevelDTO, CreateLevelRequestDTO>("/api/levels", data);
	}

	async updateLevel(levelId: number, data: UpdateLevelRequestDTO): Promise<LevelDTO> {
		return this.put<LevelDTO, UpdateLevelRequestDTO>(`/api/levels/${levelId}`, data);
	}

	async deleteLevel(levelId: number): Promise<void> {
		return this.delete<void>(`/api/levels/${levelId}`);
	}

	async submitLevel(levelId: number, score: number): Promise<SubmitLevelResponseDTO> {
		const requestData: SubmitLevelRequestDTO = { score };
		return this.post<SubmitLevelResponseDTO, SubmitLevelRequestDTO>(
			`/api/levels/${levelId}/submit`,
			requestData,
		);
	}
}
