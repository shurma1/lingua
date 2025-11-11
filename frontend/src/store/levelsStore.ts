import { create } from "zustand";

import { LevelDTO } from "@/types/api";

interface LevelsState {
	levels: LevelDTO[];
	currentLevelId: number | null;
	isLoading: boolean;
	error: string | null;
	
	setLevels: (levels: LevelDTO[]) => void;
	addLevel: (level: LevelDTO) => void;
	updateLevel: (levelId: number, level: LevelDTO) => void;
	removeLevel: (levelId: number) => void;
	setCurrentLevelId: (levelId: number | null) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	clearLevels: () => void;
}

export const useLevelsStore = create<LevelsState>((set) => ({
	levels: [],
	currentLevelId: null,
	isLoading: false,
	error: null,

	setLevels: (levels) => set({ levels, error: null }),
	
	addLevel: (level) => set((state) => ({
		levels: [...state.levels, level],
		error: null,
	})),
	
	updateLevel: (levelId, level) => set((state) => ({
		levels: state.levels.map((l) => 
			l.id === levelId ? level : l,
		),
		error: null,
	})),
	
	removeLevel: (levelId) => set((state) => ({
		levels: state.levels.filter((l) => l.id !== levelId),
		error: null,
	})),
	
	setCurrentLevelId: (levelId) => set({ currentLevelId: levelId }),
	
	setLoading: (isLoading) => set({ isLoading }),
	
	setError: (error) => set({ error, isLoading: false }),
	
	clearLevels: () => set({ 
		levels: [], 
		currentLevelId: null, 
		error: null, 
	}),
}));
