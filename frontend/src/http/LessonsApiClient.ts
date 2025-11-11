import {
	LessonDTO,
	CreateLessonRequestDTO,
	UpdateLessonRequestDTO,
} from "@/types/api";

import { BaseApiClient } from "./BaseApiClient";

export class LessonsApiClient extends BaseApiClient {
	async getModuleLesson(moduleId: number): Promise<LessonDTO | null> {
		try {
			return await this.get<LessonDTO>(`/api/modules/${moduleId}/lesson`);
		} catch (error: unknown) {
			if (error && typeof error === "object" && "response" in error) {
				const axiosError = error as { response?: { status?: number } };
				if (axiosError.response?.status === 204) {
					return null;
				}
			}
			throw error;
		}
	}

	async createLesson(moduleId: number, data: CreateLessonRequestDTO): Promise<LessonDTO> {
		return this.post<LessonDTO, CreateLessonRequestDTO>(
			`/api/modules/${moduleId}/lesson`,
			data,
		);
	}

	async updateLesson(moduleId: number, data: UpdateLessonRequestDTO): Promise<LessonDTO> {
		return this.put<LessonDTO, UpdateLessonRequestDTO>(
			`/api/modules/${moduleId}/lesson`,
			data,
		);
	}

	async deleteLesson(moduleId: number): Promise<void> {
		return this.delete<void>(`/api/modules/${moduleId}/lesson`);
	}
}
