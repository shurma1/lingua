import { useState, useCallback } from "react";
import { useLanguagesStore } from "@store/languagesStore";
import { apiClient } from "@/http";
import { LanguageDTO, CreateLanguageRequestDTO, UpdateLanguageRequestDTO } from "@/types/api";

export const useLanguages = () => {
	const { languages, selectedLanguageId, isLoading, error } = useLanguagesStore();
	
	return {
		languages,
		selectedLanguageId,
		isLoading,
		error,
	};
};

export const useLanguagesMutations = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setLanguages, addLanguage, updateLanguage, removeLanguage } = useLanguagesStore();

	const fetchLanguages = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		useLanguagesStore.getState().setLoading(true);
		try {
			const languages: LanguageDTO[] = await apiClient.languages.getLanguages();
			setLanguages(languages);
			return languages;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch languages";
			setError(errorMessage);
			useLanguagesStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
			useLanguagesStore.getState().setLoading(false);
		}
	}, [setLanguages]);

	const fetchLanguageById = useCallback(async (languageId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			const language: LanguageDTO = await apiClient.languages.getLanguageById(languageId);
			return language;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch language";
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createLanguage = useCallback(async (data: CreateLanguageRequestDTO) => {
		setIsLoading(true);
		setError(null);
		try {
			const language: LanguageDTO = await apiClient.languages.createLanguage(data);
			addLanguage(language);
			return language;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to create language";
			setError(errorMessage);
			useLanguagesStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [addLanguage]);

	const updateLanguageById = useCallback(async (languageId: number, data: UpdateLanguageRequestDTO) => {
		setIsLoading(true);
		setError(null);
		try {
			const language: LanguageDTO = await apiClient.languages.updateLanguage(languageId, data);
			updateLanguage(languageId, language);
			return language;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to update language";
			setError(errorMessage);
			useLanguagesStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [updateLanguage]);

	const deleteLanguage = useCallback(async (languageId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			await apiClient.languages.deleteLanguage(languageId);
			removeLanguage(languageId);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete language";
			setError(errorMessage);
			useLanguagesStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [removeLanguage]);

	return {
		fetchLanguages,
		fetchLanguageById,
		createLanguage,
		updateLanguageById,
		deleteLanguage,
		isLoading,
		error,
	};
};
