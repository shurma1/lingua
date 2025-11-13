import { useState, useCallback } from "react";

import { useQuestsStore } from "@store/questsStore";

import { apiClient } from "@/http";
import { QuestDTO, QuestFullDTO, CreateQuestRequestDTO } from "@/types/api";

export const useQuests = () => {
	const { quests, currentQuestId, isLoading, error } = useQuestsStore();
	
	return {
		quests,
		currentQuestId,
		isLoading,
		error,
	};
};

export const useQuestsMutations = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setQuests, addQuest, removeQuest } = useQuestsStore();

	const fetchQuestsByLevel = useCallback(async (levelId: number) => {
		setIsLoading(true);
		setError(null);
		useQuestsStore.getState().setLoading(true);
		try {
			const quests: QuestDTO[] = await apiClient.quests.getQuestsByLevel(levelId);
			setQuests(quests);
			return quests;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch quests";
			setError(errorMessage);
			useQuestsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
			useQuestsStore.getState().setLoading(false);
		}
	}, [setQuests]);

	const fetchQuestById = useCallback(async (questId: number): Promise<QuestFullDTO> => {
		setIsLoading(true);
		setError(null);
		try {
			const quest: QuestFullDTO = await apiClient.quests.getQuestById(questId);
			// Note: This returns full quest data, not stored in lightweight list
			return quest;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch quest";
			setError(errorMessage);
			useQuestsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createQuest = useCallback(async (data: CreateQuestRequestDTO): Promise<QuestFullDTO> => {
		setIsLoading(true);
		setError(null);
		try {
			const quest: QuestFullDTO = await apiClient.quests.createQuest(data);
			// Add lightweight version to the list
			const lightweightQuest: QuestDTO = {
				id: Number(quest.id),
				type: quest.type,
				levelId: Number(quest.levelId),
			};
			addQuest(lightweightQuest);
			return quest;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to create quest";
			setError(errorMessage);
			useQuestsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [addQuest]);

	const deleteQuest = useCallback(async (questId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			await apiClient.quests.deleteQuest(questId);
			removeQuest(questId);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete quest";
			setError(errorMessage);
			useQuestsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [removeQuest]);

	return {
		fetchQuestsByLevel,
		fetchQuestById,
		createQuest,
		deleteQuest,
		isLoading,
		error,
	};
};
