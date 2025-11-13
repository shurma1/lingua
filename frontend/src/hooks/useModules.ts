import { useState, useCallback } from "react";

import { useModulesStore } from "@store/modulesStore";

import { apiClient } from "@/http";
import { ModuleDTO, CreateModuleRequestDTO, UpdateModuleRequestDTO } from "@/types/api";

export const useModules = () => {
	const { modules, currentModuleId, isLoading, error } = useModulesStore();
	
	return {
		modules,
		currentModuleId,
		isLoading,
		error,
	};
};

export const useModulesMutations = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setModules, addModule, updateModule, removeModule } = useModulesStore();

	const fetchModulesByLanguage = useCallback(async (languageId: number) => {
		setIsLoading(true);
		setError(null);
		useModulesStore.getState().setLoading(true);
		try {
			const modules: ModuleDTO[] = await apiClient.modules.getModulesByLanguage(languageId);
			setModules(modules);
			return modules;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch modules";
			setError(errorMessage);
			useModulesStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
			useModulesStore.getState().setLoading(false);
		}
	}, [setModules]);

	const fetchModuleById = useCallback(async (moduleId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			const module: ModuleDTO = await apiClient.modules.getModuleById(moduleId);
			return module;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch module";
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createModule = useCallback(async (data: CreateModuleRequestDTO) => {
		setIsLoading(true);
		setError(null);
		try {
			const module: ModuleDTO = await apiClient.modules.createModule(data);
			addModule(module);
			return module;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to create module";
			setError(errorMessage);
			useModulesStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [addModule]);

	const updateModuleById = useCallback(async (moduleId: number, data: UpdateModuleRequestDTO) => {
		setIsLoading(true);
		setError(null);
		try {
			const module: ModuleDTO = await apiClient.modules.updateModule(moduleId, data);
			updateModule(moduleId, module);
			return module;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to update module";
			setError(errorMessage);
			useModulesStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [updateModule]);

	const deleteModule = useCallback(async (moduleId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			await apiClient.modules.deleteModule(moduleId);
			removeModule(moduleId);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete module";
			setError(errorMessage);
			useModulesStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [removeModule]);

	return {
		fetchModulesByLanguage,
		fetchModuleById,
		createModule,
		updateModuleById,
		deleteModule,
		isLoading,
		error,
	};
};
