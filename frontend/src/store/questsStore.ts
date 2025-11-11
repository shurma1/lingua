import { create } from "zustand";

import { QuestDTO } from "@/types/api";

interface QuestsState {
	quests: QuestDTO[];
	currentQuestId: number | null;
	isLoading: boolean;
	error: string | null;
	
	setQuests: (quests: QuestDTO[]) => void;
	addQuest: (quest: QuestDTO) => void;
	updateQuest: (questId: number, quest: QuestDTO) => void;
	removeQuest: (questId: number) => void;
	setCurrentQuestId: (questId: number | null) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	clearQuests: () => void;
}

export const useQuestsStore = create<QuestsState>((set) => ({
	quests: [],
	currentQuestId: null,
	isLoading: false,
	error: null,

	setQuests: (quests) => set({ quests, error: null }),
	
	addQuest: (quest) => set((state) => ({
		quests: [...state.quests, quest],
		error: null,
	})),
	
	updateQuest: (questId, quest) => set((state) => ({
		quests: state.quests.map((q) => 
			q.id === questId ? quest : q,
		),
		error: null,
	})),
	
	removeQuest: (questId) => set((state) => ({
		quests: state.quests.filter((q) => q.id !== questId),
		error: null,
	})),
	
	setCurrentQuestId: (questId) => set({ currentQuestId: questId }),
	
	setLoading: (isLoading) => set({ isLoading }),
	
	setError: (error) => set({ error, isLoading: false }),
	
	clearQuests: () => set({ 
		quests: [], 
		currentQuestId: null, 
		error: null, 
	}),
}));
