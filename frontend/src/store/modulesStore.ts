import { create } from "zustand";

import { ModuleDTO } from "@/types/api";

interface ModulesState {
	modules: ModuleDTO[];
	currentModuleId: number | null;
	isLoading: boolean;
	error: string | null;
	
	setModules: (modules: ModuleDTO[]) => void;
	addModule: (module: ModuleDTO) => void;
	updateModule: (moduleId: number, module: ModuleDTO) => void;
	removeModule: (moduleId: number) => void;
	setCurrentModuleId: (moduleId: number | null) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	clearModules: () => void;
}

// Initialize currentModuleId from localStorage
const getInitialModuleId = (): number | null => {
	const savedModuleId = localStorage.getItem("currentModuleId");
	if (savedModuleId) {
		const moduleId = Number(savedModuleId);
		return !isNaN(moduleId) ? moduleId : null;
	}
	return null;
};

export const useModulesStore = create<ModulesState>((set) => ({
	modules: [],
	currentModuleId: getInitialModuleId(),
	isLoading: false,
	error: null,

	setModules: (modules) => set({ modules, error: null }),
	
	addModule: (module) => set((state) => ({
		modules: [...state.modules, module],
		error: null,
	})),
	
	updateModule: (moduleId, module) => set((state) => ({
		modules: state.modules.map((m) => 
			m.id === moduleId ? module : m,
		),
		error: null,
	})),
	
	removeModule: (moduleId) => set((state) => ({
		modules: state.modules.filter((m) => m.id !== moduleId),
		error: null,
	})),
	
	setCurrentModuleId: (moduleId) => {
		if (moduleId !== null) {
			localStorage.setItem("currentModuleId", moduleId.toString());
		}
		set({ currentModuleId: moduleId });
	},
	
	setLoading: (isLoading) => set({ isLoading }),
	
	setError: (error) => set({ error, isLoading: false }),
	
	clearModules: () => set({ 
		modules: [], 
		currentModuleId: null, 
		error: null, 
	}),
}));
