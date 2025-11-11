import { QuestDTO, CreateQuestRequestDTO } from "@/types/api";

import { BaseApiClient } from "./BaseApiClient";

export class QuestsApiClient extends BaseApiClient {
	async getQuestsByLevel(levelId: number): Promise<QuestDTO[]> {
		return this.get<QuestDTO[]>(`/api/levels/${levelId}/quests`);
	}

	async getQuestById(questId: number): Promise<QuestDTO> {
		return this.get<QuestDTO>(`/api/quests/${questId}`);
	}

	async createQuest(data: CreateQuestRequestDTO): Promise<QuestDTO> {
		return this.post<QuestDTO, CreateQuestRequestDTO>("/api/quests", data);
	}

	async deleteQuest(questId: number): Promise<void> {
		return this.delete<void>(`/api/quests/${questId}`);
	}
}
