import { useState, useCallback } from "react";

import { useLessonsStore } from "@store/lessonsStore";

import { apiClient } from "@/http";
import { LessonDTO, CreateLessonRequestDTO, UpdateLessonRequestDTO } from "@/types/api";

export const useLessons = () => {
	const { lessonsByModule, isLoading, error } = useLessonsStore();
	
	return {
		lessonsByModule,
		isLoading,
		error,
	};
};

export const useLessonsMutations = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setLesson, removeLesson } = useLessonsStore();

	const fetchModuleLesson = useCallback(async (moduleId: number) => {
		setIsLoading(true);
		setError(null);
		useLessonsStore.getState().setLoading(true);
		try {
			const lesson: LessonDTO | null = await apiClient.lessons.getModuleLesson(moduleId);
			if (lesson) {
				setLesson(moduleId, lesson);
			}
			return lesson;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch lesson";
			setError(errorMessage);
			useLessonsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
			useLessonsStore.getState().setLoading(false);
		}
	}, [setLesson]);

	const createLesson = useCallback(async (moduleId: number, data: CreateLessonRequestDTO) => {
		setIsLoading(true);
		setError(null);
		try {
			const lesson: LessonDTO = await apiClient.lessons.createLesson(moduleId, data);
			setLesson(moduleId, lesson);
			return lesson;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to create lesson";
			setError(errorMessage);
			useLessonsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [setLesson]);

	const updateLesson = useCallback(async (moduleId: number, data: UpdateLessonRequestDTO) => {
		setIsLoading(true);
		setError(null);
		try {
			const lesson: LessonDTO = await apiClient.lessons.updateLesson(moduleId, data);
			setLesson(moduleId, lesson);
			return lesson;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to update lesson";
			setError(errorMessage);
			useLessonsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [setLesson]);

	const deleteLesson = useCallback(async (moduleId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			await apiClient.lessons.deleteLesson(moduleId);
			removeLesson(moduleId);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete lesson";
			setError(errorMessage);
			useLessonsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [removeLesson]);

	return {
		fetchModuleLesson,
		createLesson,
		updateLesson,
		deleteLesson,
		isLoading,
		error,
	};
};
