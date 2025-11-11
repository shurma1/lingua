import { create } from "zustand";

import { LeaderboardDTO, LeaderboardType } from "@/types/api";

interface LeaderboardState {
	allLeaderboard: LeaderboardDTO | null;
	friendsLeaderboard: LeaderboardDTO | null;
	isLoading: boolean;
	error: string | null;
	
	setLeaderboard: (type: LeaderboardType, leaderboard: LeaderboardDTO) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	clearLeaderboard: () => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
	allLeaderboard: null,
	friendsLeaderboard: null,
	isLoading: false,
	error: null,

	setLeaderboard: (type, leaderboard) => set({
		...(type === "all" 
			? { allLeaderboard: leaderboard } 
			: { friendsLeaderboard: leaderboard }
		),
		error: null,
	}),
	
	setLoading: (isLoading) => set({ isLoading }),
	
	setError: (error) => set({ error, isLoading: false }),
	
	clearLeaderboard: () => set({ 
		allLeaderboard: null, 
		friendsLeaderboard: null, 
		error: null, 
	}),
}));
