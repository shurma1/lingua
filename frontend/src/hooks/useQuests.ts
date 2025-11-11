import { useState, useCallback } from "react";
import { useQuestsStore } from "@store/questsStore";
import { apiClient } from "@/http";
import { QuestDTO, CreateQuestRequestDTO } from "@/types/api";

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
	const { setQuests, addQuest, updateQuest, removeQuest } = useQuestsStore();

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

	const fetchQuestById = useCallback(async (questId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			const quest: QuestDTO = await apiClient.quests.getQuestById(questId);
			updateQuest(questId, quest);
			return quest;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch quest";
			setError(errorMessage);
			useQuestsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [updateQuest]);

	const createQuest = useCallback(async (data: CreateQuestRequestDTO) => {
		setIsLoading(true);
		setError(null);
		try {
			const quest: QuestDTO = await apiClient.quests.createQuest(data);
			addQuest(quest);
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
