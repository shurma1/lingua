import { create } from "zustand";

import { LanguageDTO } from "@/types/api";

interface LanguagesState {
	languages: LanguageDTO[];
	selectedLanguageId: number | null;
	isLoading: boolean;
	error: string | null;
	
	// Actions
	setLanguages: (languages: LanguageDTO[]) => void;
	addLanguage: (language: LanguageDTO) => void;
	updateLanguage: (languageId: number, language: LanguageDTO) => void;
	removeLanguage: (languageId: number) => void;
	setSelectedLanguageId: (languageId: number | null) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	clearLanguages: () => void;
}

export const useLanguagesStore = create<LanguagesState>((set) => ({
	languages: [],
	selectedLanguageId: null,
	isLoading: false,
	error: null,

	setLanguages: (languages) => set({ languages, error: null }),
	
	addLanguage: (language) => set((state) => ({
		languages: [...state.languages, language],
		error: null,
	})),
	
	updateLanguage: (languageId, language) => set((state) => ({
		languages: state.languages.map((l) => 
			l.id === languageId ? language : l,
		),
		error: null,
	})),
	
	removeLanguage: (languageId) => set((state) => ({
		languages: state.languages.filter((l) => l.id !== languageId),
		error: null,
	})),
	
	setSelectedLanguageId: (languageId) => set({ selectedLanguageId: languageId }),
	
	setLoading: (isLoading) => set({ isLoading }),
	
	setError: (error) => set({ error, isLoading: false }),
	
	clearLanguages: () => set({ 
		languages: [], 
		selectedLanguageId: null, 
		error: null, 
	}),
}));
