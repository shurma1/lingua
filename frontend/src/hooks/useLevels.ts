import { useState, useCallback } from "react";

import { useAuthStore } from "@store/authStore";
import { useLevelsStore } from "@store/levelsStore";

import { apiClient } from "@/http";
import { LevelDTO, CreateLevelRequestDTO, UpdateLevelRequestDTO, SubmitLevelResponseDTO } from "@/types/api";

export const useLevels = () => {
	const { levels, currentLevelId, isLoading, error } = useLevelsStore();
	
	return {
		levels,
		currentLevelId,
		isLoading,
		error,
	};
};

export const useLevelsMutations = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setLevels, addLevel, updateLevel, removeLevel } = useLevelsStore();

	const fetchLevelsByModule = useCallback(async (moduleId: number) => {
		setIsLoading(true);
		setError(null);
		useLevelsStore.getState().setLoading(true);
		try {
			const levels: LevelDTO[] = await apiClient.levels.getLevelsByModule(moduleId);
			setLevels(levels);
			return levels;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch levels";
			setError(errorMessage);
			useLevelsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
			useLevelsStore.getState().setLoading(false);
		}
	}, [setLevels]);

	const fetchLevelById = useCallback(async (levelId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			const level: LevelDTO = await apiClient.levels.getLevelById(levelId);
			return level;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch level";
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createLevel = useCallback(async (data: CreateLevelRequestDTO) => {
		setIsLoading(true);
		setError(null);
		try {
			const level: LevelDTO = await apiClient.levels.createLevel(data);
			addLevel(level);
			return level;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to create level";
			setError(errorMessage);
			useLevelsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [addLevel]);

	const updateLevelById = useCallback(async (levelId: number, data: UpdateLevelRequestDTO) => {
		setIsLoading(true);
		setError(null);
		try {
			const level: LevelDTO = await apiClient.levels.updateLevel(levelId, data);
			updateLevel(levelId, level);
			return level;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to update level";
			setError(errorMessage);
			useLevelsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [updateLevel]);

	const deleteLevel = useCallback(async (levelId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			await apiClient.levels.deleteLevel(levelId);
			removeLevel(levelId);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete level";
			setError(errorMessage);
			useLevelsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [removeLevel]);

	const submitLevel = useCallback(async (levelId: number, score: number) => {
		setIsLoading(true);
		setError(null);
		try {
			const response: SubmitLevelResponseDTO = await apiClient.levels.submitLevel(levelId, score);
			
			// Update user stats - server returns already updated values
			const currentUser = useAuthStore.getState().user;
			if (currentUser) {
				useAuthStore.getState().updateUser({
					...currentUser,
					stars: response.stars,
					exp: response.exp,
				});
			}
			
			// Update level progress in the store to unlock next level immediately
			const currentLevel = useLevelsStore.getState().levels.find(l => l.id === levelId);
			if (currentLevel) {
				useLevelsStore.getState().updateLevelProgress(levelId, {
					questsCount: currentLevel.questsCount,
					score: score,
				});
			}
			
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to submit level";
			setError(errorMessage);
			useLevelsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []); // Empty dependency array since we use getState()

	return {
		fetchLevelsByModule,
		fetchLevelById,
		createLevel,
		updateLevelById,
		deleteLevel,
		submitLevel,
		isLoading,
		error,
	};
};
